import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api.js";
import { motion } from "framer-motion";

export default function AddQuestion() {
  const { id: testId } = useParams();
  const navigate = useNavigate();

  /* ---------------- FORM STATE ---------------- */
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [marks, setMarks] = useState(1);
  const [negativeMarks, setNegativeMarks] = useState(0);

  /* ---------------- STAGED & SAVED ---------------- */
  const [staged, setStaged] = useState([]);
  const [savedQuestions, setSavedQuestions] = useState([]);

  /* ---------------- PDF ---------------- */
  const [pdfFile, setPdfFile] = useState(null);
  const [message, setMessage] = useState("");

  /* ---------------- LOAD SAVED QUESTIONS ---------------- */
  useEffect(() => {
    loadSavedQuestions();
  }, []);

  const loadSavedQuestions = async () => {
    try {
      const { data } = await API.get(`/admin/tests/${testId}/questions`);
      setSavedQuestions(data.questions || []);
    } catch {}
  };

  /* ---------------- ADD TO STAGED ---------------- */
  const addToStaged = (e) => {
    e.preventDefault();

    if (!question || options.some((o) => !o)) {
      setMessage("⚠ Please complete all fields before staging");
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

    resetForm();
    setMessage("✨ Question added to staging area");
  };

  /* ---------------- SAVE ALL ---------------- */
  const saveAllToDatabase = async () => {
    if (staged.length === 0) {
      setMessage("⚠ No staged questions to save");
      return;
    }

    try {
      const payload = staged.map((q) => ({
        text: q.text,
        options: q.options,
        marks: q.marks,
        negativeMarks: q.negativeMarks,
      }));

      await API.post(`/admin/tests/${testId}/questions/bulk`, {
        questions: payload,
      });

      setMessage("✅ All questions saved successfully");
      setStaged([]);
      loadSavedQuestions();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to save questions");
    }
  };

  /* ---------------- PDF UPLOAD (STAGED) ---------------- */
  const uploadPdf = async () => {
    if (!pdfFile) {
      setMessage("⚠ Please select a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("file", pdfFile);

    try {
      const { data } = await API.post(
        `/admin/tests/${testId}/upload-pdf`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setStaged((prev) => [...prev, ...(data.questions || [])]);
      setMessage("📄 PDF questions added to staging");
    } catch (err) {
      console.error(err);
      setMessage("❌ PDF upload failed");
    }
  };

  const resetForm = () => {
    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectIndex(0);
    setMarks(1);
    setNegativeMarks(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-6 py-10 text-gray-900">

      {/* BACK */}
      <button
        onClick={() => navigate("/admin")}
        className="mb-6 px-4 py-2 rounded-xl bg-indigo-500 text-white shadow"
      >
        ⬅ Back to Admin Dashboard
      </button>

      <h1 className="text-4xl font-extrabold text-center mb-4 text-indigo-700">
        Question Builder
      </h1>
      <p className="text-center text-gray-600 mb-10">
        Create, review, and finalize questions before publishing them to your test.
      </p>

      {/* ---------------- ADD FORM ---------------- */}
      <motion.div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-purple-700">
          ➕ Add Question (Staging)
        </h2>

        <form onSubmit={addToStaged} className="space-y-4">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter the question text"
            className="w-full p-3 rounded border"
          />

          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-3">
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
                className="flex-1 p-2 rounded border"
              />
            </div>
          ))}

          <div className="flex gap-4">
            <input
              type="number"
              min="1"
              value={marks}
              onChange={(e) => setMarks(Number(e.target.value))}
              className="w-28 p-2 border rounded"
              placeholder="Marks"
            />
            <input
              type="number"
              min="0"
              value={negativeMarks}
              onChange={(e) => setNegativeMarks(Number(e.target.value))}
              className="w-28 p-2 border rounded"
              placeholder="Negative"
            />
          </div>

          <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold">
            Add to Staging
          </button>
        </form>
      </motion.div>

      {/* ---------------- STAGED ---------------- */}
      <div className="max-w-5xl mx-auto mt-14">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
          🧪 Staged Questions
        </h2>

        {staged.length === 0 ? (
          <p className="text-center text-gray-500">
            No staged questions yet.
          </p>
        ) : (
          <>
            {staged.map((q, idx) => (
              <div
                key={q.id}
                className="bg-white p-6 rounded-xl shadow mb-4"
              >
                <p className="font-semibold">
                  Q{idx + 1}. {q.text}
                </p>
                <ul className="ml-4 mt-2 text-sm">
                  {q.options.map((o, i) => (
                    <li key={i}>
                      {String.fromCharCode(65 + i)}. {o.text}{" "}
                      {o.isCorrect && "✔"}
                    </li>
                  ))}
                </ul>
                <p className="text-sm mt-2">
                  Marks: {q.marks} | Negative: {q.negativeMarks}
                </p>
              </div>
            ))}

            <button
              onClick={saveAllToDatabase}
              className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold shadow-lg mt-6"
            >
              💾 Save All Questions to Database
            </button>
          </>
        )}
      </div>

      {/* ---------------- SAVED ---------------- */}
      <div className="max-w-5xl mx-auto mt-20">
        <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">
          📚 Saved Questions
        </h2>

        {savedQuestions.length === 0 ? (
          <p className="text-center text-gray-500">
            No questions saved yet.
          </p>
        ) : (
          savedQuestions.map((q, i) => (
            <div key={q._id} className="bg-white p-6 rounded-xl shadow mb-4">
              <p className="font-semibold">
                Q{i + 1}. {q.text}
              </p>
            </div>
          ))
        )}
      </div>

      {message && (
        <p className="text-center mt-10 text-indigo-600 font-semibold">
          {message}
        </p>
      )}
    </div>
  );
}
