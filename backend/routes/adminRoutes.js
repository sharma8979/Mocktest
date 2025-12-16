import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";
import { getUserCount } from "../controllers/adminController.js";


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
  getAllTests,
  deleteTest,
  getPendingUsers,
  approveUser,
  rejectUser,
  uploadPdfQuestions
} from "../controllers/adminController.js";

const router = express.Router();

// ⬆️ Define multer BEFORE routes
const upload = multer({ dest: "uploads/" });

/** 🧩 TEST MANAGEMENT */
router.post("/tests", protect, adminOnly, createTest);

/** 🧩 QUESTION MANAGEMENT */
router.post("/tests/:testId/questions", protect, adminOnly, addQuestion);
router.post("/tests/:testId/questions/bulk", protect, adminOnly, bulkAddQuestions);
router.get("/tests/:testId/questions", protect, adminOnly, getQuestionsForTest);
router.put("/questions/:questionId", protect, adminOnly, updateQuestion);
router.delete("/questions/:questionId", protect, adminOnly, deleteQuestion);

/** 🧩 Upload CSV/JSON */
router.post(
  "/tests/:testId/upload",
  protect,
  adminOnly,
  upload.single("file"),
  uploadQuestions
);

/** 🧩 Upload PDF Questions */
router.post(
  "/tests/:testId/upload-pdf",
  protect,
  adminOnly,
  upload.single("file"),
  uploadPdfQuestions
);


/** 🧩 TEST RESULTS */
router.get("/tests/:testId/results", protect, adminOnly, getResultsForTest);
router.get("/attempts/:attemptId", protect, adminOnly, getAttempt);

router.get("/tests/all", protect, adminOnly, getAllTests);
router.delete("/tests/:id", protect, adminOnly, deleteTest);

/** 🧩 USER APPROVAL */
router.get("/pending-users", protect, adminOnly, getPendingUsers);
router.put("/approve-user/:id", protect, adminOnly, approveUser);
router.put("/reject-user/:id", protect, adminOnly, rejectUser);


router.get("/user-count", protect, adminOnly, getUserCount);



export default router;
