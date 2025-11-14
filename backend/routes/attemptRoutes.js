import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { startAttempt, saveAnswer, submitAttempt } from "../controllers/attemptController.js";
import { getLeaderboard } from "../controllers/attemptController.js";

const router = express.Router();

router.post("/start/:testId", protect, startAttempt);
router.post("/:attemptId/answer", protect, saveAnswer);
router.post("/:attemptId/submit", protect, submitAttempt);

// ... other routes
router.get("/leaderboard/:testId", protect, getLeaderboard);

export default router;



