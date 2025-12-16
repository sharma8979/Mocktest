import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api.js";
import { motion } from "framer-motion";
import PublicNavbar from "../components/PublicNavbar.jsx";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await API.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-600 text-white">

      {/* NAVBAR */}
      <PublicNavbar />

      {/* BACKGROUND BLOBS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        className="absolute w-[500px] h-[500px] bg-white rounded-full blur-3xl top-10 left-10"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        className="absolute w-[600px] h-[600px] bg-indigo-400 rounded-full blur-3xl bottom-10 right-10"
      />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col lg:flex-row justify-center items-center gap-16 px-6 pt-32">

        {/* LEFT INFO SECTION */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-lg text-center lg:text-left"
        >
          <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg">
            Join <span className="text-yellow-300">TestHub</span>
          </h1>

          <p className="text-lg text-white/90 leading-relaxed mb-8">
            Create your account to access high-quality mock tests, track your
            performance, and compete with others in real-time leaderboards.
          </p>

          <ul className="space-y-4 text-white/85">
            <li>📝 Practice curated mock tests</li>
            <li>📊 Analyze results & rankings</li>
            <li>🔒 Admin-verified secure access</li>
          </ul>

          <p className="mt-6 text-sm text-white/70">
            ⚠️ Note: New user accounts require admin approval before login.
          </p>
        </motion.div>

        {/* RIGHT REGISTER CARD */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl rounded-3xl p-10 w-full max-w-md"
        >
          <h2 className="text-3xl font-extrabold text-center mb-6 drop-shadow">
            Create Account ✨
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/90 text-gray-800 placeholder-gray-500 shadow-inner focus:ring-4 focus:ring-pink-300 outline-none transition"
            />

            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/90 text-gray-800 placeholder-gray-500 shadow-inner focus:ring-4 focus:ring-pink-300 outline-none transition"
            />

            <input
              type="password"
              placeholder="Create Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/90 text-gray-800 placeholder-gray-500 shadow-inner focus:ring-4 focus:ring-pink-300 outline-none transition"
            />

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold shadow-lg hover:brightness-110 transition"
            >
              🚀 Register
            </motion.button>
          </form>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-300 mt-4 text-sm text-center font-medium"
            >
              {error}
            </motion.p>
          )}

          <p className="text-white/80 text-sm mt-8 text-center">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-yellow-200 font-semibold hover:underline cursor-pointer"
            >
              Log in
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
