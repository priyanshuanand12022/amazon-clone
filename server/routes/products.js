const express = require('express');
const router = express.Router();
const categoryRouter = express.Router();
const db = require('../db');

// GET /api/products - List products with search and category filter
router.get('/', async (req, res) => {
  try {
    const { search, category, sort, limit, offset } = req.query;
    let query = `
      SELECT p.*, c.name AS category_name, c.slug AS category_slug,
             (
               SELECT url
               FROM product_images pi
               WHERE pi.product_id = p.id AND pi.is_primary = TRUE
               LIMIT 1
             ) AS primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1 = 1
    `;
    const params = [];

    if (search) {
      query += ' AND (LOWER(p.name) LIKE ? OR LOWER(p.description) LIKE ? OR LOWER(p.brand) LIKE ?)';
      const searchTerm = `%${search.toLowerCase()}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (category) {
      query += ' AND c.slug = ?';
      params.push(category);
    }

    switch (sort) {
      case 'price-low':
        query += ' ORDER BY p.price ASC';
        break;
      case 'price-high':
        query += ' ORDER BY p.price DESC';
        break;
      case 'rating':
        query += ' ORDER BY p.rating DESC';
        break;
      case 'newest':
        query += ' ORDER BY p.created_at DESC';
        break;
      default:
        query += ' ORDER BY p.review_count DESC';
    }

    if (limit) {
      query += ' LIMIT ?';
      params.push(Number(limit));

      if (offset) {
        query += ' OFFSET ?';
        params.push(Number(offset));
      }
    } else if (offset) {
      query += ' LIMIT 18446744073709551615 OFFSET ?';
      params.push(Number(offset));
    }

    const rows = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id - Get single product with all images
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const productRows = await db.query(`
      SELECT p.*, c.name AS category_name, c.slug AS category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [id]);

    if (productRows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const imagesRows = await db.query(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order',
      [id]
    );

    const product = productRows[0];
    const relatedRows = await db.query(`
      SELECT p.*,
             (
               SELECT url
               FROM product_images pi
               WHERE pi.product_id = p.id AND pi.is_primary = TRUE
               LIMIT 1
             ) AS primary_image
      FROM products p
      WHERE p.category_id = ? AND p.id != ?
      ORDER BY p.rating DESC
      LIMIT 4
    `, [product.category_id, id]);

    res.json({
      ...product,
      images: imagesRows,
      related_products: relatedRows,
    });
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// GET /api/categories - List all categories
categoryRouter.get('/', async (req, res) => {
  try {
    const rows = await db.query(`
      SELECT c.id, c.name, c.slug, c.image_url, COUNT(p.id) AS product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      GROUP BY c.id, c.name, c.slug, c.image_url
      ORDER BY c.name
    `);

    res.json(rows);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

module.exports = router;
module.exports.categoryRouter = categoryRouter;
