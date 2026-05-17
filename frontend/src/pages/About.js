import Navbar from "../components/Navbar";
import "../styles/about.css";

function About({ onNavigate }) {
  return (
    <div className="about-page">
      <Navbar onNavigate={onNavigate} />
      <div className="about-container">
        <div className="about-hero">
          <h1>About Extensio.ai</h1>
          <p>Revolutionizing Chrome Extension Development</p>
        </div>

        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            We believe that everyone should be able to create powerful Chrome extensions without requiring 
            extensive coding knowledge. Extensio.ai democratizes extension development by leveraging artificial 
            intelligence to make the process intuitive, fast, and accessible to all skill levels.
          </p>
        </section>

        <section className="about-section">
          <h2>What We Do</h2>
          <div className="features-grid">
            <div className="feature-box">
              <h3>AI-Powered Generation</h3>
              <p>Our advanced AI understands your requirements and generates production-ready code instantly.</p>
            </div>
            <div className="feature-box">
              <h3>Lightning Fast</h3>
              <p>Create fully functional extensions in minutes, not days.</p>
            </div>
            <div className="feature-box">
              <h3>Beautiful UI</h3>
              <p>Pre-designed components and templates for a professional look.</p>
            </div>
            <div className="feature-box">
              <h3>Secure</h3>
              <p>Enterprise-grade security and best practices built-in.</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Why Choose Extensio.ai?</h2>
          <ul className="benefits-list">
            <li>✓ No coding experience required</li>
            <li>✓ Save hours of development time</li>
            <li>✓ Professional-quality extensions</li>
            <li>✓ Continuous updates and improvements</li>
            <li>✓ 24/7 customer support</li>
            <li>✓ Community-driven development</li>
            <li>✓ Flexible pricing for all budgets</li>
            <li>✓ Easy to edit and customize</li>
          </ul>
        </section>

        <section className="about-section team-section">
          <h2>Our Team</h2>
          <p>
            We're a team of passionate developers, designers, and AI enthusiasts dedicated to making 
            extension development accessible to everyone. With years of experience in web development 
            and machine learning, we're committed to building the best AI-powered development platform.
          </p>
        </section>

        <section className="about-section">
          <h2>Join Our Community</h2>
          <p>
            Be part of a growing community of developers, creators, and innovators. Share your extensions, 
            get feedback, and collaborate with others building the future of Chrome extensions.
          </p>
          <div className="cta-buttons">
            <button className="cta-btn primary" onClick={() => onNavigate("home")}>
              Start Creating
            </button>
            <button className="cta-btn secondary" onClick={() => onNavigate("contact")}>
              Contact Us
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;
