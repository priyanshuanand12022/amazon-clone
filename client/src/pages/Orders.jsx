import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getOrder, getOrders } from '../api'
import { formatIndianCurrency } from '../utils/currency'

function formatOrderDate(value) {
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await getOrders();
        const baseOrders = res.data || [];

        const ordersWithItems = await Promise.all(
          baseOrders.map(async (order) => {
            if (Array.isArray(order.items) && order.items.length > 0) {
              return order;
            }

            try {
              const detailRes = await getOrder(order.id);
              return {
                ...order,
                items: detailRes.data.items || [],
              };
            } catch (err) {
              return {
                ...order,
                items: [],
              };
            }
          })
        );

        setOrders(ordersWithItems);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="orders-page">
      <h1>Your Orders</h1>

      {orders.length === 0 ? (
        <div className="cart-empty">
          <h2>No orders yet</h2>
          <p>Looks like you haven't placed any orders. Start shopping!</p>
          <Link to="/" className="cart-empty-btn">Start Shopping</Link>
        </div>
      ) : (
        orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-card-header">
              <div className="order-card-header-col">
                <span className="label">Order Placed</span>
                <span className="value">{formatOrderDate(order.placed_at)}</span>
              </div>
              <div className="order-card-header-col">
                <span className="label">Total</span>
                <span className="value">{formatIndianCurrency(order.total)}</span>
              </div>
              <div className="order-card-header-col">
                <span className="label">Ship To</span>
                <span className="value">{order.shipping_name}</span>
              </div>
              <div className="order-card-header-col">
                <span className="label">Order #</span>
                <span className="value">{order.id}</span>
              </div>
            </div>
            <div className="order-card-body">
              <div className="order-card-status">
                {order.status === 'confirmed' ? 'Order Confirmed' : order.status}
              </div>
              <p className="order-card-meta">
                {order.item_count} item{order.item_count !== 1 ? 's' : ''} in this order
              </p>

              <div className="order-items-list">
                {(order.items || []).map((item) => (
                  <Link
                    key={`${order.id}-${item.product_id}`}
                    to={`/product/${item.product_id}`}
                    className="order-item-preview"
                  >
                    <div className="order-item-image-wrap">
                      <img
                        src={item.product_image || 'https://via.placeholder.com/120'}
                        alt={item.product_name}
                        className="order-item-image"
                        loading="lazy"
                      />
                    </div>
                    <div className="order-item-details">
                      <h3 className="order-item-name">{item.product_name}</h3>
                      <p className="order-item-subtext">Quantity: {item.quantity}</p>
                      <p className="order-item-price">{formatIndianCurrency(item.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;
