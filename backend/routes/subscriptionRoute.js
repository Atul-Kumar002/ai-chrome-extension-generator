import express from "express";
import { buildSubscriptionStatus } from "../services/subscriptionService.js";

const router = express.Router();

router.get("/status", async (req, res) => {
  try {
    const status = buildSubscriptionStatus();

    res.json({
      success: true,
      message: "Subscription status retrieved.",
      subscription: status,
    });
  } catch (error) {
    console.error("Subscription route error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to retrieve subscription status.",
    });
  }
});

export default router;
