import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCart, placeOrder } from '../api'
import { formatIndianCurrency } from '../utils/currency'

function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [formData, setFormData] = useState({
    shipping_name: '',
    shipping_address: '',
    shipping_city: '',
    shipping_state: '',
    shipping_zip: '',
    shipping_phone: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getCart()
      .then(res => {
        if (res.data.items.length === 0) {
          navigate('/cart');
          return;
        }
        setCart(res.data);
      })
      .catch(() => navigate('/cart'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.shipping_name.trim()) newErrors.shipping_name = 'Full name is required';
    if (!formData.shipping_address.trim()) newErrors.shipping_address = 'Address is required';
    if (!formData.shipping_city.trim()) newErrors.shipping_city = 'City is required';
    if (!formData.shipping_state.trim()) newErrors.shipping_state = 'State is required';
    if (!formData.shipping_zip.trim()) newErrors.shipping_zip = 'ZIP code is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validate() || placing) return;

    setPlacing(true);
    try {
      const res = await placeOrder(formData);
      navigate(`/order-confirmation/${res.data.order.id}`);
    } catch (err) {
      console.error('Failed to place order');
      alert(err.response?.data?.error || 'Failed to place order. Please try again.');
    }
    setPlacing(false);
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (!cart) return null;

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handlePlaceOrder}>
          <h2>Shipping Address</h2>

          <div className="form-group">
            <label htmlFor="shipping_name">Full Name</label>
            <input
              id="shipping_name"
              name="shipping_name"
              type="text"
              placeholder="John Doe"
              value={formData.shipping_name}
              onChange={handleChange}
              style={errors.shipping_name ? { borderColor: '#b12704' } : {}}
            />
            {errors.shipping_name && <span style={{ color: '#b12704', fontSize: '0.8rem' }}>{errors.shipping_name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="shipping_address">Street Address</label>
            <input
              id="shipping_address"
              name="shipping_address"
              type="text"
              placeholder="123 Main Street, Apt 4B"
              value={formData.shipping_address}
              onChange={handleChange}
              style={errors.shipping_address ? { borderColor: '#b12704' } : {}}
            />
            {errors.shipping_address && <span style={{ color: '#b12704', fontSize: '0.8rem' }}>{errors.shipping_address}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="shipping_city">City</label>
              <input
                id="shipping_city"
                name="shipping_city"
                type="text"
                placeholder="New York"
                value={formData.shipping_city}
                onChange={handleChange}
                style={errors.shipping_city ? { borderColor: '#b12704' } : {}}
              />
              {errors.shipping_city && <span style={{ color: '#b12704', fontSize: '0.8rem' }}>{errors.shipping_city}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="shipping_state">State</label>
              <input
                id="shipping_state"
                name="shipping_state"
                type="text"
                placeholder="NY"
                value={formData.shipping_state}
                onChange={handleChange}
                style={errors.shipping_state ? { borderColor: '#b12704' } : {}}
              />
              {errors.shipping_state && <span style={{ color: '#b12704', fontSize: '0.8rem' }}>{errors.shipping_state}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="shipping_zip">ZIP Code</label>
              <input
                id="shipping_zip"
                name="shipping_zip"
                type="text"
                placeholder="10001"
                value={formData.shipping_zip}
                onChange={handleChange}
                style={errors.shipping_zip ? { borderColor: '#b12704' } : {}}
              />
              {errors.shipping_zip && <span style={{ color: '#b12704', fontSize: '0.8rem' }}>{errors.shipping_zip}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="shipping_phone">Phone (optional)</label>
              <input
                id="shipping_phone"
                name="shipping_phone"
                type="tel"
                placeholder="(555) 555-5555"
                value={formData.shipping_phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="place-order-btn"
            disabled={placing}
          >
            {placing ? 'Placing Order...' : 'Place Your Order'}
          </button>
        </form>

        <div className="checkout-summary">
          <h3>Order Summary</h3>
          <div className="checkout-summary-items">
            {cart.items.map(item => (
              <div key={item.id} className="checkout-summary-item">
                <img src={item.image || 'https://via.placeholder.com/50'} alt={item.name} />
                <div className="checkout-summary-item-info">
                  <div className="checkout-summary-item-name">{item.name}</div>
                  <div className="checkout-summary-item-qty">Qty: {item.quantity}</div>
                </div>
                <div className="checkout-summary-item-price">
                  {formatIndianCurrency(parseFloat(item.price) * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary-row">
            <span>Items ({cart.item_count}):</span>
            <span>{formatIndianCurrency(cart.subtotal)}</span>
          </div>
          <div className="cart-summary-row">
            <span>Shipping:</span>
            <span style={{ color: '#007600' }}>FREE</span>
          </div>
          <div className="cart-summary-total">
            <span>Order Total:</span>
            <span>{formatIndianCurrency(cart.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
