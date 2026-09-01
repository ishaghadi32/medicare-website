function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-about">
          <div className="footer-logo">
            Medi<span>Care</span>
          </div>

          <p>
            Quality healthcare made simple, accessible, and
            convenient for everyone.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>

          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#doctors">Doctors</a>
          <a href="#appointment">Appointment</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="footer-contact">
          <h3>Contact Us</h3>

          <p>📍 123 Healthcare Street</p>
          <p>📞 +91 98765 43210</p>
          <p>✉️ info@medicare.com</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © 2026 MediCare. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;