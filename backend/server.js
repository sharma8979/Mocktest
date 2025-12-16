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

/* -------------------- CORS (SINGLE SOURCE) -------------------- */
const allowedOrigins = [
  "http://localhost:5173",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Postman, curl
    if (origin.endsWith(".vercel.app")) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS blocked: " + origin), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

/* -------------------- ROUTES -------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/attempts", attemptRoutes);

/* -------------------- ROOT -------------------- */
app.get("/", (req, res) => {
  res.send("MockTestHub API running...");
});

/* -------------------- SERVER -------------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
