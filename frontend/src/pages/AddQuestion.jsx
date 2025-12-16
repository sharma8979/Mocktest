import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api.js";
import { motion } from "framer-motion";

export default function AddQuestion() {
  const { id: testId } = useParams();
  const navigate = useNavigate();

  /* FORM STATE */
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [marks, setMarks] = useState(1);
  const [negativeMarks, setNegativeMarks] = useState(0);

  /* STAGED & SAVED */
  const [staged, setStaged] = useState([]);
  const [savedQuestions, setSavedQuestions] = useState([]);

  /* PDF */
  const [pdfFile, setPdfFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSavedQuestions();
  }, []);

  const loadSavedQuestions = async () => {
    try {
      const { data } = await API.get(`/admin/tests/${testId}/questions`);
      setSavedQuestions(data.questions || []);
    } catch {}
  };

  /* ADD TO STAGING */
  const addToStaged = (e) => {
    e.preventDefault();

    if (!question || options.some((o) => !o)) {
      setMessage("⚠ Please fill all fields before staging");
      return;
    }

    setStaged((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: question,
        options: options.map((o, i) => ({
          text: o,
          isCorrect: i === correctIndex,
        })),
        marks,
        negativeMarks,
      },
    ]);

    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectIndex(0);
    setMarks(1);
    setNegativeMarks(0);
    setMessage("✨ Question added to staging");
  };

  /* SAVE ALL */
  const saveAllToDatabase = async () => {
    if (!staged.length) return;

    try {
      await API.post(`/admin/tests/${testId}/questions/bulk`, {
        questions: staged.map((q) => ({
          text: q.text,
          options: q.options,
          marks: q.marks,
          negativeMarks: q.negativeMarks,
        })),
      });

      setStaged([]);
      loadSavedQuestions();
      setMessage("✅ All questions saved successfully");
    } catch {
      setMessage("❌ Failed to save questions");
    }
  };

  /* PDF UPLOAD */
  const uploadPdf = async () => {
    if (!pdfFile) return;

    const formData = new FormData();
    formData.append("file", pdfFile);

    try {
      const { data } = await API.post(
        `/admin/tests/${testId}/upload-pdf`,
        formData
      );
      setStaged((prev) => [...prev, ...(data.questions || [])]);
      setMessage("📄 PDF questions added to staging");
    } catch {
      setMessage("❌ PDF upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 px-6 py-10 text-white">

      {/* NAV */}
      <button
        onClick={() => navigate("/admin")}
        className="mb-8 px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 shadow-lg"
      >
        ⬅ Back to Admin Dashboard
      </button>

      <h1 className="text-4xl font-extrabold text-center mb-2">
        TestHub Question Builder
      </h1>
      <p className="text-center text-white/70 mb-12">
        Create questions, stage them, review carefully, then save to the test.
      </p>

      {/* ADD QUESTION */}
      <motion.div className="max-w-4xl mx-auto backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-pink-300">
          ➕ Add Question (Staging Area)
        </h2>

        <form onSubmit={addToStaged} className="space-y-4">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter question text"
            className="w-full p-3 rounded-xl bg-white/90 text-black"
          />

          {options.map((opt, i) => (
            <div key={i} className="flex gap-3 items-center">
              <input
                type="radio"
                checked={correctIndex === i}
                onChange={() => setCorrectIndex(i)}
              />
              <input
                value={opt}
                onChange={(e) => {
                  const arr = [...options];
                  arr[i] = e.target.value;
                  setOptions(arr);
                }}
                placeholder={`Option ${i + 1}`}
                className="flex-1 p-2 rounded-lg bg-white/90 text-black"
              />
            </div>
          ))}

          <div className="flex gap-4">
            <input
              type="number"
              min="1"
              value={marks}
              onChange={(e) => setMarks(+e.target.value)}
              className="w-32 p-2 rounded bg-white/90 text-black"
              placeholder="Marks"
            />
            <input
              type="number"
              min="0"
              value={negativeMarks}
              onChange={(e) => setNegativeMarks(+e.target.value)}
              className="w-32 p-2 rounded bg-white/90 text-black"
              placeholder="Negative"
            />
          </div>

          <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-xl font-bold">
            Add to Staging
          </button>
        </form>
      </motion.div>

      {/* STAGED */}
      <div className="max-w-5xl mx-auto mt-16">
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-300">
          🧪 Staged Questions
        </h2>

        {staged.map((q, i) => (
          <div key={q.id} className="bg-white/10 border border-white/20 p-6 rounded-xl mb-4">
            <p className="font-semibold">
              Q{i + 1}. {q.text}
            </p>
          </div>
        ))}

        {staged.length > 0 && (
          <button
            onClick={saveAllToDatabase}
            className="w-full py-4 mt-6 bg-emerald-500 rounded-xl font-bold shadow-lg"
          >
            💾 Save All Questions to Database
          </button>
        )}
      </div>

      {/* SAVED */}
      <div className="max-w-5xl mx-auto mt-20">
        <h2 className="text-3xl font-bold text-center mb-6 text-pink-300">
          📚 Saved Questions
        </h2>

        {savedQuestions.map((q, i) => (
          <div key={q._id} className="bg-white/10 border border-white/20 p-5 rounded-xl mb-3">
            Q{i + 1}. {q.text}
          </div>
        ))}
      </div>

      {message && (
        <p className="text-center mt-10 text-yellow-300 font-semibold">
          {message}
        </p>
      )}
    </div>
  );
}
