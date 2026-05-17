import { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/contact.css";

function Contact({ onNavigate }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  return (
    <div className="contact-page">
      <Navbar onNavigate={onNavigate} />
      <div className="contact-container">
        <div className="contact-hero">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Get in touch with us today!</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="info-box">
              <h3>Email</h3>
              <p>support@extensio.ai</p>
              <p className="info-desc">We'll respond within 24 hours</p>
            </div>

            <div className="info-box">
              <h3>Live Chat</h3>
              <p>Available Mon-Fri, 9AM-6PM EST</p>
              <p className="info-desc">Real-time support from our team</p>
            </div>

            <div className="info-box">
              <h3>Phone</h3>
              <p>+1 (555) 123-4567</p>
              <p className="info-desc">Call us for urgent matters</p>
            </div>

            <div className="info-box">
              <h3>Office</h3>
              <p>San Francisco, CA</p>
              <p className="info-desc">Visit us at our headquarters</p>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="How can we help?"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Tell us more about your inquiry..."
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">
              Send Message
            </button>

            {submitted && (
              <div className="success-message">
                ✓ Thank you! Your message has been sent successfully. We'll get back to you soon!
              </div>
            )}
          </form>
        </div>

        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-card">
              <h4>How long does it take to create an extension?</h4>
              <p>Most extensions can be created in just a few minutes using our AI generator.</p>
            </div>
            <div className="faq-card">
              <h4>Do you offer technical support?</h4>
              <p>Yes! We offer 24/7 support via email, chat, and phone for Premium members.</p>
            </div>
            <div className="faq-card">
              <h4>Can I export my extensions?</h4>
              <p>Absolutely! Your extensions are yours to download, modify, and distribute.</p>
            </div>
            <div className="faq-card">
              <h4>What if I need custom development?</h4>
              <p>Contact our Enterprise team for custom solutions and dedicated support.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
