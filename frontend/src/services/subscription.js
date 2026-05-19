const premiumPatterns = [
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
  /background script/i,
];

export function isPremiumPrompt(prompt) {
  if (!prompt || typeof prompt !== "string") {
    return false;
  }

  return premiumPatterns.some((pattern) => pattern.test(prompt));
}

export const subscriptionPlans = [
  {
    tier: "Free",
    badge: "Free",
    description: "Generate standard Chrome extensions with basic AI support.",
    features: [
      "Simple extension generation",
      "Basic edit workflows",
      "Standard UI components",
    ],
  },
  {
    tier: "Premium",
    badge: "Premium",
    description: "Unlock advanced integrations, database and payment workflows.",
    features: [
      "API integrations",
      "Authentication systems",
      "Database-powered extensions",
      "Payment gateway support",
      "External fetch and automation",
    ],
  },
  {
    tier: "Enterprise",
    badge: "Enterprise",
    description: "Custom enterprise solutions with premium support and billing.",
    features: [
      "Dedicated onboarding",
      "SLA support",
      "Custom integrations",
      "Team collaboration",
    ],
  },
];

export const subscriptionBadges = ["Free", "Premium", "Enterprise"];

export function getPlanBadge(plan) {
  return plan?.tier || "Free";
}

export function getPremiumNotice() {
  return "Premium subscription required for advanced extension generation.";
}
