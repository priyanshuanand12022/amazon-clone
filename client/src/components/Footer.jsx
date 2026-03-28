function Footer() {
  return (
    <footer className="footer">
      <div className="footer-back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        Back to top
      </div>
      <div className="footer-content">
        <div className="footer-column">
          <h4>Get to Know Us</h4>
          <a href="#">Careers</a>
          <a href="#">Blog</a>
          <a href="#">About Amazon Clone</a>
          <a href="#">Investor Relations</a>
        </div>
        <div className="footer-column">
          <h4>Make Money with Us</h4>
          <a href="#">Sell products on Amazon</a>
          <a href="#">Sell on Amazon Business</a>
          <a href="#">Become an Affiliate</a>
          <a href="#">Advertise Your Products</a>
        </div>
        <div className="footer-column">
          <h4>Amazon Payment Products</h4>
          <a href="#">Amazon Business Card</a>
          <a href="#">Shop with Points</a>
          <a href="#">Reload Your Balance</a>
          <a href="#">Amazon Currency Converter</a>
        </div>
        <div className="footer-column">
          <h4>Let Us Help You</h4>
          <a href="#">Your Account</a>
          <a href="#">Your Orders</a>
          <a href="#">Shipping Rates & Policies</a>
          <a href="#">Returns & Replacements</a>
          <a href="#">Help</a>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-logo">amazon<span>.clone</span></div>
        <p className="footer-copy">(c) 2026, AmazonClone.com, Inc. or its affiliates - This is a demo project</p>
      </div>
    </footer>
  );
}

export default Footer;
