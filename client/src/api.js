import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
const apiTimeout = Number(import.meta.env.VITE_API_TIMEOUT || 70000);
const warmupRetryDelay = 2500;

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: apiTimeout,
});

api.interceptors.response.use(
  (response) => {
    const contentType = response.headers?.['content-type'] || '';
    const body = response.data;

    if (
      typeof body === 'string' &&
      (body.includes('<!DOCTYPE html') || body.includes('<html')) &&
      contentType.includes('text/html')
    ) {
      return Promise.reject(new Error('Invalid API response: received HTML instead of JSON.'));
    }

    return response;
  },
  async (error) => {
    const requestConfig = error.config || {};
    const method = (requestConfig.method || 'get').toLowerCase();
    const status = error.response?.status;
    const shouldRetryWarmup =
      method === 'get' &&
      !requestConfig.__warmupRetried &&
      (
        error.code === 'ECONNABORTED' ||
        error.code === 'ERR_NETWORK' ||
        !error.response ||
        [502, 503, 504].includes(status)
      );

    if (shouldRetryWarmup) {
      requestConfig.__warmupRetried = true;
      await wait(warmupRetryDelay);
      return api(requestConfig);
    }

    return Promise.reject(error);
  }
);

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
