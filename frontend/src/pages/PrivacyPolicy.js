import Navbar from "../components/Navbar";
import "../styles/privacy-policy.css";

function PrivacyPolicy({ onNavigate }) {
  return (
    <div className="privacy-page">
      <Navbar onNavigate={onNavigate} />
      <div className="privacy-container">
        <div className="privacy-hero">
          <h1>Privacy Policy</h1>
          <p>Last updated: May 17, 2026</p>
        </div>

        <div className="privacy-content">
          <section className="policy-section">
            <h2>1. Introduction</h2>
            <p>
              Extensio.ai ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you visit our website 
              and use our services.
            </p>
          </section>

          <section className="policy-section">
            <h2>2. Information We Collect</h2>
            <p>We may collect information about you in a variety of ways. The information we may collect on the 
            site includes:</p>
            <ul>
              <li><strong>Personal Data:</strong> Name, email address, phone number, and other contact information</li>
              <li><strong>Account Information:</strong> Username, password, and account preferences</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent on pages, and clicks made</li>
              <li><strong>Device Information:</strong> Browser type, IP address, and operating system</li>
              <li><strong>Extension Data:</strong> Code and files you create using our platform</li>
              <li><strong>Payment Information:</strong> Processed securely through third-party payment processors</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>3. How We Use Your Information</h2>
            <p>Having accurate information about you permits us to provide you with a smooth, efficient, and 
            customized experience. Specifically, we may use information collected about you via the site to:</p>
            <ul>
              <li>Create and manage your account</li>
              <li>Process your transactions and send related information</li>
              <li>Improve our website and services</li>
              <li>Generate a personal profile about you</li>
              <li>Increase the efficiency and operation of our site</li>
              <li>Monitor and analyze usage and trends to improve your experience</li>
              <li>Notify you of updates to our site or services</li>
              <li>Provide customer support</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>4. Disclosure of Your Information</h2>
            <p>We may share information we have collected about you in certain situations:</p>
            <ul>
              <li><strong>By Law or to Protect Rights:</strong> If required by law or to protect our rights</li>
              <li><strong>Third-Party Service Providers:</strong> We may share data with vendors who assist us</li>
              <li><strong>Business Transfers:</strong> Your information may be transferred in a merger or acquisition</li>
              <li><strong>User Consent:</strong> We may disclose information with your explicit consent</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>5. Security of Your Information</h2>
            <p>
              We use administrative, technical, and physical security measures to protect your personal information. 
              However, no method of transmission over the internet or electronic storage is completely secure. 
              While we strive to use commercially acceptable means to protect your personal information, we cannot 
              guarantee its absolute security.
            </p>
          </section>

          <section className="policy-section">
            <h2>6. Contact Us Regarding Privacy</h2>
            <p>
              If you have questions or comments about this Privacy Policy, please contact us at:
            </p>
            <div className="contact-info-policy">
              <p><strong>Email:</strong> privacy@extensio.ai</p>
              <p><strong>Mailing Address:</strong> Extensio.ai Inc., San Francisco, CA</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            </div>
          </section>

          <section className="policy-section">
            <h2>7. Policy Changes</h2>
            <p>
              Extensio.ai reserves the right to make changes to this Privacy Policy at any time and for any reason. 
              We will alert you about any changes by updating the "Last updated" date of this Privacy Policy. Any 
              changes or modifications will be effective immediately upon posting the updated Privacy Policy on the 
              site, and you waive the right to receive specific notice of each such change or modification.
            </p>
          </section>

          <section className="policy-section">
            <h2>8. CCPA Privacy Rights (Do Not Sell My Personal Information)</h2>
            <p>
              Under the CCPA, California residents have the right to know what personal information is collected, 
              used, shared, or sold. California residents have the right to delete personal information collected 
              from you. California residents have the right to opt-out of the sale of personal information.
            </p>
          </section>

          <section className="policy-section">
            <h2>9. GDPR Privacy Rights (European Residents)</h2>
            <p>
              If you are a resident of the European Union, you have certain data protection rights, including the 
              right to access, rectify, erase, restrict processing, portability, and withdraw consent.
            </p>
          </section>

          <section className="policy-section">
            <h2>10. Cookie Policy</h2>
            <p>
              Extensio.ai uses cookies to enhance your experience on our site. You can choose to have your computer 
              warn you each time a cookie is being sent, or you can choose to turn off all cookies. You do this through 
              your browser settings. Since each browser is a little different, look at your browser's Help menu to 
              learn the correct way to modify your cookies.
            </p>
          </section>
        </div>

        <div className="policy-footer">
          <p>Thank you for using Extensio.ai and trusting us with your information.</p>
          <button className="back-home-btn" onClick={() => onNavigate("home")}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
