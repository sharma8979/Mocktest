import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PublicNavbar from "../components/PublicNavbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../utils/api.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await API.post("/auth/login", { email, password });

      // save auth state
      login(data.user, data.token);

      // 🔥 FIXED ROLE BASED REDIRECT
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setError(err.response.data.message);
      } else {
        setError(err.response?.data?.message || "Invalid credentials");
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 text-white overflow-hidden">

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
        className="absolute w-[600px] h-[600px] bg-pink-400 rounded-full blur-3xl bottom-10 right-10"
      />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-20 px-6 pt-36">

        {/* LEFT INFO */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-lg text-center lg:text-left"
        >
          <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg">
            Login to <span className="text-yellow-300">TestHub</span>
          </h1>

          <p className="text-lg text-white/90 leading-relaxed mb-8">
            Access your mock tests, track your progress, and compete on
            leaderboards with confidence.
          </p>

          <ul className="space-y-3 text-white/85">
            <li>✅ Secure authentication</li>
            <li>✅ Real-time test access</li>
            <li>✅ Admin-approved system</li>
          </ul>
        </motion.div>

        {/* LOGIN CARD */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl rounded-3xl p-10 w-full max-w-md"
        >
          <h2 className="text-3xl font-extrabold text-center mb-6">
            Welcome Back 👋
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/90 text-gray-800 placeholder-gray-500 shadow-inner focus:ring-4 focus:ring-indigo-300 outline-none"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/90 text-gray-800 placeholder-gray-500 shadow-inner focus:ring-4 focus:ring-indigo-300 outline-none"
            />

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 font-semibold shadow-lg hover:brightness-110 transition"
            >
              🔐 Login
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
            New to TestHub?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-yellow-200 font-semibold hover:underline cursor-pointer"
            >
              Create an account
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
