# Amazon Clone

An Amazon-inspired full-stack e-commerce project with a React + Vite frontend, an Express backend, and MySQL for product, cart, and order data.

The project now includes:
- Amazon-style homepage and top navigation
- Product listing, product detail, cart, checkout, order confirmation, and orders pages
- Extra shopping sections like `Sell`
- MySQL-backed categories, products, images, cart items, and orders
- Deployment-ready frontend for Vercel and backend for Render

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router |
| Backend | Node.js, Express |
| Database | MySQL |
| API Client | Axios |
| Styling | Vanilla CSS |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |
| Cloud Database | Railway MySQL |

## Features

### Storefront
- Amazon-inspired navbar, logo, category strip, hero carousel, and shopping sections
- Product grid with category filters, sorting, and search
- Product detail page with image gallery, rating, buy box, and related products
- INR pricing with `₹` currency formatting across the app

### Shopping Flow
- Add to cart
- Update quantities and remove items
- Checkout with shipping form
- Order confirmation page
- Orders page with ordered product image, quantity, and pricing

### Additional Pages
- Seller-inspired `Sell` landing page
- Extra catalog categories such as Appliances, Office Supplies, Pet Supplies, and Automotive

## Project Structure

```text
Amazon Clone/
|-- client/
|   |-- public/
|   |   `-- amazon-clone-favicon.svg
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- utils/
|   |   |-- api.js
|   |   |-- App.jsx
|   |   `-- index.css
|   |-- .env.example
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
|-- vercel.json
`-- README.md
```

## Database Tables

The backend uses these tables:
- `categories`
- `products`
- `product_images`
- `cart_items`
- `orders`
- `order_items`

## Local Setup

### Prerequisites

- Node.js 24.x
- MySQL 8+

### 1. Create a database

```sql
CREATE DATABASE amazon_clone CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configure backend environment variables

Create or edit `server/.env`.

Example:

```env
PORT=5001
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=YOUR_PASSWORD
MYSQL_DATABASE=amazon_clone
```

You can also use:

```env
MYSQL_URL=mysql://root:YOUR_PASSWORD@127.0.0.1:3306/amazon_clone
```

### 3. Install dependencies

Backend:

```bash
cd server
npm install
```

Frontend:

```bash
cd client
npm install
```

### 4. Seed sample data

```bash
cd server
npm run seed
```

Warning:
- `npm run seed` recreates schema and sample data
- do not run it on a production database unless you want to reset it

### 5. Start the backend

```bash
cd server
npm start
```

Backend runs on:
- `http://localhost:5001`

### 6. Start the frontend

```bash
cd client
npm run dev
```

Frontend runs on:
- `http://localhost:5173`

## Environment Variables

### Frontend

The frontend supports a deploy-time backend URL:

```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

If not set, the app falls back to `/api`, which works locally with the Vite proxy.

See:
- [client/.env.example](./client/.env.example)

### Backend

Supported backend variables:

```env
PORT=5001
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=YOUR_PASSWORD
MYSQL_DATABASE=amazon_clone
```

or:

```env
MYSQL_URL=mysql://root:YOUR_PASSWORD@127.0.0.1:3306/amazon_clone
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Root deployment check |
| GET | `/api/health` | Health check |
| GET | `/api/products` | List products |
| GET | `/api/products/:id` | Product detail with images and related products |
| GET | `/api/categories` | List categories |
| GET | `/api/cart` | Get cart |
| GET | `/api/cart/count` | Cart count |
| POST | `/api/cart` | Add item to cart |
| PUT | `/api/cart/:id` | Update cart quantity |
| DELETE | `/api/cart/:id` | Remove cart item |
| DELETE | `/api/cart` | Clear cart |
| POST | `/api/orders` | Place order |
| GET | `/api/orders` | List orders |
| GET | `/api/orders/:id` | Order detail |

## Deployment

### Frontend on Vercel

This repo is configured for Vercel using:
- [vercel.json](./vercel.json)

Important details:
- Vercel project should be created from the repo root
- frontend build runs from `client`
- output directory is `client/dist`
- SPA routes are rewritten to `index.html`
- `/api/*` is excluded from that frontend rewrite

Set this environment variable in Vercel:

```env
VITE_API_BASE_URL=https://your-render-backend.onrender.com/api
```

Then redeploy the Vercel project.

### Backend on Render

Recommended Render settings:
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`
- Runtime: `Node`

Set backend environment variables in Render:

```env
MYSQL_HOST=...
MYSQL_PORT=...
MYSQL_USER=...
MYSQL_PASSWORD=...
MYSQL_DATABASE=...
```

The backend root URL returns a deployment check JSON response.

### Database on Railway

Recommended production setup:
- MySQL database hosted on Railway
- Render backend connected to Railway through MySQL env vars
- Vercel frontend connected to Render through `VITE_API_BASE_URL`

If you already have local MySQL data in Workbench, you can export your local DB and import it into Railway instead of reseeding.

## Notes

- The app assumes a default logged-in user with ID `1`
- Authentication is out of scope
- Shipping is currently free
- Product images use hosted sample image URLs
- Render root `/` now returns backend status JSON instead of `Cannot GET /`

## Current Deployment Flow

Working flow for this project:

1. Railway hosts MySQL
2. Render hosts the Express backend
3. Vercel hosts the React frontend
4. Vercel uses `VITE_API_BASE_URL` to call the Render backend

