import React from "react";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api.js";
import { motion } from "framer-motion";

console.log("TestAttempt loaded");





export default function TestAttempt() {
  const { id: testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [attemptId, setAttemptId] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const loadTest = async () => {
      try {
        const { data } = await API.get(`/tests/${testId}`);
        setTest(data.test);
        setQuestions(data.questions || []);
        setTimeLeft(data.test.duration * 60);
      } catch (err) {
        console.error("Error loading test:", err);
      }
    };
    loadTest();
  }, [testId]);

  useEffect(() => {
    const startAttempt = async () => {
      try {
        const { data } = await API.post(`/attempts/start/${testId}`);
        setAttemptId(data.attempt._id);
      } catch (err) {
        console.error("Error starting attempt:", err);
      }
    };
    startAttempt();
  }, [testId]);

  useEffect(() => {
    if (!timeLeft || submitted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timeLeft, submitted]);

  const handleSelect = async (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    try {
      await API.post(`/attempts/${attemptId}/answer`, {
        questionId,
        selectedOptionId: optionId,
      });
    } catch (err) {
      console.error("Error saving answer:", err);
    }
  };

  const handleSubmit = async () => {
    clearInterval(timerRef.current);
    await submitAttempt();
  };

  const handleAutoSubmit = async () => {
    if (!submitted) {
      alert("⏰ Time’s up! Submitting your test...");
      await submitAttempt();
    }
  };

  const submitAttempt = async () => {
    try {
      const { data } = await API.post(`/attempts/${attemptId}/submit`);
      setScore(data);
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting test:", err);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  if (!test)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 text-white text-xl">
        Loading test...
      </div>
    );

  // ✅ RESULT VIEW
  if (submitted)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white flex flex-col items-center py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8 w-full max-w-3xl text-center"
        >
          <h2 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent">
            📊 Test Results
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
            <div>
              <p className="text-xl font-semibold">{score.totalMarks}</p>
              <p className="text-white/70 text-sm">Total Marks</p>
            </div>
            <div>
              <p className="text-xl font-semibold">{score.percentage}%</p>
              <p className="text-white/70 text-sm">Percentage</p>
            </div>
            <div>
              <p className="text-xl font-semibold">{score.correctCount}</p>
              <p className="text-white/70 text-sm">Correct</p>
            </div>
            <div>
              <p className="text-xl font-semibold">{score.attemptedCount}</p>
              <p className="text-white/70 text-sm">Attempted</p>
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-4">Detailed Review</h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto px-2">
            {score.answers.map((a, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl shadow-md ${
                  a.selectedOptionId === a.correctOption
                    ? "bg-green-500/20 border border-green-500/50"
                    : "bg-red-500/20 border border-red-500/50"
                }`}
              >
                <p className="font-semibold">
                  Q{idx + 1}: {a.questionText}
                </p>
                <p className="text-sm text-white/80 mt-1">
                  Your Answer:{" "}
                  <strong>{a.selectedOptionId || "Not answered"}</strong>
                  <br />
                  Correct Answer: <strong>{a.correctOption}</strong>
                  <br />
                  Marks: {a.marksAwarded}
                </p>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="mt-8 py-3 px-8 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-xl text-white font-semibold shadow-lg hover:brightness-110 transition-all duration-300"
          >
            Back to Dashboard
          </motion.button>
        </motion.div>
      </div>
    );

  // ✅ TEST VIEW
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 text-white flex flex-col items-center py-10">
      {/* Header */}
      <h2 className="text-4xl font-bold mb-2">{test.title}</h2>
      <p className="text-white/80 mb-6">{test.description}</p>

      {/* Timer */}
      <div className="w-full max-w-lg bg-white/20 rounded-full h-5 overflow-hidden mb-8">
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: `${(timeLeft / (test.duration * 60)) * 100}%` }}
          transition={{ duration: 1, ease: "linear" }}
          className={`h-5 ${
            timeLeft < 60
              ? "bg-red-500"
              : timeLeft < 180
              ? "bg-yellow-400"
              : "bg-green-400"
          }`}
        ></motion.div>
      </div>

      <h3
        className={`text-lg font-semibold mb-6 ${
          timeLeft < 60 ? "text-red-300 animate-pulse" : "text-white"
        }`}
      >
        ⏰ Time Left: {formatTime(timeLeft)}
      </h3>

      {/* Questions */}
      <div className="w-full max-w-3xl space-y-8 px-4">
        {questions.map((q, idx) => (
          <motion.div
            key={q._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-md p-6"
          >
            <h4 className="text-xl font-semibold mb-4">
              Q{idx + 1}. {q.text}
            </h4>
            <div className="space-y-3">
              {q.options.map((opt) => (
                <label
                  key={opt.id}
                  className={`block px-4 py-2 rounded-xl cursor-pointer border transition-all duration-300 ${
                    answers[q._id] === opt.id
                      ? "bg-gradient-to-r from-indigo-500 to-pink-500 border-transparent"
                      : "bg-white/10 hover:bg-white/20 border-white/30"
                  }`}
                >
                  <input
                    type="radio"
                    name={q._id}
                    checked={answers[q._id] === opt.id}
                    onChange={() => handleSelect(q._id, opt.id)}
                    className="mr-3 accent-indigo-500"
                  />
                  {opt.text}
                </label>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSubmit}
        className="mt-10 py-3 px-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-semibold shadow-lg hover:brightness-110 transition-all duration-300"
      >
        Submit Test
      </motion.button>
    </div>
  );
}
