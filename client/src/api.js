import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
});

// Products
export const getProducts = (params = {}) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const getCategories = () => api.get('/categories');

// Cart
export const getCart = () => api.get('/cart');
export const addToCart = (product_id, quantity = 1) => api.post('/cart', { product_id, quantity });
export const updateCartItem = (id, quantity) => api.put(`/cart/${id}`, { quantity });
export const removeCartItem = (id) => api.delete(`/cart/${id}`);
export const clearCart = () => api.delete('/cart');
export const getCartCount = () => api.get('/cart/count');

// Orders
export const placeOrder = (shippingInfo) => api.post('/orders', shippingInfo);
export const getOrders = () => api.get('/orders');
export const getOrder = (id) => api.get(`/orders/${id}`);

export default api;
