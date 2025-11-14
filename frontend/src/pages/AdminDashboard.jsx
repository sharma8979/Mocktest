import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api.js";
import { motion } from "framer-motion";


export default function AdminDashboard() {
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const { data } = await API.get("/tests");
        setTests(data.tests || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTests();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden">
      {/* 🧭 Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 backdrop-blur-md bg-white/10 border-b border-white/20 shadow-lg sticky top-0 z-20">
        <h1 className="text-2xl font-bold text-white drop-shadow-md">
          Admin Dashboard 👑
        </h1>
        <button
          onClick={() => navigate("/admin/create-test")}
          className="bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-indigo-500 hover:to-pink-500 px-5 py-2 rounded-xl font-semibold shadow-lg transition-all duration-300"
        >
          ➕ Create Test
        </button>
      </nav>

      {/* 🧊 Stats section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-8 mt-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-xl bg-white/10 p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl transition-all"
        >
          <h2 className="text-4xl font-extrabold text-pink-400">{tests.length}</h2>
          <p className="text-white/80 mt-1 font-medium">Total Tests</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-xl bg-white/10 p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl transition-all"
        >
          <h2 className="text-4xl font-extrabold text-indigo-400">---</h2>
          <p className="text-white/80 mt-1 font-medium">Total Users</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl bg-white/10 p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl transition-all"
        >
          <h2 className="text-4xl font-extrabold text-green-400">---</h2>
          <p className="text-white/80 mt-1 font-medium">Attempts Recorded</p>
        </motion.div>
      </div>

      {/* 🧩 Tests list section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="mt-14 px-10"
      >
        <h3 className="text-3xl font-bold mb-6 text-center drop-shadow-md">
          Existing Tests 📚
        </h3>

        {tests.length === 0 ? (
          <p className="text-center text-white/70 text-lg">
            No tests available yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {tests.map((test, index) => (
              <motion.div
                key={test._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 w-full max-w-sm shadow-lg hover:shadow-2xl transition-all hover:scale-105"
              >
                <h3 className="text-2xl font-semibold text-white mb-2">
                  {test.title}
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  {test.description || "No description provided"}
                </p>
                <p className="text-white/80 text-sm mb-6">
                  ⏱ Duration: {test.duration} mins
                </p>

                <div className="flex flex-wrap justify-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/admin/add-question/${test._id}`)}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-medium shadow-md hover:brightness-110 transition-all"
                  >
                    ➕ Add Question
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/admin/upload-questions/${test._id}`)}
                    className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl font-medium shadow-md hover:brightness-110 transition-all"
                  >
                    📤 Upload
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/leaderboard/${test._id}`)}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl font-medium shadow-md hover:brightness-110 transition-all"
                  >
                    🏆 Leaderboard
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
      {/* ✨ Background Glow Blobs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1 }}
        className="absolute w-[500px] h-[500px] bg-pink-500 rounded-full blur-3xl opacity-10 top-10 left-10"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1 }}
        className="absolute w-[600px] h-[600px] bg-indigo-500 rounded-full blur-3xl opacity-10 bottom-10 right-10"
      />
    </div>
  );
}
