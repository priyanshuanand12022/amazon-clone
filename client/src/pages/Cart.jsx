import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCart, updateCartItem, removeCartItem } from '../api'
import { formatIndianCurrency } from '../utils/currency'

function Cart({ onCartUpdate }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data);
    } catch (err) {
      console.error('Failed to fetch cart');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQty = async (id, newQty) => {
    if (newQty < 1) return;
    try {
      await updateCartItem(id, newQty);
      fetchCart();
      if (onCartUpdate) onCartUpdate();
    } catch (err) {
      console.error('Failed to update quantity');
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeCartItem(id);
      fetchCart();
      if (onCartUpdate) onCartUpdate();
    } catch (err) {
      console.error('Failed to remove item');
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <h2>Your Amazon Clone Cart is empty</h2>
          <p>Your shopping cart is waiting. Give it purpose - fill it with groceries, clothing, household supplies, electronics, and more.</p>
          <Link to="/" className="cart-empty-btn">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.items.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image" onClick={() => navigate(`/product/${item.product_id}`)}>
                <img src={item.image || 'https://via.placeholder.com/180'} alt={item.name} />
              </div>
              <div className="cart-item-details">
                <div className="cart-item-name" onClick={() => navigate(`/product/${item.product_id}`)}>
                  {item.name}
                </div>
                <div className="cart-item-stock">In Stock</div>
                <div className="cart-item-price">{formatIndianCurrency(item.price)}</div>
                <div className="cart-item-actions">
                  <div className="cart-item-qty">
                    <button onClick={() => handleUpdateQty(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleUpdateQty(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <span className="cart-item-divider">|</span>
                  <button className="cart-item-delete" onClick={() => handleRemove(item.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="cart-summary-row">
            <span>Items ({cart.item_count}):</span>
            <span>{formatIndianCurrency(cart.subtotal)}</span>
          </div>
          <div className="cart-summary-row">
            <span>Shipping:</span>
            <span style={{ color: '#007600' }}>FREE</span>
          </div>
          <div className="cart-summary-total">
            <span>Subtotal ({cart.item_count} items):</span>
            <span>{formatIndianCurrency(cart.total)}</span>
          </div>
          <button className="checkout-btn" onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
