require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');

const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', require('./routes/products').categoryRouter);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Root route for deployment checks
app.get('/', (req, res) => {
  res.json({
    message: 'Amazon Clone backend is running',
    health: '/api/health',
    products: '/api/products',
    categories: '/api/categories',
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const server = http.createServer(app);

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Update PORT in server/.env or stop the process using that port.`);
    process.exit(1);
  }

  throw err;
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
