import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const { data } = await API.get("/tests");
        setTests(data.tests || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-xl">
        Please{" "}
        <span
          onClick={() => navigate("/login")}
          className="underline cursor-pointer text-yellow-300 px-2"
        >
          login
        </span>{" "}
        to continue.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-xl animate-pulse">
        Loading available tests...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 text-white relative overflow-hidden">

      {/* 🌐 NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-4 backdrop-blur-lg bg-white/10 shadow-md sticky top-0 z-20">
        <div>
          <h1 className="text-2xl font-bold drop-shadow">
            Welcome, <span className="text-yellow-300">{user.name}</span>
          </h1>
          <p className="text-sm text-white/70">
            Ready to test your knowledge?
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition shadow-lg font-medium"
        >
          Logout
        </button>
      </nav>

      {/* 🎯 HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mt-14"
      >
        <h2 className="text-4xl font-extrabold drop-shadow-lg">
          Available Tests 📘
        </h2>
        <p className="text-white/85 mt-3 text-lg">
          Choose a test, attempt it, and track your progress.
        </p>
      </motion.div>

      {/* 🧩 TEST CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-10 py-16 justify-items-center">
        {tests.length === 0 ? (
          <p className="text-white/80 text-lg">
            No tests are available right now.
          </p>
        ) : (
          tests.map((test, index) => (
            <motion.div
              key={test._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-xl rounded-2xl p-6 w-full max-w-sm hover:shadow-2xl transition-all duration-500 hover:scale-105"
            >
              <h3 className="text-2xl font-semibold mb-2">
                {test.title}
              </h3>

              <p className="text-white/80 text-sm mb-4">
                {test.description || "No description provided."}
              </p>

              <div className="flex justify-between text-sm text-white/70 mb-6">
                <span>⏱ {test.duration} mins</span>
                <span>📄 MCQ</span>
              </div>

              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 0px 20px rgba(236,72,153,0.6)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/attempt/${test._id}`)}
                className="w-full py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-xl font-semibold shadow-lg hover:brightness-110 transition"
              >
                🚀 Start Test
              </motion.button>
            </motion.div>
          ))
        )}
      </div>

      {/* ✨ BACKGROUND DECOR */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        className="absolute w-[500px] h-[500px] bg-white rounded-full blur-3xl top-10 left-10"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        className="absolute w-[600px] h-[600px] bg-pink-400 rounded-full blur-3xl bottom-10 right-10"
      />
    </div>
  );
}
