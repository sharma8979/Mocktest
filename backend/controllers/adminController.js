import Test from "../models/Test.js";
import Question from "../models/Question.js";
import Attempt from "../models/Attempt.js";
import mongoose from "mongoose";
import fs from "fs";
import csvParser from "csv-parser";

// 🧩 Create a test
export const createTest = async (req, res) => {
  try {
    const { title, description, duration, published, startTime } = req.body;

    if (!title || !duration || !startTime)
      return res.status(400).json({ message: "Missing required fields" });

    const parsedStartTime = new Date(startTime);
    if (isNaN(parsedStartTime))
      return res.status(400).json({ message: "Invalid start time" });

    const endTime = new Date(parsedStartTime.getTime() + duration * 60000);

    const test = await Test.create({
      title,
      description,
      duration,
      published,
      startTime: parsedStartTime,
      endTime,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Test created successfully", test });
  } catch (err) {
    console.error("❌ Error creating test:", err);
    res.status(500).json({ message: "Server error while creating test" });
  }
};

// 🧩 Add a single question to test
export const addQuestion = async (req, res) => {
  try {
    const { testId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(testId))
      return res.status(400).json({ message: "Invalid testId" });

    const { text, type = "mcq", options = [], marks = 1, negativeMarks = 0, order = 0 } = req.body;

    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    const opts = options.map((opt, idx) => ({
      id: opt.id ?? String.fromCharCode(65 + idx),
      text: opt.text,
      isCorrect: !!opt.isCorrect,
    }));

    const question = await Question.create({
      testId,
      text,
      type,
      options: opts,
      marks,
      negativeMarks,
      order,
    });

    res.status(201).json({ question });
  } catch (err) {
    console.error("❌ addQuestion:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🧩 Bulk add multiple questions at once
export const bulkAddQuestions = async (req, res) => {
  try {
    const { testId } = req.params;
    const questions = req.body.questions;

    if (!Array.isArray(questions) || questions.length === 0)
      return res.status(400).json({ message: "No questions provided" });

    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    const formatted = questions.map((q, idx) => ({
      testId,
      text: q.text,
      type: q.type || "mcq",
      options: (q.options || []).map((opt, i) => ({
        id: opt.id ?? String.fromCharCode(65 + i),
        text: opt.text,
        isCorrect: !!opt.isCorrect,
      })),
      marks: Number(q.marks || 1),
      negativeMarks: Number(q.negativeMarks || 0),
      order: q.order ?? idx,
    }));

    const inserted = await Question.insertMany(formatted);
    res.json({
      message: "✅ Bulk questions added successfully",
      count: inserted.length,
      questions: inserted,
    });
  } catch (err) {
    console.error("❌ bulkAddQuestions:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🧩 Get all questions for a test
export const getQuestionsForTest = async (req, res) => {
  try {
    const { testId } = req.params;

    const questions = await Question.find({ testId }).sort({ createdAt: 1 });
    if (!questions.length)
      return res.status(404).json({ message: "No questions found for this test" });

    res.json({ questions });
  } catch (err) {
    console.error("❌ getQuestionsForTest:", err);
    res.status(500).json({ message: "Server error while fetching questions" });
  }
};

// 🧩 Update a question
export const updateQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const update = req.body;

    const q = await Question.findById(questionId);
    if (!q) return res.status(404).json({ message: "Question not found" });

    q.text = update.text ?? q.text;
    if (update.options) {
      q.options = update.options.map((opt, i) => ({
        id: opt.id ?? String.fromCharCode(65 + i),
        text: opt.text,
        isCorrect: !!opt.isCorrect,
      }));
    }
    q.marks = update.marks ?? q.marks;
    q.negativeMarks = update.negativeMarks ?? q.negativeMarks;
    q.order = update.order ?? q.order;

    await q.save();
    res.json({ message: "✅ Question updated successfully", question: q });
  } catch (err) {
    console.error("❌ updateQuestion:", err);
    res.status(500).json({ message: "Server error while updating question" });
  }
};

// 🧩 Delete a question
export const deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const q = await Question.findById(questionId);
    if (!q) return res.status(404).json({ message: "Question not found" });

    await q.deleteOne();
    res.json({ message: "🗑️ Question deleted successfully" });
  } catch (err) {
    console.error("❌ deleteQuestion:", err);
    res.status(500).json({ message: "Server error while deleting question" });
  }
};

// 🧩 Get all results for a test
export const getResultsForTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const attempts = await Attempt.find({ testId })
      .populate("userId", "name email")
      .populate("answers.questionId", "text")
      .sort({ createdAt: -1 })
      .lean();
    res.json({ attempts });
  } catch (err) {
    console.error("❌ getResultsForTest:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🧩 Get single attempt details
export const getAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const attempt = await Attempt.findById(attemptId)
      .populate("userId", "name email")
      .populate("answers.questionId", "text options")
      .lean();

    if (!attempt) return res.status(404).json({ message: "Attempt not found" });
    res.json({ attempt });
  } catch (err) {
    console.error("❌ getAttempt:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🧩 Upload questions from CSV/JSON file
export const uploadQuestions = async (req, res) => {
  try {
    const { testId } = req.params;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    const questions = [];

    // JSON
    if (file.originalname.endsWith(".json")) {
      const data = JSON.parse(fs.readFileSync(file.path, "utf-8"));
      questions.push(...data);
    }
    // CSV
    else if (file.originalname.endsWith(".csv")) {
      await new Promise((resolve, reject) => {
        fs.createReadStream(file.path)
          .pipe(csvParser())
          .on("data", (row) => questions.push(row))
          .on("end", resolve)
          .on("error", reject);
      });
    } else {
      return res.status(400).json({ message: "Unsupported file format" });
    }

    const formattedQuestions = questions.map((q) => ({
      testId,
      text: q.text || q.question,
      type: "mcq",
      options: [
        { id: "A", text: q.optionA, isCorrect: q.correct?.toUpperCase() === "A" },
        { id: "B", text: q.optionB, isCorrect: q.correct?.toUpperCase() === "B" },
        { id: "C", text: q.optionC, isCorrect: q.correct?.toUpperCase() === "C" },
        { id: "D", text: q.optionD, isCorrect: q.correct?.toUpperCase() === "D" },
      ],
      marks: Number(q.marks || 1),
      negativeMarks: Number(q.negativeMarks || 0),
    }));

    await Question.insertMany(formattedQuestions);

    fs.unlinkSync(file.path); // delete uploaded file

    res.json({
      message: "✅ Questions uploaded successfully",
      count: formattedQuestions.length,
    });
  } catch (err) {
    console.error("❌ uploadQuestions:", err);
    res.status(500).json({ message: "Server error" });
  }
};
