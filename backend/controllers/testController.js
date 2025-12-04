import Test from '../models/Test.js';
import Question from '../models/Question.js';

/**
 * ✅ List ALL published tests (ALWAYS visible)
 */
export const listPublishedTests = async (req, res) => {
  try {
    // show all published tests, NO time restriction
    const tests = await Test.find({
      published: true
    }).select('title description duration startTime endTime createdAt');

    res.json({ tests });
  } catch (err) {
    console.error('❌ Error in listPublishedTests:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


/**
 * ✅ Fetch a test + questions (NO time restriction)
 * Test will be available ANYTIME until admin deletes it
 */
export const getTestWithQuestions = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await Test.findById(id);

    if (!test || !test.published) {
      return res.status(404).json({ message: 'Test not found or unpublished' });
    }

    // ❌ REMOVE START TIME CHECK
    // ❌ REMOVE END TIME CHECK
    // TEST WILL ALWAYS OPEN

    const questions = await Question.find({ testId: id })
      .sort({ order: 1 })
      .lean();

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
