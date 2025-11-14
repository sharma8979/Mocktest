import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api.js";
import { motion } from "framer-motion";



export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500">
      {/* ✨ Animated blurred blobs for depth */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 1 }}
        className="absolute w-[500px] h-[500px] bg-white rounded-full blur-3xl top-10 left-10 opacity-10"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 1 }}
        className="absolute w-[600px] h-[600px] bg-indigo-400 rounded-full blur-3xl bottom-10 right-10 opacity-10"
      />

      {/* 🧊 Glass-style registration card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 backdrop-blur-lg bg-white/20 border border-white/30 shadow-2xl rounded-3xl p-10 w-full max-w-md text-center"
      >
        <h2 className="text-4xl font-extrabold text-white drop-shadow-md mb-8">
          Create Account ✨
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name field */}
          <motion.div whileFocus={{ scale: 1.02 }}>
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/80 text-gray-800 placeholder-gray-500 shadow-inner focus:ring-4 focus:ring-pink-300 focus:outline-none transition-all duration-300"
            />
          </motion.div>

          {/* Email field */}
          <motion.div whileFocus={{ scale: 1.02 }}>
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/80 text-gray-800 placeholder-gray-500 shadow-inner focus:ring-4 focus:ring-pink-300 focus:outline-none transition-all duration-300"
            />
          </motion.div>

          {/* Password field */}
          <motion.div whileFocus={{ scale: 1.02 }}>
            <input
              type="password"
              placeholder="Create Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/80 text-gray-800 placeholder-gray-500 shadow-inner focus:ring-4 focus:ring-pink-300 focus:outline-none transition-all duration-300"
            />
          </motion.div>

          {/* Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(236, 72, 153, 0.6)" }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold shadow-lg transition-all duration-500 hover:brightness-110"
          >
            Register
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

        {/* Footer link */}
        <p className="text-white/80 text-sm mt-8">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-indigo-200 font-semibold hover:underline cursor-pointer"
          >
            Log in
          </span>
        </p>
      </motion.div>
    </div>
  );
}
