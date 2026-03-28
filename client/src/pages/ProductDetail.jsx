import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProduct, addToCart } from '../api'
import StarRating from '../components/StarRating'
import ProductCard from '../components/ProductCard'
import { formatIndianCurrency, formatIndianPrice } from '../utils/currency'

function ProductDetail({ onCartUpdate }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    setLoading(true);
    setSelectedImage(0);
    setQuantity(1);
    setAdded(false);
    getProduct(id)
      .then(res => setProduct(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (addingToCart) return;
    setAddingToCart(true);
    try {
      await addToCart(product.id, quantity);
      setAdded(true);
      if (onCartUpdate) onCartUpdate();
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      console.error('Failed to add to cart');
    }
    setAddingToCart(false);
  };

  const handleBuyNow = async () => {
    if (addingToCart) return;
    setAddingToCart(true);
    try {
      await addToCart(product.id, quantity);
      if (onCartUpdate) onCartUpdate();
      navigate('/cart');
    } catch (err) {
      console.error('Failed to add to cart');
    }
    setAddingToCart(false);
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (!product) {
    return <div className="cart-empty"><h2>Product not found</h2></div>;
  }

  const images = product.images || [];
  const price = Number(product.price) || 0;
  const originalPrice = Number(product.original_price) || 0;
  const hasDiscount = originalPrice > price;
  const priceWhole = Math.floor(price);
  const priceDecimal = ((price % 1) * 100).toFixed(0).padStart(2, '0');
  const discount = hasDiscount
    ? Math.round((1 - price / originalPrice) * 100)
    : 0;
  const savings = hasDiscount ? originalPrice - price : 0;

  return (
    <div className="product-detail">
      <div className="product-detail-main">
        <div className="image-carousel">
          <div className="image-carousel-thumbs">
            {images.map((img, idx) => (
              <div
                key={img.id}
                className={`image-carousel-thumb ${idx === selectedImage ? 'active' : ''}`}
                onMouseEnter={() => setSelectedImage(idx)}
              >
                <img src={img.url} alt={`${product.name} view ${idx + 1}`} />
              </div>
            ))}
          </div>
          <div className="image-carousel-main">
            <img
              src={images[selectedImage]?.url || 'https://via.placeholder.com/500'}
              alt={product.name}
            />
          </div>
        </div>

        <div className="product-info">
          {product.brand && (
            <div className="product-info-brand">Visit the {product.brand} Store</div>
          )}
          <h1 className="product-info-name">{product.name}</h1>

          <div className="product-info-rating">
            <span className="product-info-rating-score">{parseFloat(product.rating).toFixed(1)}</span>
            <StarRating rating={parseFloat(product.rating)} size={18} />
            <span className="product-info-rating-count">
              {parseInt(product.review_count).toLocaleString()} ratings
            </span>
          </div>

          <div className="product-info-price-section">
            {discount > 0 && (
              <div style={{ marginBottom: '4px' }}>
                <span style={{ color: '#cc0c39', fontSize: '1.5rem', fontWeight: 500 }}>-{discount}% </span>
              </div>
            )}
            <div className="product-info-price">
              <span className="price-symbol">₹</span>
              <span className="price-whole">{priceWhole}</span>
              <sup>{priceDecimal}</sup>
            </div>
            {hasDiscount && (
              <div style={{ marginTop: '4px' }}>
                <span className="price-original" style={{ textDecoration: 'line-through', color: '#565959', fontSize: '0.85rem' }}>
                  List Price: ₹{formatIndianPrice(originalPrice)}
                </span>
                <span className="price-savings" style={{ marginLeft: '8px', color: '#cc0c39', fontSize: '0.85rem' }}>
                  You Save: {formatIndianCurrency(savings)} ({discount}%)
                </span>
              </div>
            )}
          </div>

          <div className="product-info-desc">
            <h3>About this item</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-info-specs">
            <h3 style={{ marginBottom: '8px', fontSize: '1rem' }}>Product Information</h3>
            <table>
              <tbody>
                <tr><td>Brand</td><td>{product.brand || 'N/A'}</td></tr>
                <tr><td>Category</td><td>{product.category_name}</td></tr>
                <tr><td>Rating</td><td>{parseFloat(product.rating).toFixed(1)} out of 5</td></tr>
                <tr><td>Reviews</td><td>{parseInt(product.review_count).toLocaleString()}</td></tr>
                <tr><td>Availability</td><td>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="buy-box">
          <div className="buy-box-price">
            <span className="price-symbol">₹</span>
            <span className="price-whole">{priceWhole}</span>
            <sup>{priceDecimal}</sup>
          </div>

          <div className="buy-box-delivery">
            <strong>FREE delivery</strong> tomorrow
            <br />
            Or fastest delivery <strong>today</strong>
          </div>

          <div className={`buy-box-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </div>

          {product.stock > 0 && (
            <>
              <div className="buy-box-qty">
                <label>Qty:</label>
                <select value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))}>
                  {Array.from({ length: Math.min(product.stock, 10) }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>

              <button
                className={`buy-box-btn add-to-cart ${added ? 'added' : ''}`}
                onClick={handleAddToCart}
                disabled={addingToCart}
              >
                {added ? 'Added to Cart' : 'Add to Cart'}
              </button>
              <button
                className="buy-box-btn buy-now"
                onClick={handleBuyNow}
                disabled={addingToCart}
              >
                Buy Now
              </button>

              <div className="buy-box-secure">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#007185">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/>
                </svg>
                Secure transaction
              </div>
            </>
          )}
        </div>
      </div>

      {product.related_products && product.related_products.length > 0 && (
        <div className="related-products">
          <h2 className="section-title">Products related to this item</h2>
          <div className="related-products-grid">
            {product.related_products.map(rp => (
              <ProductCard key={rp.id} product={rp} onCartUpdate={onCartUpdate} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
