import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from './routes/adminRoutes.js';
import testRoutes from './routes/testRoutes.js';
import attemptRoutes from "./routes/attemptRoutes.js";


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("MockTestHub API running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


// after app.use(express.json())
app.use('/api/admin', adminRoutes);
app.use('/api/tests', testRoutes)

// after other app.use()
app.use("/api/attempts", attemptRoutes);

