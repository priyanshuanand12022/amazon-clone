import { Routes, Route } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import Orders from './pages/Orders'
import Sell from './pages/Sell'
import { getCartCount } from './api'

function App() {
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = useCallback(async () => {
    try {
      const res = await getCartCount();
      setCartCount(res.data.count);
    } catch (err) {
      console.error('Failed to fetch cart count');
    }
  }, []);

  useEffect(() => {
    refreshCartCount();
  }, [refreshCartCount]);

  return (
    <div className="app">
      <ScrollToTop />
      <Navbar cartCount={cartCount} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home onCartUpdate={refreshCartCount} />} />
          <Route path="/product/:id" element={<ProductDetail onCartUpdate={refreshCartCount} />} />
          <Route path="/cart" element={<Cart onCartUpdate={refreshCartCount} />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/sell" element={<Sell />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
