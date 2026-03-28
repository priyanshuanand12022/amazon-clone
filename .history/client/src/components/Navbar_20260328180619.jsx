import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getCategories } from '../api'

const preferredCategoryOrder = [
  'fresh',
  'mobiles',
  'electronics',
  'home-kitchen',
  'clothing',
  'beauty',
  'books',
  'sports-outdoors',
  'toys-games',
];

const navLabels = {
  fresh: 'Fresh',
  mobiles: 'Mobiles',
  electronics: 'Electronics',
  'home-kitchen': 'Home & Kitchen',
  clothing: 'Fashion',
  beauty: 'Beauty & Personal Care',
  books: 'Books',
  'sports-outdoors': 'Sports & Outdoors',
  'toys-games': 'Toys & Games',
};

function Navbar({ cartCount }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  const navCategories = preferredCategoryOrder
    .map((slug) => categories.find((category) => category.slug === slug))
    .filter(Boolean);

  useEffect(() => {
    getCategories().then(res => setCategories(res.data)).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    navigate(`/?${params.toString()}`);
  };

  return (
    <nav className="navbar">
      <div className="navbar-main">
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-wordmark">
            <span className="navbar-logo-amazon">amazon</span>
            <span className="navbar-logo-domain">.in</span>
          </div>
          <span className="navbar-logo-smile" />
        </Link>

        <div className="navbar-location">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
          </svg>
          <div>
            <span className="navbar-location-label">Deliver to Priyanshu</span>
            <strong>New Delhi 140413</strong>
          </div>
        </div>

        <form className="navbar-search" onSubmit={handleSearch}>
          <select
            className="navbar-search-category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
          <input
            className="navbar-search-input"
            type="text"
            placeholder="Search Amazon.in"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="navbar-search-btn" aria-label="Search">
            <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.6 0 3.09-.59 4.23-1.57l.27.28h.79L20 20.2 21.2 19l-5.7-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z" /></svg>
          </button>
        </form>

        <div className="navbar-actions">
          <button className="navbar-language" type="button">
            <span className="navbar-flag" aria-hidden="true">IN</span>
            <strong>EN</strong>
          </button>

          <div className="navbar-action">
            <span className="navbar-action-label">Hello, Priyanshu</span>
            <span className="navbar-action-value">Account & Lists</span>
          </div>

          <Link to="/orders" className="navbar-action">
            <span className="navbar-action-label">Returns</span>
            <span className="navbar-action-value">& Orders</span>
          </Link>

          <Link to="/cart" className="navbar-cart">
            <div className="navbar-cart-icon">
              <svg viewBox="0 0 24 24"><path d="M17 18a2 2 0 1 0 .001 4.001A2 2 0 0 0 17 18zm-10 0a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 18zM6.2 14h10.9c.75 0 1.4-.41 1.74-1.04l3.38-6.13A1 1 0 0 0 21.35 5H5.2l-.94-2H1v2h2l3.6 7.59-1.35 2.44A2 2 0 0 0 7 18h12v-2H7l1.2-2z" /></svg>
              {cartCount > 0 && <span className="navbar-cart-count">{cartCount}</span>}
            </div>
            <span className="navbar-cart-text">Cart</span>
          </Link>
        </div>
      </div>

      <div className="navbar-sub-bg">
        <div className="navbar-sub">
          <button className="navbar-menu-btn" type="button">
            <span className="navbar-menu-icon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <strong>All</strong>
          </button>

          <Link to="/" className="navbar-pill">Rufus</Link>
          {navCategories.map((category) => (
            <Link
              key={category.id}
              to={`/?category=${category.slug}`}
              className="navbar-sub-link"
            >
              {navLabels[category.slug] || category.name}
            </Link>
          ))}
          {categories
            .filter((category) => !preferredCategoryOrder.includes(category.slug))
            .map((category) => (
            <Link key={category.id} to={`/?category=${category.slug}`} className="navbar-sub-link">{category.name}</Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
