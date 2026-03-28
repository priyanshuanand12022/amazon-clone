import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getOrder } from '../api'
import { formatIndianCurrency } from '../utils/currency'

function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder(id)
      .then(res => setOrder(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (!order) {
    return (
      <div className="order-confirmation">
        <h1>Order not found</h1>
        <Link to="/" className="cart-empty-btn">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="order-confirmation">
      <div className="order-confirmation-checkmark">
        <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
      </div>

      <h1>Order Placed, Thank You!</h1>
      <p className="order-id">Order # <strong>{order.id}</strong></p>
      <p style={{ color: '#565959', marginBottom: '32px', fontSize: '0.95rem' }}>
        Confirmation will be sent to your email address.
      </p>

      <div className="order-confirmation-details">
        <h3>Order Details</h3>
        {order.items && order.items.map((item, idx) => (
          <div key={idx} className="order-confirmation-item">
            <img src={item.product_image || 'https://via.placeholder.com/60'} alt={item.product_name} />
            <div className="order-confirmation-item-info">
              <div className="order-confirmation-item-name">{item.product_name}</div>
              <div className="order-confirmation-item-qty">Qty: {item.quantity}</div>
            </div>
            <div className="order-confirmation-item-price">
              {formatIndianCurrency(parseFloat(item.price) * item.quantity)}
            </div>
          </div>
        ))}

        <div className="cart-summary-total" style={{ marginTop: '16px', paddingTop: '16px' }}>
          <span>Order Total:</span>
          <span>{formatIndianCurrency(order.total)}</span>
        </div>
      </div>

      <div className="order-confirmation-shipping">
        <h3>Shipping Address</h3>
        <p>
          {order.shipping_name}<br />
          {order.shipping_address}<br />
          {order.shipping_city}, {order.shipping_state} {order.shipping_zip}
          {order.shipping_phone && <><br />{order.shipping_phone}</>}
        </p>
      </div>

      <div className="order-confirmation-actions">
        <Link to="/orders" className="btn-secondary">View All Orders</Link>
        <Link to="/" className="btn-primary">Continue Shopping</Link>
      </div>
    </div>
  );
}

export default OrderConfirmation;
