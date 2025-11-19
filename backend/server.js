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
// ------------ CORS FIX FOR DEPLOYMENT ------------ //
const allowedOrigins = [
  "https://mocktest-733bkxo4q-sharma8979s-projects.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS blocked by server"));
    },
    methods: "GET,POST,PUT,PATCH,DELETE",
    allowedHeaders: "Content-Type, Authorization",
  })
);



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
