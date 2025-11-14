import Test from '../models/Test.js';
import Question from '../models/Question.js';

/**
 * ✅ List all published tests (visible to users)
 */
export const listPublishedTests = async (req, res) => {
  try {
    const now = new Date();

    // Only send tests that are published and whose startTime has passed
    const tests = await Test.find({
      published: true,
      startTime: { $lte: now }, // already started
      endTime: { $gte: now },   // not yet ended
    }).select('title description duration startTime endTime createdAt');

    res.json({ tests });
  } catch (err) {
    console.error('❌ Error in listPublishedTests:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * ✅ Fetch a test + its questions (only when within allowed time)
 */
export const getTestWithQuestions = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await Test.findById(id);

    if (!test || !test.published) {
      return res.status(404).json({ message: 'Test not found or unpublished' });
    }

    const now = new Date();

    // 🕓 Restrict access before test start
    if (test.startTime && now < new Date(test.startTime)) {
      return res.status(403).json({
        message: 'Test has not started yet.',
        startTime: test.startTime,
      });
    }

    // ⏳ Restrict access after test end
    if (test.endTime && now > new Date(test.endTime)) {
      return res.status(403).json({
        message: 'This test has ended.',
        endTime: test.endTime,
      });
    }

    // Fetch questions but DO NOT include correct answers
    const questions = await Question.find({ testId: id })
      .sort({ order: 1 })
      .lean();

    // Remove isCorrect from options before sending
    const safeQuestions = questions.map((q) => ({
      ...q,
      options: q.options?.map((opt) => ({
        id: opt.id,
        text: opt.text,
      })),
    }));

    res.json({ test, questions: safeQuestions });
  } catch (err) {
    console.error('❌ Error in getTestWithQuestions:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
