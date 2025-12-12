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

// ---------- GLOBAL CORS FIX FOR VERCEL ---------- //
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");  
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Optional: if you want to use express CORS package too
const allowedOrigins = [
  "http://localhost:5173",
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    // Allow all vercel frontend urls --> https://something.vercel.app
    if (origin.endsWith(".vercel.app")) return callback(null, true);

    if (allowedOrigins.includes(origin)) return callback(null, true);

    return callback(new Error("❌ CORS blocked: " + origin), false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
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
