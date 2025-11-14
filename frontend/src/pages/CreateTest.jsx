import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api.js";
import { motion } from "framer-motion";



export default function CreateTest() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30);
  const [published, setPublished] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const calculateEndTime = (start, dur) => {
    if (!start || !dur) return "";
    const startDate = new Date(start);
    const endDate = new Date(startDate.getTime() + dur * 60000);
    return endDate.toISOString().slice(0, 16);
  };

  const handleStartTimeChange = (e) => {
    const newStart = e.target.value;
    setStartTime(newStart);
    setEndTime(calculateEndTime(newStart, duration));
  };

  const handleDurationChange = (e) => {
    const newDuration = e.target.value;
    setDuration(newDuration);
    if (startTime) setEndTime(calculateEndTime(startTime, newDuration));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (new Date(startTime) <= new Date()) {
        alert("⚠️ Start time must be in the future!");
        return;
      }

      const { data } = await API.post("/admin/tests", {
        title,
        description,
        duration,
        published,
        startTime,
      });

      setMessage("✅ Test created successfully!");
      setTimeout(() => navigate(`/admin/add-question/${data.test._id}`), 1500);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to create test");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white flex items-center justify-center px-6 relative overflow-hidden">
      {/* ✨ Background blobs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 1 }}
        className="absolute w-[500px] h-[500px] bg-pink-500 rounded-full blur-3xl top-10 left-10 opacity-10"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 1 }}
        className="absolute w-[600px] h-[600px] bg-indigo-500 rounded-full blur-3xl bottom-10 right-10 opacity-10"
      />

      {/* 🧊 Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-10 w-full max-w-lg text-center"
      >
        <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
          🧾 Create New Test
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <motion.div whileFocus={{ scale: 1.02 }}>
            <input
              type="text"
              placeholder="Test Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/80 text-gray-800 placeholder-gray-500 shadow-inner focus:ring-4 focus:ring-indigo-300 outline-none transition-all duration-300"
            />
          </motion.div>

          {/* Description */}
          <motion.div whileFocus={{ scale: 1.02 }}>
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full px-4 py-3 rounded-xl bg-white/80 text-gray-800 placeholder-gray-500 shadow-inner focus:ring-4 focus:ring-indigo-300 outline-none transition-all duration-300"
            />
          </motion.div>

          {/* Duration */}
          <motion.div whileFocus={{ scale: 1.02 }}>
            <input
              type="number"
              placeholder="Duration (minutes)"
              value={duration}
              onChange={handleDurationChange}
              required
              min="1"
              className="w-full px-4 py-3 rounded-xl bg-white/80 text-gray-800 placeholder-gray-500 shadow-inner focus:ring-4 focus:ring-indigo-300 outline-none transition-all duration-300"
            />
          </motion.div>

          {/* Start Time */}
          <label className="block text-left text-sm font-semibold text-white/80">
            Start Time:
            <input
              type="datetime-local"
              value={startTime}
              onChange={handleStartTimeChange}
              required
              className="w-full mt-2 px-4 py-3 rounded-xl bg-white/80 text-gray-800 shadow-inner focus:ring-4 focus:ring-indigo-300 outline-none transition-all duration-300"
            />
          </label>

          {/* End Time */}
          <label className="block text-left text-sm font-semibold text-white/80">
            End Time:
            <input
              type="datetime-local"
              value={endTime}
              readOnly
              className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-200 text-gray-700 shadow-inner cursor-not-allowed"
            />
          </label>

          {/* Publish Toggle */}
          <div className="flex items-center justify-start gap-2 text-white/90">
            <input
              type="checkbox"
              checked={published}
              onChange={() => setPublished(!published)}
              className="w-4 h-4 accent-pink-500"
            />
            <span>Publish immediately</span>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 0px 25px rgba(147, 51, 234, 0.6)",
            }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 mt-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-xl text-white font-semibold shadow-lg hover:brightness-110 transition-all duration-500"
          >
            Create Test
          </motion.button>
        </form>

        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-5 font-semibold ${
              message.includes("✅") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
