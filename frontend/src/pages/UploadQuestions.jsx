import React from "react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api.js";
import { motion } from "framer-motion";



export default function UploadQuestions() {
  const { id: testId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file first");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await API.post(`/admin/tests/${testId}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(`✅ Uploaded ${data.count} questions successfully!`);
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed. Check file format or backend.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center p-6 text-white relative overflow-hidden">

      {/* Floating Glow Circles */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        className="absolute top-10 left-10 w-[400px] h-[400px] rounded-full bg-white blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        className="absolute bottom-10 right-10 w-[450px] h-[450px] rounded-full bg-pink-300 blur-3xl"
      />

      {/* Card Container */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-lg backdrop-blur-xl bg-white/20 p-10 rounded-3xl shadow-2xl border border-white/30 text-center"
      >
        <h2 className="text-4xl font-extrabold text-white drop-shadow-lg mb-6">
          📤 Upload Questions
        </h2>

        <p className="text-white/80 mb-6">
          Upload questions in <strong>.json</strong> or <strong>.csv</strong> format.
        </p>

        <form onSubmit={handleUpload} className="space-y-6">
          <input
            type="file"
            accept=".json,.csv"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full p-3 rounded-xl bg-white/20 border border-white/30 shadow-lg cursor-pointer hover:bg-white/30 transition"
          />

          <motion.button
            type="submit"
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 0px 25px rgba(255,255,255,0.6)",
            }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-xl text-white font-semibold shadow-xl hover:brightness-110 transition-all"
          >
            🚀 Upload File
          </motion.button>
        </form>

        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-5 text-lg font-medium text-yellow-200"
          >
            {message}
          </motion.p>
        )}

        <motion.button
          onClick={() => navigate("/admin")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl shadow-lg font-semibold transition"
        >
          ⬅ Back to Admin Dashboard
        </motion.button>
      </motion.div>
    </div>
  );
}
