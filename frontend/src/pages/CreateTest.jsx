import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api.js";
import { motion } from "framer-motion";

export default function CreateTest() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30);
  const [published, setPublished] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startTime) {
      setMessage("⚠ Please select a start time");
      return;
    }

    const start = new Date(startTime);
    const now = new Date();

    if (start <= now) {
      setMessage("⚠ Start time must be in the future");
      return;
    }

    try {
      const { data } = await API.post("/admin/tests", {
        title,
        description,
        duration,
        published,
        startTime: start.toISOString(),
      });

      setMessage("✅ Test created successfully!");

      setTimeout(() => {
        navigate(`/admin/add-question/${data.test._id}`);
      }, 1200);

    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to create test");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white flex items-center justify-center px-6 relative overflow-hidden">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/admin")}
        className="absolute top-6 left-6 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-lg border border-white/30 shadow-lg transition font-medium"
      >
        ⬅ Back to Dashboard
      </button>

      {/* FORM CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-10 w-full max-w-lg shadow-2xl"
      >
        <h2 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
          🧾 Create New Test
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          <input
            type="text"
            placeholder="Test Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/80 text-gray-800 shadow-inner focus:ring-4 focus:ring-indigo-300 outline-none"
          />

          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="w-full px-4 py-3 rounded-xl bg-white/80 text-gray-800 shadow-inner focus:ring-4 focus:ring-indigo-300 outline-none"
          />

          <input
            type="number"
            placeholder="Duration (minutes)"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            min="1"
            required
            className="w-full px-4 py-3 rounded-xl bg-white/80 text-gray-800 shadow-inner focus:ring-4 focus:ring-indigo-300 outline-none"
          />

          <label className="block text-sm font-semibold text-white/80">
            Start Time:
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="w-full mt-2 px-4 py-3 rounded-xl bg-white/80 text-gray-800 shadow-inner focus:ring-4 focus:ring-indigo-300 outline-none"
            />
          </label>

          <div className="flex items-center gap-2 text-white/90">
            <input
              type="checkbox"
              checked={published}
              onChange={() => setPublished(!published)}
              className="w-4 h-4 accent-pink-500"
            />
            <span>Publish immediately</span>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-xl text-white font-semibold shadow-lg"
          >
            Create Test
          </motion.button>
        </form>

        {message && (
          <p
            className={`mt-5 text-center font-semibold ${
              message.includes("✅") ? "text-green-400" : "text-yellow-300"
            }`}
          >
            {message}
          </p>
        )}
      </motion.div>
    </div>
  );
}
