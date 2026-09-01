function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="contact-container">
        <div className="contact-info">
          <p className="small-title">GET IN TOUCH</p>

          <h2>Contact Us</h2>

          <p>
            Have a question or need help? Our team is here to
            assist you.
          </p>

          <div className="contact-item">
            <div className="contact-icon">📍</div>
            <div>
              <h3>Our Location</h3>
              <p>123 Healthcare Street, Your City</p>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon">📞</div>
            <div>
              <h3>Phone</h3>
              <p>+91 98765 43210</p>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon">✉️</div>
            <div>
              <h3>Email</h3>
              <p>info@medicare.com</p>
            </div>
          </div>
        </div>

        <form className="contact-form">
          <input
            type="text"
            placeholder="Your Name"
            required
          />

          <input
            type="email"
            placeholder="Your Email"
            required
          />

          <input
            type="text"
            placeholder="Subject"
            required
          />

          <textarea
            rows="6"
            placeholder="Your Message"
            required
          ></textarea>
<input
  type="tel"
  name="phone"
  placeholder="Phone Number"
  maxLength="10"
  pattern="[0-9]{10}"
  onInput={(e) => {
    e.target.value = e.target.value.replace(/\D/g, "");
  }}
  required
/>
          <button type="submit">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}

export default Contact;