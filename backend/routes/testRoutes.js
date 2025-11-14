import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { listPublishedTests, getTestWithQuestions } from '../controllers/testController.js';

const router = express.Router();

router.get('/', protect, listPublishedTests); // list available tests
router.get('/:id', protect, getTestWithQuestions); // get questions when starting

export default router;
