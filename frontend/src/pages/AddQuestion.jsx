import React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api.js";
import { motion } from "framer-motion";



function emptyOption(id) {
  return { id, text: "", isCorrect: false };
}

export default function AddQuestion() {
  const { id: testId } = useParams();
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [options, setOptions] = useState([
    emptyOption("A"),
    emptyOption("B"),
    emptyOption("C"),
    emptyOption("D"),
  ]);

  const [marks, setMarks] = useState(1);
  const [negativeMarks, setNegativeMarks] = useState(0);

  const [staged, setStaged] = useState([]);
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);


  useEffect(() => {
    const loadSaved = async () => {
      try {
        const { data } = await API.get(`/admin/tests/${testId}/questions`);
        setSavedQuestions(data.questions || []);
      } catch (err) {
        if (err.response?.status !== 404) console.error(err);
      }
    };
    loadSaved();
  }, [testId]);

  const resetForm = () => {
    setText("");
    setOptions([
      emptyOption("A"),
      emptyOption("B"),
      emptyOption("C"),
      emptyOption("D"),
    ]);
    setMarks(1);
    setNegativeMarks(0);
  };

  const setOptionField = (idx, field, val) => {
    const arr = options.map((o) => ({ ...o }));
    if (field === "isCorrect") {
      arr.forEach((o, i) => (o.isCorrect = i === idx));
    } else {
      arr[idx][field] = val;
    }
    setOptions(arr);
  };

  const handleAddToStaged = (e) => {
    e.preventDefault();
    if (!text.trim()) return setMessage("⚠ Question text required");
    if (options.some((o) => !o.text.trim()))
      return setMessage("⚠ All option fields required");

    setStaged((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        text,
        options,
        marks,
        negativeMarks,
      },
    ]);

    resetForm();
    setMessage("✨ Added to staged list");
  };

  const handleSaveAll = async () => {
    if (staged.length === 0) return setMessage("⚠ Nothing to save");

    try {
      const payload = staged.map((q, idx) => ({
        text: q.text,
        options: q.options,
        marks: q.marks,
        negativeMarks: q.negativeMarks,
        order: idx,
      }));

      const { data } = await API.post(
        `/admin/tests/${testId}/questions/bulk`,
        { questions: payload }
      );

      setMessage(`✅ Saved ${data.count} questions`);

      const { data: fresh } = await API.get(
        `/admin/tests/${testId}/questions`
      );
      setSavedQuestions(fresh.questions || []);
      setStaged([]);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to save");
    }
  };
  const handleFileUpload = async () => {
  if (!file) return setMessage("⚠ Please choose a file first");

  const formData = new FormData();
  formData.append("file", file);

  try {
    const { data } = await API.post(
      `/admin/tests/${testId}/upload`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    setMessage(`✅ Uploaded ${data.count} questions!`);

    // reload saved questions
    const { data: fresh } = await API.get(`/admin/tests/${testId}/questions`);
    setSavedQuestions(fresh.questions || []);
  } catch (err) {
    console.error(err);
    setMessage("❌ Upload failed");
  }
};


  const handleDeleteSaved = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;
    try {
      await API.delete(`/admin/questions/${questionId}`);
      setSavedQuestions((prev) => prev.filter((q) => q._id !== questionId));
      setMessage("🗑 Question deleted");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to delete question");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-8 text-white">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-4xl font-extrabold drop-shadow-lg mb-6"
      >
        Add Questions ✍️
      </motion.h2>

      <div className="flex flex-col lg:flex-row gap-12 justify-center">
        {/* LEFT FORM */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="backdrop-blur-xl bg-white/20 border border-white/30 p-6 rounded-2xl shadow-xl w-full max-w-xl"
        >
          <h3 className="text-2xl font-semibold mb-4">Create a Question</h3>

          <form onSubmit={handleAddToStaged} className="space-y-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter question text..."
              className="w-full p-3 rounded-xl bg-white/10 border border-white/30 outline-none"
              rows="3"
            />

            {/* OPTIONS */}
            <div>
              <h4 className="font-semibold mb-2">Options</h4>
              {options.map((opt, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 mb-2 bg-white/10 p-2 rounded-xl"
                >
                  <span className="w-10 font-bold">{opt.id})</span>
                  <input
                    value={opt.text}
                    onChange={(e) =>
                      setOptionField(i, "text", e.target.value)
                    }
                    placeholder="Option text..."
                    className="flex-1 p-2 rounded-lg bg-white/20 outline-none"
                  />
                  <input
                    type="radio"
                    checked={opt.isCorrect}
                    onChange={() => setOptionField(i, "isCorrect", true)}
                    name="correct"
                    className="w-5 h-5"
                  />
                </div>
              ))}
            </div>

            {/* MARKS */}
            <div className="flex gap-6">
              <div>
                <label>Marks:</label>
                <input
                  type="number"
                  value={marks}
                  onChange={(e) => setMarks(Number(e.target.value))}
                  className="ml-2 w-20 p-2 rounded-lg bg-white/20 outline-none"
                />
              </div>
              <div>
                <label>Negative:</label>
                <input
                  type="number"
                  value={negativeMarks}
                  onChange={(e) =>
                    setNegativeMarks(Number(e.target.value))
                  }
                  className="ml-2 w-20 p-2 rounded-lg bg-white/20 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-4 bg-gradient-to-r from-indigo-600 to-pink-500 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
            >
              ➕ Add to Staged
            </button>
          </form>

          {message && (
            <p className="mt-4 text-center text-yellow-200">{message}</p>
          )}
        </motion.div>

        {/* RIGHT SIDE → STAGED + SAVED */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-2xl"
        >
          {/* FILE UPLOAD SECTION */}
<div className="mt-6 p-4 bg-white/10 rounded-xl border border-white/20">
  <h4 className="text-xl font-semibold mb-3">Upload Questions File 📤</h4>

  <input
    type="file"
    accept=".csv, .json"
    onChange={(e) => setFile(e.target.files[0])}
    className="w-full p-2 rounded-lg bg-white/20"
  />

  <button
    onClick={handleFileUpload}
    className="w-full py-2 mt-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
  >
    📤 Upload File
  </button>

  <p className="text-sm text-white/70 mt-2">
    Supported formats: <strong>CSV, JSON</strong>
  </p>
</div>

          {/* STAGED */}
          <h3 className="text-2xl font-semibold mb-3">Staged Questions</h3>
          <div className="space-y-4">
            {staged.map((q, idx) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/20 p-4 rounded-xl border border-white/30"
              >
                <p className="font-bold">Q{idx + 1}: {q.text}</p>
                <ul className="ml-4 mt-2 text-sm">
                  {q.options.map((o) => (
                    <li key={o.id}>
                      {o.id}) {o.text} {o.isCorrect && "✔"}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {staged.length > 0 && (
            <button
              onClick={handleSaveAll}
              className="w-full py-3 mt-6 bg-green-500 hover:bg-green-600 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
            >
              💾 Save All to Database
            </button>
          )}

          <hr className="my-8 border-white/40" />

          {/* SAVED QUESTIONS */}
          <h3 className="text-2xl font-semibold mb-3">Saved Questions</h3>

          <div className="space-y-4">
            {savedQuestions.map((q, i) => (
              <motion.div
                key={q._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/20 p-4 rounded-xl border border-white/30"
              >
                <p className="font-bold">Q{i + 1}: {q.text}</p>
                <ul className="ml-4 mt-2 text-sm">
                  {q.options.map((o) => (
                    <li key={o.id}>
                      {o.id}) {o.text} {o.isCorrect && "✔"}
                    </li>
                  ))}
                </ul>

                <div className="flex gap-4 mt-3">
                  <button
                    onClick={() => navigate(`/admin/edit-question/${q._id}`)}
                    className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:scale-105 transition"
                  >
                    ✏ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSaved(q._id)}
                    className="px-4 py-2 bg-red-500 rounded-lg hover:scale-105 transition"
                  >
                    🗑 Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="text-center mt-10">
        <button
          onClick={() => navigate("/admin")}
          className="px-6 py-3 bg-white/20 rounded-xl hover:bg-white/30 font-semibold shadow-lg"
        >
          ⬅ Back to Admin
        </button>
      </div>
    </div>
  );
}
