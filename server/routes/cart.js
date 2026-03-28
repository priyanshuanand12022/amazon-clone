const express = require('express');
const router = express.Router();
const db = require('../db');

const USER_ID = 1; // Default user

// GET /api/cart - Get all cart items
router.get('/', async (req, res) => {
  try {
    const items = await db.query(`
      SELECT ci.id, ci.quantity, ci.added_at,
             p.id AS product_id, p.name, p.price, p.stock, p.brand,
             (
               SELECT url
               FROM product_images pi
               WHERE pi.product_id = p.id AND pi.is_primary = TRUE
               LIMIT 1
             ) AS image
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
      ORDER BY ci.added_at DESC
    `, [USER_ID]);

    const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);

    res.json({
      items,
      item_count: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: subtotal.toFixed(2),
      total: subtotal.toFixed(2),
    });
  } catch (err) {
    console.error('Error fetching cart:', err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// POST /api/cart - Add item to cart
router.post('/', async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const productRows = await db.query('SELECT * FROM products WHERE id = ?', [product_id]);
    if (productRows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = productRows[0];
    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    await db.query(`
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
    `, [USER_ID, product_id, quantity]);

    const updatedRows = await db.query(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
      [USER_ID, product_id]
    );

    res.status(201).json(updatedRows[0]);
  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

// PUT /api/cart/:id - Update cart item quantity
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const cartRows = await db.query(`
      SELECT ci.*, p.stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.id = ? AND ci.user_id = ?
    `, [id, USER_ID]);

    if (cartRows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (quantity > cartRows[0].stock) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    await db.query(
      'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?',
      [quantity, id, USER_ID]
    );

    const updatedRows = await db.query(
      'SELECT * FROM cart_items WHERE id = ? AND user_id = ?',
      [id, USER_ID]
    );

    res.json(updatedRows[0]);
  } catch (err) {
    console.error('Error updating cart:', err);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// DELETE /api/cart/:id - Remove item from cart
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const existingRows = await db.query(
      'SELECT * FROM cart_items WHERE id = ? AND user_id = ?',
      [id, USER_ID]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    await db.query(
      'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
      [id, USER_ID]
    );

    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error('Error removing from cart:', err);
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
});

// DELETE /api/cart - Clear entire cart
router.delete('/', async (req, res) => {
  try {
    await db.query('DELETE FROM cart_items WHERE user_id = ?', [USER_ID]);
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    console.error('Error clearing cart:', err);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

// GET /api/cart/count - Get cart item count
router.get('/count', async (req, res) => {
  try {
    const rows = await db.query(
      'SELECT COALESCE(SUM(quantity), 0) AS count FROM cart_items WHERE user_id = ?',
      [USER_ID]
    );
    res.json({ count: Number(rows[0].count) });
  } catch (err) {
    console.error('Error fetching cart count:', err);
    res.status(500).json({ error: 'Failed to fetch cart count' });
  }
});

module.exports = router;
