import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";
import { getAllTests,deleteTest } from "../controllers/adminController.js";
import {
  getPendingUsers,
  approveUser,
  rejectUser
} from "../controllers/adminController.js";


import {
  createTest,
  addQuestion,
  bulkAddQuestions,
  getQuestionsForTest,
  updateQuestion,
  deleteQuestion,
  getResultsForTest,
  getAttempt,
  uploadQuestions,
} from "../controllers/adminController.js";

const router = express.Router();
// const upload = multer({ dest: "uploads/" });

/**
 * 🧩 TEST MANAGEMENT
 */
router.post("/tests", protect, adminOnly, createTest);

/**
 * 🧩 QUESTION MANAGEMENT
 */

// Add single question
router.post("/tests/:testId/questions", protect, adminOnly, addQuestion);

// Bulk add multiple questions (from staged frontend list)
router.post("/tests/:testId/questions/bulk", protect, adminOnly, bulkAddQuestions);

// Get all questions for a specific test (admin view/edit page)
router.get("/tests/:testId/questions", protect, adminOnly, getQuestionsForTest);

// Update a single question
router.put("/questions/:questionId", protect, adminOnly, updateQuestion);

// Delete a question
router.delete("/questions/:questionId", protect, adminOnly, deleteQuestion);

/**
 * 🧩 UPLOAD QUESTIONS (CSV / JSON)
 */
router.post(
  "/tests/:testId/upload",
  protect,
  adminOnly,
  // upload.single("file"),
  uploadQuestions
);

/**
 * 🧩 TEST RESULTS & ATTEMPTS
 */
router.get("/tests/:testId/results", protect, adminOnly, getResultsForTest);
router.get("/attempts/:attemptId", protect, adminOnly, getAttempt);


router.get("/tests/all", protect, adminOnly, getAllTests);
router.delete("/tests/:id", protect, adminOnly, deleteTest);

router.get("/pending-users", protect, adminOnly, getPendingUsers);

// Approve & Reject
router.put("/approve-user/:id", protect, adminOnly, approveUser);
router.put("/reject-user/:id", protect, adminOnly, rejectUser);
export default router;
