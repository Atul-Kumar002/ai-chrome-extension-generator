import { useEffect, useState } from "react";
import PricingModal from "../components/PricingModal";
import Navbar from "../components/Navbar";
import { setPageMetadata } from "../utils/seo";
import "../styles/pricing.css";

function Pricing({ onNavigate }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setPageMetadata({
      title: "Pricing Plans | Extensio.ai",
      description: "Extensio.ai pricing plans for teams, individuals, and enterprise-ready Chrome extension development.",
    });
  }, []);

  const plans = [
    {
      id: 1,
      name: "Starter",
      price: "$0",
      period: "Forever Free",
      description: "Perfect for beginners",
      features: [
        "Up to 5 extensions/month",
        "Basic AI features",
        "Community support",
        "Chrome browser only",
        "Standard templates"
      ],
      color: "#6c63ff",
      cta: "Get Started"
    },
    {
      id: 2,
      name: "Professional",
      price: "$19",
      period: "/month",
      description: "For professional developers",
      features: [
        "Unlimited extensions",
        "Advanced AI features",
        "Priority support",
        "Multi-browser support",
        "Custom templates",
        "API access",
        "Analytics dashboard"
      ],
      color: "#00d4ff",
      cta: "Start Free Trial",
      popular: true
    },
    {
      id: 3,
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For large teams",
      features: [
        "Everything in Professional",
        "Dedicated support",
        "Custom integrations",
        "Team collaboration",
        "Advanced security",
        "SLA guarantee",
        "Custom development"
      ],
      color: "#ff6b9d",
      cta: "Contact Sales"
    }
  ];

  const handlePlanClick = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="pricing-page">
      <Navbar onNavigate={onNavigate} />
      <div className="pricing-container">
        <div className="pricing-header">
          <h1>Simple, Transparent Pricing</h1>
          <p>Choose the perfect plan for your extension development needs</p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`pricing-card ${plan.popular ? "popular" : ""}`}
              onClick={() => handlePlanClick(plan)}
            >
              {plan.popular && <div className="popular-badge">Most Popular</div>}
              
              <div className="plan-header">
                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-description">{plan.description}</p>
              </div>

              <div className="plan-price">
                <span className="price-value">{plan.price}</span>
                <span className="price-period">{plan.period}</span>
              </div>

              <button
                className="plan-cta"
                style={{ borderColor: plan.color, color: plan.color }}
              >
                {plan.cta}
              </button>

              <div className="plan-features">
                <h4>Features:</h4>
                <ul>
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <span className="checkmark">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="pricing-faq">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-items">
            <div className="faq-item">
              <h4>Can I switch plans anytime?</h4>
              <p>Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div className="faq-item">
              <h4>Is there a free trial for Professional?</h4>
              <p>Yes! Get 14 days of free access to all Professional features. No credit card required.</p>
            </div>
            <div className="faq-item">
              <h4>What payment methods do you accept?</h4>
              <p>We accept all major credit cards, PayPal, and crypto payments for Enterprise plans.</p>
            </div>
            <div className="faq-item">
              <h4>Do you offer discounts?</h4>
              <p>Yes! Annual subscriptions get 20% off, and non-profit organizations get 50% discount.</p>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <PricingModal plan={selectedPlan} onClose={closeModal} onNavigate={onNavigate} />
      )}
    </div>
  );
}

export default Pricing;
