import { Link } from 'react-router-dom'

const stats = [
  { value: '300M+', label: 'Annual visits to marketplace-style discovery experiences' },
  { value: '99.3%', label: 'Delivery reach across Indian pincodes through partner networks' },
  { value: '41K+', label: 'Potential launch benefits in credits, ads, and onboarding support' },
  { value: '24/7', label: 'Seller support guidance for catalog, ads, and operations' },
];

const launchSteps = [
  {
    title: 'Create your seller profile',
    text: 'Set up your business details, pickup location, and payment information in a guided onboarding flow.',
  },
  {
    title: 'List your products',
    text: 'Upload titles, images, sizes, and pricing so customers can discover your catalog quickly.',
  },
  {
    title: 'Activate shipping and offers',
    text: 'Choose how you want to fulfill orders, run launch discounts, and make your products stand out.',
  },
  {
    title: 'Scale with tools and insights',
    text: 'Track performance, optimize ads, monitor inventory, and grow faster with seller analytics.',
  },
];

const growthBlocks = [
  {
    eyebrow: 'Sale Events',
    title: 'Participate in high-traffic shopping moments',
    text: 'Seasonal campaigns, event banners, and festive promotions can give sellers more visibility when customers are ready to buy.',
    note: 'Use deals, coupons, and campaign placements to increase reach during major sale windows.',
  },
  {
    eyebrow: 'Tools to Scale',
    title: 'Manage pricing, ads, and inventory with less manual work',
    text: 'Seller dashboards help you watch conversion, stock health, and product performance so you can react faster every day.',
    note: 'Use operational insights to improve listings, refine pricing, and keep bestsellers in stock.',
  },
  {
    eyebrow: 'Seller Dashboard',
    title: 'Run your business from one central workspace',
    text: 'Keep track of orders, cancellations, returns, customer messages, and catalog quality from a single place.',
    note: 'A focused overview makes it easier to spot growth opportunities and fix issues early.',
  },
];

const benefits = [
  {
    title: 'Launch benefits up to ₹41,000',
    text: 'Get a strong start with onboarding support, promotional credits, and listing incentives inspired by modern seller programs.',
  },
  {
    title: 'Fee planning made simpler',
    text: 'Estimate profitability with easy-to-understand breakdowns for referral, closing, delivery, and promotional costs.',
  },
  {
    title: 'Brand-building support',
    text: 'Improve storefront trust with cleaner product pages, stronger brand storytelling, and promotional placements.',
  },
];

function Sell() {
  return (
    <div className="sell-page">
      <section className="sell-hero">
        <div className="sell-hero-copy">
          <span className="sell-kicker">Sell on Amazon Clone</span>
          <h1>Build your brand and grow your business with a seller-first experience.</h1>
          <p>
            Create listings, reach more customers, plan your fees, and scale with marketplace
            tools inspired by modern seller platforms in India.
          </p>
          <div className="sell-hero-actions">
            <a href="#sell-start" className="sell-primary-btn">Start selling</a>
            <a href="#sell-growth" className="sell-secondary-btn">Explore seller tools</a>
          </div>
          <div className="sell-fee-banner">
            <strong>Seller fee planning</strong>
            <span>Understand pricing, offers, and launch support before you go live.</span>
          </div>
        </div>

        <div className="sell-hero-panel">
          <div className="sell-hero-card sell-hero-card-main">
            <span>Benefits up to</span>
            <strong>₹41,000</strong>
            <p>Selection support, ad credits, and seller growth help for a stronger launch.</p>
          </div>
          <div className="sell-hero-card-grid">
            <div className="sell-hero-card">
              <strong>Fast setup</strong>
              <p>Create your seller account and prepare your first listings with guided steps.</p>
            </div>
            <div className="sell-hero-card">
              <strong>Growth tools</strong>
              <p>Track orders, pricing, inventory, and ad performance in one seller view.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sell-stats">
        {stats.map((item) => (
          <article key={item.value} className="sell-stat-card">
            <strong>{item.value}</strong>
            <p>{item.label}</p>
          </article>
        ))}
      </section>

      <section className="sell-benefits">
        <div className="sell-section-head">
          <span className="sell-section-tag">Launch support</span>
          <h2>Get a head-start with seller-friendly benefits</h2>
        </div>
        <div className="sell-benefit-grid">
          {benefits.map((benefit) => (
            <article key={benefit.title} className="sell-benefit-card">
              <h3>{benefit.title}</h3>
              <p>{benefit.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="sell-start" className="sell-steps">
        <div className="sell-section-head">
          <span className="sell-section-tag">How it works</span>
          <h2>Start selling in four clear steps</h2>
        </div>
        <div className="sell-step-grid">
          {launchSteps.map((step, index) => (
            <article key={step.title} className="sell-step-card">
              <span className="sell-step-number">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="sell-growth" className="sell-growth">
        <div className="sell-section-head">
          <span className="sell-section-tag">Growth</span>
          <h2>Craft your success story with better selling tools</h2>
        </div>
        <div className="sell-growth-grid">
          {growthBlocks.map((block) => (
            <article key={block.title} className="sell-growth-card">
              <span className="sell-growth-eyebrow">{block.eyebrow}</span>
              <h3>{block.title}</h3>
              <p>{block.text}</p>
              <small>{block.note}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="sell-cta-strip">
        <div>
          <span className="sell-section-tag">Ready to begin?</span>
          <h2>Put your products in front of shoppers looking to buy every day.</h2>
          <p>
            Use this section as your local seller landing page and expand it later with signup,
            fee calculators, or onboarding forms.
          </p>
        </div>
        <div className="sell-cta-actions">
          <a href="#sell-start" className="sell-primary-btn">Start selling</a>
          <Link to="/" className="sell-secondary-btn">Back to shopping</Link>
        </div>
      </section>
    </div>
  );
}

export default Sell;
