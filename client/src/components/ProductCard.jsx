import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StarRating from './StarRating'
import { addToCart } from '../api'
import { formatIndianPrice } from '../utils/currency'

function ProductCard({ product, onCartUpdate }) {
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const price = Number(product.price) || 0;
  const originalPrice = Number(product.original_price) || 0;
  const hasDiscount = originalPrice > price;

  const discount = hasDiscount
    ? Math.round((1 - price / originalPrice) * 100)
    : 0;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (loading || added) return;
    setLoading(true);
    try {
      await addToCart(product.id, 1);
      setAdded(true);
      if (onCartUpdate) onCartUpdate();
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error('Failed to add to cart');
    }
    setLoading(false);
  };

  const priceWhole = Math.floor(price);
  const priceDecimal = ((price % 1) * 100).toFixed(0).padStart(2, '0');

  return (
    <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
      <img
        className="product-card-image"
        src={product.primary_image || 'https://via.placeholder.com/300'}
        alt={product.name}
        loading="lazy"
      />
      <div className="product-card-body">
        {product.brand && (
          <div className="product-card-brand">{product.brand}</div>
        )}
        <div className="product-card-name">{product.name}</div>

        <div className="product-card-rating">
          <StarRating rating={parseFloat(product.rating)} />
          <span className="product-card-rating-count">
            {parseInt(product.review_count).toLocaleString()}
          </span>
        </div>

        {discount > 0 && (
          <span className="product-card-badge">{discount}% off</span>
        )}

        <div className="product-card-price">
          <span className="product-card-price-symbol">₹</span>
          <span className="product-card-price-whole">{priceWhole}</span>
          <sup>{priceDecimal}</sup>
          {hasDiscount && (
            <span className="product-card-price-original">₹{formatIndianPrice(originalPrice)}</span>
          )}
        </div>

        <button
          className={`product-card-add-btn ${added ? 'added' : ''}`}
          onClick={handleAddToCart}
          disabled={loading}
        >
          {added ? 'Added' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
