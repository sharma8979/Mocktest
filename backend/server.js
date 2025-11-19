import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import attemptRoutes from "./routes/attemptRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ------------ CORS FIX FOR DEPLOYMENT ------------ //
app.use(cors({
  origin: [
    "http://localhost:5173",           // local frontend
    "https://mocktest-733bkxo4q-sharma8979s-projects.vercel.app",            // vercel deployments
  ],
  credentials: true,
}));

app.use(express.json());

// ------------------- ROUTES ---------------------- //
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/attempts", attemptRoutes);

// ------------------- ROOT ------------------------ //
app.get("/", (req, res) => {
  res.send("MockTestHub API running...");
});

// ------------------ START SERVER ----------------- //
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
