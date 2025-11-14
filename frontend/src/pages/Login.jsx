import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../utils/api.js";
import { motion } from "framer-motion";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", { email, password });
      login(data.user, data.token);
      if (data.user.role === "admin") navigate("/admin");
      else navigate("/");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      {/* ✨ Animated background blobs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
        className="absolute w-[500px] h-[500px] bg-white rounded-full blur-3xl opacity-10 top-10 left-10"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
        className="absolute w-[600px] h-[600px] bg-blue-400 rounded-full blur-3xl opacity-10 bottom-10 right-10"
      />

      {/* 🧊 Glassmorphic card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 backdrop-blur-lg bg-white/20 border border-white/30 shadow-2xl rounded-3xl p-10 w-full max-w-md text-center"
      >
        <h2 className="text-4xl font-extrabold text-white drop-shadow-md mb-8">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div whileFocus={{ scale: 1.02 }}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/80 text-gray-800 placeholder-gray-500 shadow-inner focus:ring-4 focus:ring-indigo-300 focus:outline-none transition-all duration-300"
            />
          </motion.div>

          <motion.div whileFocus={{ scale: 1.02 }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/80 text-gray-800 placeholder-gray-500 shadow-inner focus:ring-4 focus:ring-indigo-300 focus:outline-none transition-all duration-300"
            />
          </motion.div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(147, 51, 234, 0.6)" }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold shadow-lg transition-all duration-500 hover:brightness-110"
          >
            Sign In
          </motion.button>
        </form>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-200 mt-4 text-sm font-medium"
          >
            {error}
          </motion.p>
        )}

        {/* Optional footer */}
        <p className="text-white/80 text-sm mt-8">
          New here?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-pink-200 font-semibold hover:underline cursor-pointer"
          >
            Create an account
          </span>
        </p>
      </motion.div>
    </div>
  );
}
