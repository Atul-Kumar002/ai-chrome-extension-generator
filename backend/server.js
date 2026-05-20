import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import projectRoutes from "./routes/projectRoutes.js";
import generateRoute from "./routes/generateRoute.js";
import editRoute from "./routes/editRoute.js";
import subscriptionRoute from "./routes/subscriptionRoute.js";
import { sanitizeRequestBody } from "./middleware/requestSanitizer.js";
import { apiRateLimiter } from "./middleware/rateLimiter.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { logger } from "./utils/logger.js";
import { ENV, PORT, FRONTEND_ORIGIN } from "./config/envConfig.js";

const app = express();

app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: [FRONTEND_ORIGIN, "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(sanitizeRequestBody);
app.use(apiRateLimiter);
app.use("/temp", express.static("temp"));

app.use("/api/generate", generateRoute);
app.use("/api/edit", editRoute);
app.use("/api/subscription", subscriptionRoute);
app.use("/api/projects", projectRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  if (ENV !== "production") {
    logger.info(`Frontend origin allowed: ${FRONTEND_ORIGIN}`);
  }
});