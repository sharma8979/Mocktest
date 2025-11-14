import Attempt from "../models/Attempt.js";
import Question from "../models/Question.js";

// Start an attempt
export const startAttempt = async (req, res) => {
  try {
    const { testId } = req.params;

    // Check if user already has an active attempt
    let existing = await Attempt.findOne({ userId: req.user._id, testId, status: "in_progress" });
    if (existing) return res.json({ attempt: existing });

    const attempt = await Attempt.create({
      userId: req.user._id,
      testId,
      startedAt: new Date(),
    });

    res.status(201).json({ attempt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Save or update an answer
export const saveAnswer = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { questionId, selectedOptionId } = req.body;

    const attempt = await Attempt.findById(attemptId);
    if (!attempt) return res.status(404).json({ message: "Attempt not found" });
    if (attempt.status !== "in_progress")
      return res.status(400).json({ message: "Attempt already submitted" });

    // Check question exists
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: "Question not found" });

    // Find correct answer
    const correctOption = question.options.find((o) => o.isCorrect);

    // Calculate marks
    const correct = correctOption && correctOption.id === selectedOptionId;
    const marksAwarded = correct ? question.marks : -question.negativeMarks;

    // Update or add answer
    const existingAnswer = attempt.answers.find(
      (a) => a.questionId.toString() === questionId
    );
    if (existingAnswer) {
      existingAnswer.selectedOptionId = selectedOptionId;
      existingAnswer.correct = correct;
      existingAnswer.marksAwarded = marksAwarded;
    } else {
      attempt.answers.push({
        questionId,
        selectedOptionId,
        correct,
        marksAwarded,
      });
    }

    await attempt.save();
    res.json({ message: "Answer saved", correct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Submit attempt
export const submitAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await Attempt.findById(attemptId).populate("answers.questionId");
    if (!attempt) return res.status(404).json({ message: "Attempt not found" });
    if (attempt.status === "submitted")
      return res.status(400).json({ message: "Already submitted" });

    // Calculate totals
    let total = 0;
    let correctCount = 0;
    let attemptedCount = 0;
    let totalPossibleMarks = 0;

    attempt.answers.forEach((a) => {
      if (a.selectedOptionId) attemptedCount++;
      totalPossibleMarks += a.questionId.marks;
      total += a.marksAwarded || 0;
      if (a.correct) correctCount++;
    });

    attempt.totalMarks = total;
    attempt.status = "submitted";
    attempt.finishedAt = new Date();

    await attempt.save();

    const percentage = ((total / totalPossibleMarks) * 100).toFixed(2);
    const accuracy = ((correctCount / attemptedCount) * 100 || 0).toFixed(2);

    res.json({
      message: "Attempt submitted successfully",
      totalMarks: total,
      totalPossibleMarks,
      correctCount,
      attemptedCount,
      percentage,
      accuracy,
      answers: attempt.answers.map((a) => ({
        questionText: a.questionId.text,
        selectedOptionId: a.selectedOptionId,
        correctOption: a.questionId.options.find((o) => o.isCorrect)?.id,
        marksAwarded: a.marksAwarded,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const { testId } = req.params;

    const attempts = await Attempt.find({ testId, status: "submitted" })
      .populate("userId", "name email")
      .sort({ totalMarks: -1 })
      .limit(10);

    const leaderboard = attempts.map((a, idx) => ({
      rank: idx + 1,
      name: a.userId?.name || "Unknown",
      email: a.userId?.email,
      totalMarks: a.totalMarks,
      finishedAt: a.finishedAt,
    }));

    res.json({ leaderboard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

