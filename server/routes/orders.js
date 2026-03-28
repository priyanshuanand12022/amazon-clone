const express = require('express');
const router = express.Router();
const db = require('../db');

const USER_ID = 1; // Default user

// POST /api/orders - Place an order from cart
router.post('/', async (req, res) => {
  let client;
  let transactionStarted = false;

  try {
    const { shipping_name, shipping_address, shipping_city, shipping_state, shipping_zip, shipping_phone } = req.body;

    if (!shipping_name || !shipping_address || !shipping_city || !shipping_state || !shipping_zip) {
      return res.status(400).json({ error: 'All shipping fields are required' });
    }

    client = await db.getConnection();
    await client.beginTransaction();
    transactionStarted = true;

    const [cartRows] = await client.query(`
      SELECT ci.*, p.name AS product_name, p.price, p.stock,
             (
               SELECT url
               FROM product_images pi
               WHERE pi.product_id = p.id AND pi.is_primary = TRUE
               LIMIT 1
             ) AS product_image
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
    `, [USER_ID]);

    if (cartRows.length === 0) {
      await client.rollback();
      transactionStarted = false;
      return res.status(400).json({ error: 'Cart is empty' });
    }

    for (const item of cartRows) {
      if (item.quantity > item.stock) {
        await client.rollback();
        transactionStarted = false;
        return res.status(400).json({ error: `Insufficient stock for ${item.product_name}` });
      }
    }

    const total = cartRows.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);

    const [orderInsert] = await client.query(`
      INSERT INTO orders (
        user_id, total, shipping_name, shipping_address, shipping_city, shipping_state, shipping_zip, shipping_phone
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [USER_ID, total.toFixed(2), shipping_name, shipping_address, shipping_city, shipping_state, shipping_zip, shipping_phone || null]);

    const [orderRows] = await client.query(
      'SELECT * FROM orders WHERE id = ?',
      [orderInsert.insertId]
    );
    const order = orderRows[0];

    for (const item of cartRows) {
      await client.query(`
        INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [order.id, item.product_id, item.product_name, item.product_image, item.price, item.quantity]);

      await client.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    await client.query('DELETE FROM cart_items WHERE user_id = ?', [USER_ID]);
    await client.commit();
    transactionStarted = false;

    res.status(201).json({
      message: 'Order placed successfully',
      order: {
        ...order,
        items: cartRows.map(item => ({
          product_id: item.product_id,
          product_name: item.product_name,
          product_image: item.product_image,
          price: item.price,
          quantity: item.quantity,
        })),
      },
    });
  } catch (err) {
    if (client && transactionStarted) {
      await client.rollback();
    }
    console.error('Error placing order:', err);
    res.status(500).json({ error: 'Failed to place order' });
  } finally {
    if (client) {
      client.release();
    }
  }
});

// GET /api/orders - Get order history
router.get('/', async (req, res) => {
  try {
    const rows = await db.query(`
      SELECT o.*,
             (
               SELECT COUNT(*)
               FROM order_items oi
               WHERE oi.order_id = o.id
             ) AS item_count
      FROM orders o
      WHERE o.user_id = ?
      ORDER BY o.placed_at DESC
    `, [USER_ID]);

    if (rows.length === 0) {
      return res.json([]);
    }

    const orderIds = rows.map((order) => order.id);
    const placeholders = orderIds.map(() => '?').join(', ');
    const itemRows = await db.query(`
      SELECT order_id, product_id, product_name, product_image, price, quantity
      FROM order_items
      WHERE order_id IN (${placeholders})
      ORDER BY order_id DESC, id ASC
    `, orderIds);

    const itemsByOrderId = itemRows.reduce((groups, item) => {
      if (!groups[item.order_id]) {
        groups[item.order_id] = [];
      }

      groups[item.order_id].push(item);
      return groups;
    }, {});

    const ordersWithItems = rows.map((order) => ({
      ...order,
      items: itemsByOrderId[order.id] || [],
    }));

    res.json(ordersWithItems);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/orders/:id - Get order detail
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const orderRows = await db.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [id, USER_ID]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const itemRows = await db.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [id]
    );

    res.json({
      ...orderRows[0],
      items: itemRows,
    });
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

module.exports = router;
