import React from "react";
import { useEffect, useState } from "react";
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

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xl">
        Please <a href="/login" className="underline text-pink-300 px-2"> log in </a> to continue.
      </div>
    );

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xl animate-pulse">
        Loading tests...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white relative overflow-hidden">
      {/* 🧭 Top Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 backdrop-blur-lg bg-white/10 shadow-md sticky top-0 z-20">
        <h1 className="text-2xl font-bold drop-shadow-md">
          Hi, <span className="text-pink-200">{user.name}</span> 👋
        </h1>
        <button
          onClick={handleLogout}
          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl transition duration-300 font-medium shadow-lg"
        >
          Logout
        </button>
      </nav>

      {/* 🧊 Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mt-12"
      >
        <h2 className="text-4xl font-extrabold drop-shadow-lg">Available Tests 📘</h2>
        <p className="text-white/80 mt-2 text-lg">
          Choose a test and start whenever you’re ready.
        </p>
      </motion.div>

      {/* 🧩 Test Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-10 py-16 justify-items-center">
        {tests.length === 0 ? (
          <p className="text-white/70 text-lg">No tests available yet.</p>
        ) : (
          tests.map((test, index) => (
            <motion.div
              key={test._id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-xl rounded-2xl p-6 w-full max-w-sm text-center hover:shadow-2xl transition-all duration-500 hover:scale-105"
            >
              <h3 className="text-2xl font-semibold text-white mb-2">
                {test.title}
              </h3>
              <p className="text-white/80 mb-4">{test.description}</p>
              <p className="text-sm text-white/70 mb-6">
                ⏱ Duration: {test.duration} mins
              </p>
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 0px 20px rgba(236, 72, 153, 0.6)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
  console.log("START TEST CLICKED, ID =", test._id);
  navigate(`/attempt/${test._id}`);
}}

                className="w-full py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-xl text-white font-semibold shadow-lg hover:brightness-110 transition-all duration-300"
              >
                Start Test
              </motion.button>
            </motion.div> 
          ))
        )}
      </div>

      {/* Decorative floating background circles */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 1 }}
        className="absolute w-[500px] h-[500px] bg-white rounded-full blur-3xl opacity-10 top-10 left-10"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 1 }}
        className="absolute w-[600px] h-[600px] bg-pink-400 rounded-full blur-3xl opacity-10 bottom-10 right-10"
      />
    </div>
  );
}
