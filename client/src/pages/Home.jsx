import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { getProducts, getCategories } from '../api'
import ProductCard from '../components/ProductCard'
import { formatIndianCurrency } from '../utils/currency'

function formatRupees(value) {
  return formatIndianCurrency(value);
}

function getDiscountPercent(product) {
  const price = Number(product?.price) || 0;
  const originalPrice = Number(product?.original_price) || 0;

  if (!originalPrice || originalPrice <= price) {
    return 0;
  }

  return Math.round((1 - price / originalPrice) * 100);
}

function Home({ onCartUpdate }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('');
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || '';
  const hasFilters = Boolean(searchQuery || categoryFilter);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {};
        if (searchQuery) params.search = searchQuery;
        if (categoryFilter) params.category = categoryFilter;
        if (sortBy) params.sort = sortBy;

        const [productsRes, categoriesRes] = await Promise.all([
          getProducts(params),
          getCategories()
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error('Failed to fetch data');
      }
      setLoading(false);
    };
    fetchData();
  }, [searchQuery, categoryFilter, sortBy]);

  const featuredProducts = products.slice(0, 6);
  const heroProduct = featuredProducts[currentHeroIndex] || products[0];
  const pickupProducts = products.slice(0, 4);
  const continueDeals = products.slice(4, 8);
  const decorCategories = categories.slice(0, 4);
  const spotlightFeatureProduct =
    products.find((product) => product.category_slug === 'beauty') ||
    products.find((product) => product.category_slug === 'home-kitchen') ||
    products[8] ||
    products[0];
  const todaysDeals = products.slice(0, 8);
  const recommendedProducts = products.slice(8, 16);

  useEffect(() => {
    if (!featuredProducts.length) {
      return undefined;
    }

    setCurrentHeroIndex((prevIndex) => (
      prevIndex >= featuredProducts.length ? 0 : prevIndex
    ));

    const intervalId = setInterval(() => {
      setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % featuredProducts.length);
    }, 4500);

    return () => clearInterval(intervalId);
  }, [featuredProducts.length]);

  const showPreviousHero = () => {
    setCurrentHeroIndex((prevIndex) => (
      prevIndex === 0 ? featuredProducts.length - 1 : prevIndex - 1
    ));
  };

  const showNextHero = () => {
    setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % featuredProducts.length);
  };

  const renderMiniProduct = (product) => (
    <Link key={product.id} to={`/product/${product.id}`} className="mini-grid-item">
      <div className="mini-grid-thumb">
        <img src={product.primary_image || 'https://via.placeholder.com/180'} alt={product.name} loading="lazy" />
      </div>
      <span>{product.name}</span>
    </Link>
  );

  const renderCategoryTile = (category) => (
    <Link key={category.id} to={`/?category=${category.slug}`} className="mini-grid-item">
      <div className="mini-grid-thumb">
        <img src={category.image_url} alt={category.name} loading="lazy" />
      </div>
      <span>{category.name}</span>
    </Link>
  );

  return (
    <div className="home-page-shell">
      {!hasFilters && heroProduct && (
        <section className="hero-stage">
          <div className="hero-banner">
            <button
              type="button"
              className="hero-arrow hero-arrow-left"
              aria-label="Previous hero"
              onClick={showPreviousHero}
            >
              <span>&lt;</span>
            </button>

            <Link
              key={`hero-copy-${heroProduct.id}`}
              to={`/product/${heroProduct.id}`}
              className="hero-copy hero-link-panel"
            >
              <div className="hero-brand-row">
                <span className="hero-brand-badge">{heroProduct.brand || 'amazon special'}</span>
                <span className="hero-brand-note">Limited time deal</span>
              </div>
              <h1>Only {formatRupees(heroProduct.price)}*</h1>
              <p className="hero-title">{heroProduct.name}</p>
              <div className="hero-offer-strip">
                <span>No cost EMI</span>
                <span>Exchange offer</span>
                <span>Top brand discount</span>
              </div>
              <div className="hero-partners">
                <span>BOB CARD</span>
                <span>Kotak</span>
                <span>OneCard</span>
                <span>YES BANK</span>
              </div>
              <p className="hero-subcopy">Up to 10% instant discount on selected offers</p>
              <span className="hero-cta">See product details</span>
            </Link>

            <Link
              key={`hero-visual-${heroProduct.id}`}
              to={`/product/${heroProduct.id}`}
              className="hero-visual-card hero-link-panel"
            >
              <div className="hero-visual-sticker">
                <strong>{getDiscountPercent(heroProduct) || 55}</strong>
                <span>Deal</span>
              </div>
              <img
                src={heroProduct.primary_image || 'https://via.placeholder.com/520x320'}
                alt={heroProduct.name}
              />
              <div className="hero-visual-caption">
                <span>AI powered picks</span>
                <strong>{heroProduct.name}</strong>
              </div>
            </Link>

            <button
              type="button"
              className="hero-arrow hero-arrow-right"
              aria-label="Next hero"
              onClick={showNextHero}
            >
              <span>&gt;</span>
            </button>

            {featuredProducts.length > 1 && (
              <div className="hero-indicators" aria-label="Featured products">
                {featuredProducts.map((product, index) => (
                  <button
                    key={product.id}
                    type="button"
                    className={`hero-indicator ${index === currentHeroIndex ? 'active' : ''}`}
                    onClick={() => setCurrentHeroIndex(index)}
                    aria-label={`Show ${product.name}`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="home-spotlight-grid">
            <article className="spotlight-card">
              <h2>Pick up where you left off</h2>
              <div className="mini-grid">{pickupProducts.map(renderMiniProduct)}</div>
              <Link to="/" className="spotlight-link">See more</Link>
            </article>

            <article className="spotlight-card">
              <h2>Continue shopping deals</h2>
              <div className="mini-grid">{continueDeals.map(renderMiniProduct)}</div>
              <Link to="/" className="spotlight-link">See more deals</Link>
            </article>

            <article className="spotlight-card">
              <h2>Revamp your home in style</h2>
              <div className="mini-grid">{decorCategories.map(renderCategoryTile)}</div>
              <Link to="/" className="spotlight-link">Explore all</Link>
            </article>

            <article className="spotlight-card spotlight-card-feature">
              <h2>Top pick for your daily routine</h2>
              {spotlightFeatureProduct && (
                <Link to={`/product/${spotlightFeatureProduct.id}`} className="spotlight-feature-product">
                  <div className="spotlight-feature-image">
                    <img
                      src={spotlightFeatureProduct.primary_image || 'https://via.placeholder.com/220'}
                      alt={spotlightFeatureProduct.name}
                    />
                  </div>
                  <div>
                    <span className="spotlight-feature-brand">{spotlightFeatureProduct.brand}</span>
                    <strong>{spotlightFeatureProduct.name}</strong>
                    <span>{formatRupees(spotlightFeatureProduct.price)}</span>
                    {getDiscountPercent(spotlightFeatureProduct) > 0 && (
                      <small>{getDiscountPercent(spotlightFeatureProduct)}% off on MRP</small>
                    )}
                  </div>
                </Link>
              )}
              {spotlightFeatureProduct && (
                <Link
                  to={`/?category=${spotlightFeatureProduct.category_slug}`}
                  className="spotlight-link"
                >
                  Shop more in {spotlightFeatureProduct.category_name || 'this category'}
                </Link>
              )}
            </article>
          </div>
        </section>
      )}

      <div className="home-topbar">
        <div className="home-results-count">
          {searchQuery && <span>Results for "<strong>{searchQuery}</strong>" - </span>}
          {categoryFilter && (
            <span>
              Category: <strong>{categories.find(c => c.slug === categoryFilter)?.name || categoryFilter}</strong> - </span>
          )}
          <span>{products.length} result{products.length !== 1 ? 's' : ''}</span>
          {hasFilters && (
            <Link to="/" style={{ marginLeft: '12px', fontSize: '0.85rem' }}>Clear filters</Link>
          )}
        </div>

        <select
          className="home-sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Sort by: Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Avg. Customer Review</option>
          <option value="newest">Newest Arrivals</option>
        </select>
      </div>

      <div className="home-filters home-filters-amazon">
        <Link to="/">
          <button className={`home-filter-btn ${!categoryFilter ? 'active' : ''}`}>All</button>
        </Link>
        {categories.map(cat => (
          <Link key={cat.id} to={`/?category=${cat.slug}${searchQuery ? `&search=${searchQuery}` : ''}`}>
            <button className={`home-filter-btn ${categoryFilter === cat.slug ? 'active' : ''}`}>
              {cat.name}
            </button>
          </Link>
        ))}
      </div>

      {!hasFilters && !loading && todaysDeals.length > 0 && (
        <section className="shopping-strip">
          <div className="shopping-strip-head">
            <h2>Today&apos;s deals inspired by your browsing</h2>
            <a href="#">See all deals</a>
          </div>
          <div className="deal-strip-grid">
            {todaysDeals.map(product => (
              <Link key={product.id} to={`/product/${product.id}`} className="deal-strip-card">
                <div className="deal-strip-image">
                  <img src={product.primary_image || 'https://via.placeholder.com/220'} alt={product.name} loading="lazy" />
                </div>
                <div className="deal-strip-meta">
                  <span className="deal-badge">
                    {getDiscountPercent(product) > 0 ? `${getDiscountPercent(product)}% off` : 'Top pick'}
                  </span>
                  <strong>{formatRupees(product.price)}</strong>
                  <p>{product.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {!hasFilters && !loading && recommendedProducts.length > 0 && (
        <section className="shopping-strip">
          <div className="shopping-strip-head">
            <h2>Recommended for your home, office and daily routine</h2>
            <a href="#">Explore more</a>
          </div>
          <div className="product-grid product-grid-home">
            {recommendedProducts.map(product => (
              <ProductCard key={product.id} product={product} onCartUpdate={onCartUpdate} />
            ))}
          </div>
        </section>
      )}

      {loading ? (
        <div className="loading home-loading-state">
          <div className="home-loading-message">
            <h2>Preparing the store for you...</h2>
            <p>
              The backend server may take up to 1 minute to start on the first
              visit after inactivity. Products will appear automatically once it wakes up.
            </p>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="cart-empty">
          <h2>No products found</h2>
          <p>Try adjusting your search or filter criteria</p>
          <Link to="/" className="cart-empty-btn">Browse All Products</Link>
        </div>
      ) : hasFilters ? (
        <div className="product-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} onCartUpdate={onCartUpdate} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default Home;
