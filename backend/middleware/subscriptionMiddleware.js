import { requiresPremium, getPremiumNotice, getCurrentSubscription } from "../services/subscriptionService.js";

export function premiumFeatureGuard(req, res, next) {
  const prompt = req.body.prompt || req.body.editRequest || "";
  const tier = req.headers["x-subscription-tier"] || "Free";
  const userPlan = getCurrentSubscription(tier);
  const isPremiumRequest = requiresPremium(prompt, userPlan);

  if (isPremiumRequest) {
    console.warn("[subscriptionMiddleware] Premium access blocked for prompt:", prompt);
    return res.status(402).json({
      success: false,
      premiumRequired: true,
      message: getPremiumNotice(),
    });
  }

  next();
}
