const premiumKeywords = [
  /api\b/i,
  /integration/i,
  /auth(entica(tion|te)?)?/i,
  /login/i,
  /signup/i,
  /sign[- ]?in/i,
  /database/i,
  /db\b/i,
  /payment/i,
  /stripe/i,
  /paypal/i,
  /webhook/i,
  /fetch\(/i,
  /axios/i,
  /external api/i,
  /external fetch/i,
  /automation/i,
  /workflow/i,
  /assistant/i,
  /openai/i,
  /chatgpt/i,
  /gpt-/i,
  /ai integration/i,
  /machine learning/i,
  /jwt/i,
  /oauth/i,
  /token/i,
  /service worker/i,
  /background script/i
];

const defaultPlan = {
  tier: "Free",
  badge: "Free",
  description: "Access basic AI extension generation",
  features: [
    "Generate simple extensions",
    "Basic edit and preview tools",
    "Standard templates",
  ],
};

const premiumPlan = {
  tier: "Premium",
  badge: "Premium",
  description: "Unlock advanced integrations and premium AI workflows",
  features: [
    "API integrations",
    "Authentication systems",
    "Payment gateway code",
    "Database workflows",
    "External fetch and automation",
    "Priority support",
  ],
};

const enterprisePlan = {
  tier: "Enterprise",
  badge: "Enterprise",
  description: "Custom teams, billing, and premium enterprise support",
  features: [
    "Dedicated onboarding",
    "Custom integration support",
    "Advanced security",
    "SLA and reporting",
  ],
};

export function isPremiumPrompt(prompt) {
  if (!prompt || typeof prompt !== "string") {
    return false;
  }

  return premiumKeywords.some((pattern) => pattern.test(prompt));
}

export function getCurrentSubscription(tier = "Free") {
  if (tier === "Premium") return premiumPlan;
  if (tier === "Enterprise") return enterprisePlan;
  return defaultPlan;
}

export function getSubscriptionPlans() {
  return [defaultPlan, premiumPlan, enterprisePlan];
}

export function buildSubscriptionStatus(tier = "Free") {
  const currentPlan = getCurrentSubscription(tier);

  return {
    currentPlan,
    availablePlans: getSubscriptionPlans(),
    featureFlag: currentPlan.tier !== "Free" ? "premium" : "free",
    upgradeUrl: "/pricing",
    stripe: {
      enabled: false,
      publishableKey: null,
    },
  };
}

export function requiresPremium(prompt, userPlan = getCurrentSubscription()) {
  return userPlan.tier === "Free" && isPremiumPrompt(prompt);
}

export function getPremiumNotice() {
  return "Premium subscription required for advanced extension generation.";
}

// Future: wire Stripe, payment, and user accounts through this service.
export async function reserveSubscriptionCheckout(userId, planId) {
  throw new Error("Subscription checkout is not implemented yet.");
}
