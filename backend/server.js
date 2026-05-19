import express from "express";
import projectRoutes from "./routes/projectRoutes.js";
import cors from "cors";
import dotenv from "dotenv";
import generateRoute from "./routes/generateRoute.js";
import editRoute from "./routes/editRoute.js";
import subscriptionRoute from "./routes/subscriptionRoute.js";

dotenv.config();
console.log(process.env.GROQ_API_KEY);

const app = express();

app.use(cors());
app.use(express.json());
app.use("/temp", express.static("temp"));

app.use("/api/generate", generateRoute);
app.use("/api/edit", editRoute);
app.use("/api/subscription", subscriptionRoute);
app.use("/api/projects", projectRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});