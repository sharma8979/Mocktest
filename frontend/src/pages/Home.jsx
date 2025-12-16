import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PublicNavbar from "../components/PublicNavbar.jsx";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 text-white overflow-hidden relative">

      {/* NAVBAR */}
      <PublicNavbar />

      {/* HERO SECTION */}
      <div className="relative z-10 flex flex-col justify-center items-center text-center px-6 pt-36 pb-24">

        {/* MAIN HEADING */}
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-7xl font-extrabold drop-shadow-xl"
        >
          Welcome to <span className="text-yellow-300">TestHub</span>
        </motion.h1>

        {/* SUB HEADING */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-xl md:text-2xl text-white/90 max-w-3xl leading-relaxed"
        >
          A modern online examination platform designed to help students
          <span className="text-yellow-200 font-semibold"> practice smarter</span>,
          <span className="text-yellow-200 font-semibold"> compete fairly</span>,
          and
          <span className="text-yellow-200 font-semibold"> track real progress</span>
          — all in one powerful dashboard.
        </motion.p>

        {/* FEATURES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl"
        >
          <Feature
            title="📝 Timed Mock Tests"
            desc="Attempt real exam-like tests with start & end time control, auto submission, and instant evaluation."
          />
          <Feature
            title="📊 Performance Analytics"
            desc="View detailed scores, rankings, and insights to understand your strengths and improve weaknesses."
          />
          <Feature
            title="🏆 Live Leaderboards"
            desc="Compete with other candidates in real time and see where you stand on the leaderboard."
          />
        </motion.div>

        {/* CTA BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-16 flex flex-col sm:flex-row gap-6"
        >
          <button
            onClick={() => navigate("/register")}
            className="px-10 py-4 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-600 text-black text-lg font-semibold shadow-xl hover:scale-105 transition-all"
          >
            🚀 Get Started Free
          </button>

          <button
            onClick={() => navigate("/login")}
            className="px-10 py-4 rounded-2xl bg-white/20 backdrop-blur-lg text-lg font-semibold shadow-xl hover:bg-white/30 transition-all"
          >
            🔐 Login to Your Account
          </button>
        </motion.div>

        {/* TRUST LINE */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mt-10 text-white/70 text-sm"
        >
          Trusted platform for secure online assessments and competitive preparation
        </motion.p>
      </div>

      {/* BACKGROUND BLOBS */}
      <motion.div className="absolute w-[500px] h-[500px] bg-white rounded-full blur-3xl opacity-10 top-10 left-10" />
      <motion.div className="absolute w-[600px] h-[600px] bg-pink-400 rounded-full blur-3xl opacity-10 bottom-10 right-10" />
    </div>
  );
}

/* FEATURE CARD */
function Feature({ title, desc }) {
  return (
    <div className="backdrop-blur-xl bg-white/15 border border-white/20 rounded-2xl p-6 shadow-xl hover:scale-105 transition-all">
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-white/85 leading-relaxed">{desc}</p>
    </div>
  );
}

