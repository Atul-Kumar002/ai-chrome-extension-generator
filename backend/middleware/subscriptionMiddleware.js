import { requiresPremium, getPremiumNotice } from "../services/subscriptionService.js";

export function premiumFeatureGuard(req, res, next) {
  const prompt = req.body.prompt || req.body.editRequest || "";
  const isPremiumRequest = requiresPremium(prompt);

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
