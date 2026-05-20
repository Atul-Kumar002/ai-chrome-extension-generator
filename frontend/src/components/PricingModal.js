import "../styles/pricing-modal.css";

function PricingModal({ plan, onClose, onNavigate }) {
  if (!plan) return null;

  const handleChoosePlan = () => {
    let tier = "Free";
    if (plan.name === "Professional") tier = "Premium";
    if (plan.name === "Enterprise") tier = "Enterprise";

    localStorage.setItem("extensio_subscription_tier", tier);
    alert(`Successfully upgraded to the ${plan.name} plan!`);
    onClose();
    if (onNavigate) {
      onNavigate("home");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <div className="modal-header">
          <h2>{plan.name} Plan</h2>
          <p>{plan.description}</p>
        </div>

        <div className="modal-price">
          <span className="modal-price-value">{plan.price}</span>
          <span className="modal-price-period">{plan.period}</span>
        </div>

        <button className="modal-cta-button" onClick={handleChoosePlan}>
          {plan.cta}
        </button>

        <div className="modal-features">
          <h3>What's Included:</h3>
          <ul>
            {plan.features.map((feature, index) => (
              <li key={index}>
                <span className="feature-checkmark">✓</span>
                <span className="feature-text">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="modal-benefits">
          <h3>Additional Benefits:</h3>
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon">🚀</div>
              <h4>Fast Setup</h4>
              <p>Get started in minutes</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">💡</div>
              <h4>Smart Templates</h4>
              <p>Pre-built solutions</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🔒</div>
              <h4>Secure</h4>
              <p>Enterprise-grade security</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">📊</div>
              <h4>Analytics</h4>
              <p>Track your usage</p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <p className="modal-guarantee">30-day money-back guarantee • Cancel anytime</p>
          <button className="modal-secondary-cta" onClick={onClose}>
            Back to Plans
          </button>
        </div>
      </div>
    </div>
  );
}

export default PricingModal;
