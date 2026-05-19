import "../styles/pricing-modal.css";

function SubscriptionModal({ onClose, onUpgrade, reason, currentPlan }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-header">
          <h2>Premium Access Required</h2>
          <p>Your current plan: {currentPlan || "Free"}</p>
        </div>

        <div className="modal-price" style={{ background: "linear-gradient(135deg, #f97316 0%, #f43f5e 100%)" }}>
          <span className="modal-price-value">Premium Upgrade</span>
          <span className="modal-price-period">Unlock advanced AI generation</span>
        </div>

        <div className="modal-features">
          <h3>Why upgrade?</h3>
          <ul>
            <li><span className="feature-checkmark">✓</span> API, auth, database, and payment support</li>
            <li><span className="feature-checkmark">✓</span> Advanced AI workflows and automation</li>
            <li><span className="feature-checkmark">✓</span> High-volume extension generation</li>
            <li><span className="feature-checkmark">✓</span> Priority support and enterprise-ready architecture</li>
          </ul>
        </div>

        <div className="modal-benefits">
          <h3>Locked Feature</h3>
          <p>{reason || "This request includes premium integration requirements."}</p>
        </div>

        <button className="modal-cta-button" onClick={onUpgrade}>
          Upgrade to Premium
        </button>

        <div className="modal-footer">
          <p className="modal-guarantee">Future-ready billing and Stripe integration placeholder.</p>
          <button className="modal-secondary-cta" onClick={onClose}>
            Continue with Free Plan
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionModal;
