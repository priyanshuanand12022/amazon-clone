# Amazon Clone - E-Commerce Platform

A full-stack e-commerce web application inspired by Amazon's browsing, product detail, cart, and checkout experience.

## Features

### Core
- Product listing page with search, category filters, sorting, and add-to-cart actions
- Product detail page with image carousel, pricing, stock status, and related products
- Shopping cart with quantity updates, item removal, subtotal, and total
- Checkout page with shipping form and order summary
- Order confirmation page with order ID and purchased items
- Order history page for previously placed orders

### UI and UX
- Amazon-inspired header, layout, product cards, buy box, and cart flow
- Responsive design for desktop, tablet, and mobile
- Seeded sample products across multiple categories

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router |
| Backend | Node.js, Express.js |
| Database | MySQL |
| HTTP Client | Axios |
| Styling | Vanilla CSS |

## Project Structure

```text
Amazon Clone/
|-- client/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- api.js
|   |   |-- App.jsx
|   |   `-- index.css
|   |-- index.html
|   |-- package.json
|   `-- vite.config.js
|-- server/
|   |-- routes/
|   |   |-- cart.js
|   |   |-- orders.js
|   |   `-- products.js
|   |-- db.js
|   |-- index.js
|   |-- schema.sql
|   |-- seed.js
|   `-- package.json
`-- README.md
```

## Database Schema

Tables:
- `categories`
- `products`
- `product_images`
- `cart_items`
- `orders`
- `order_items`

Design notes:
- `product_images` supports multi-image product galleries
- `cart_items` enforces one row per user/product pair with a unique constraint
- `order_items` stores a purchase-time snapshot of name, image, price, and quantity
- indexes are added for common lookup paths

## Setup Instructions

### Prerequisites

- Node.js 18 or newer
- MySQL 8 or newer

### 1. Create the database

```sql
CREATE DATABASE amazon_clone CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configure environment variables

Edit `server/.env` using either a connection URL or discrete fields.

Option 1:

```env
PORT=5000
MYSQL_URL=mysql://root:YOUR_PASSWORD@localhost:3306/amazon_clone
```

Option 2:

```env
PORT=5000
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=YOUR_PASSWORD
MYSQL_DATABASE=amazon_clone
```

### 3. Install dependencies and seed data

```bash
cd server
npm install
npm run seed
```

### 4. Start the backend

```bash
cd server
npm start
```

Backend runs on `http://localhost:5000`.

### 5. Start the frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | List products with search, category, sort, limit, and offset |
| GET | `/api/products/:id` | Fetch a single product with images and related products |
| GET | `/api/categories` | List categories |
| GET | `/api/cart` | Fetch cart contents |
| GET | `/api/cart/count` | Fetch cart item count |
| POST | `/api/cart` | Add an item to cart |
| PUT | `/api/cart/:id` | Update cart item quantity |
| DELETE | `/api/cart/:id` | Remove a cart item |
| DELETE | `/api/cart` | Clear the cart |
| POST | `/api/orders` | Place an order |
| GET | `/api/orders` | List previous orders |
| GET | `/api/orders/:id` | Fetch a specific order |

## Assumptions

- A default user with ID `1` is assumed to be logged in
- Authentication is intentionally out of scope for this assignment
- Shipping is free for all orders
- Product images use sample hosted image URLs

## Notes

- Update `server/.env` with your MySQL credentials before starting the backend.
- Run `npm install` in `server` after this database migration so the `mysql2` package is installed locally.
