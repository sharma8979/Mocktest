import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api.js";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();

  // ✅ SINGLE API CALL (NO extra routes)
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const { data } = await API.get("/admin/tests/all");
        setTests(data.tests || []);
      } catch (err) {
        console.error("Admin dashboard error:", err);
      }
    };
    fetchTests();
  }, []);

  /* ---------------- DERIVED STATS (NO BACKEND) ---------------- */
  const now = new Date();

  const totalTests = tests.length;
  const activeTests = tests.filter(
    t => new Date(t.startTime) <= now && new Date(t.endTime) >= now
  ).length;

  const upcomingTests = tests.filter(
    t => new Date(t.startTime) > now
  ).length;

  const endedTests = tests.filter(
    t => new Date(t.endTime) < now
  ).length;

  const publishedTests = tests.filter(t => t.published).length;

  /* ---------------- HELPERS ---------------- */
  const getStatus = (test) => {
    const start = new Date(test.startTime);
    const end = new Date(test.endTime);
    if (now < start) return "Upcoming";
    if (now > end) return "Ended";
    return "Active";
  };

  const getStatusColor = (status) => {
    if (status === "Active") return "text-green-400 bg-green-500/20";
    if (status === "Upcoming") return "text-yellow-400 bg-yellow-500/20";
    return "text-red-400 bg-red-500/20";
  };

  /* ---------------- ACTIONS ---------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this test permanently?")) return;
    try {
      await API.delete(`/admin/tests/${id}`);
      setTests(prev => prev.filter(t => t._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  const togglePublish = async (test) => {
    try {
      await API.put(`/admin/tests/${test._id}/toggle`);
      setTests(prev =>
        prev.map(t =>
          t._id === test._id ? { ...t, published: !t.published } : t
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-4 backdrop-blur-md bg-white/10 border-b border-white/20 shadow-lg sticky top-0 z-20">
        <h1 className="text-2xl font-bold">
          TestHub <span className="text-yellow-300">Admin</span>
        </h1>

        <div className="flex gap-4">
          <NavButton label="➕ Create Test" onClick={() => navigate("/admin/create-test")} />
          <NavButton label="👥 Pending Users" onClick={() => navigate("/admin/pending-users")} />
          <NavButton danger label="🚪 Logout" onClick={handleLogout} />
        </div>
      </nav>

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mt-14 px-6"
      >
        <h2 className="text-5xl font-extrabold mb-4">Admin Control Panel</h2>
        <p className="text-white/80 max-w-2xl mx-auto">
          Create, schedule, publish and manage all mock tests from one powerful dashboard.
        </p>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 px-8 mt-14 max-w-7xl mx-auto">
        <StatCard title="Total Tests" value={totalTests} icon="📚" color="text-pink-400" />
        <StatCard title="Active" value={activeTests} icon="🟢" color="text-green-400" />
        <StatCard title="Upcoming" value={upcomingTests} icon="⏳" color="text-yellow-400" />
        <StatCard title="Ended" value={endedTests} icon="🔴" color="text-red-400" />
        <StatCard title="Published" value={publishedTests} icon="📢" color="text-indigo-400" />
      </div>

      {/* TESTS */}
      <motion.div className="mt-24 px-10">
        <h3 className="text-3xl font-bold text-center mb-12">Manage Tests 📚</h3>

        {tests.length === 0 ? (
          <p className="text-center text-white/60 text-lg">No tests created yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
            {tests.map((test, index) => {
              const status = getStatus(test);

              return (
                <motion.div
                  key={test._id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 w-full max-w-sm shadow-xl hover:scale-105 transition"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xl font-semibold">{test.title}</h4>
                    <span className={`px-3 py-1 rounded-xl text-xs font-bold ${getStatusColor(status)}`}>
                      {status}
                    </span>
                  </div>

                  <p className="text-white/70 text-sm mb-4">
                    {test.description || "No description provided"}
                  </p>

                  <p className="text-sm text-white/80">⏱ {test.duration} minutes</p>
                  <p className="text-xs text-white/60 mt-1">
                    🕒 {new Date(test.startTime).toLocaleString("en-IN")}
                  </p>

                  <p className="text-xs mt-3">
                    Status:{" "}
                    <span className={test.published ? "text-green-400" : "text-red-400"}>
                      {test.published ? "Published" : "Unpublished"}
                    </span>
                  </p>

                  <div className="flex flex-wrap justify-center gap-3 mt-6">
                    <ActionButton label="➕ Add Qs" onClick={() => navigate(`/admin/add-question/${test._id}`)} />
                    <ActionButton label="📤 Upload" onClick={() => navigate(`/admin/upload-questions/${test._id}`)} />
                    <ActionButton label="🏆 Leaderboard" onClick={() => navigate(`/leaderboard/${test._id}`)} />
                    <ActionButton label={test.published ? "Unpublish" : "Publish"} onClick={() => togglePublish(test)} />
                    <ActionButton danger label="🗑 Delete" onClick={() => handleDelete(test._id)} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

const NavButton = ({ label, onClick, danger }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-xl font-semibold shadow-lg transition
      ${danger
        ? "bg-gradient-to-r from-red-500 to-rose-700"
        : "bg-gradient-to-r from-indigo-500 to-purple-600"}
      hover:scale-105`}
  >
    {label}
  </button>
);

const ActionButton = ({ label, onClick, danger }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 rounded-lg text-sm font-medium shadow-md transition
      ${danger ? "bg-red-500" : "bg-white/20"} hover:bg-white/30`}
  >
    {label}
  </button>
);

const StatCard = ({ title, value, icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="backdrop-blur-xl bg-white/10 p-6 rounded-2xl border border-white/20 shadow-xl text-center hover:scale-105 transition"
  >
    <div className="text-3xl mb-2">{icon}</div>
    <h2 className={`text-4xl font-extrabold ${color}`}>{value}</h2>
    <p className="text-white/80 mt-1 text-sm uppercase tracking-wide">{title}</p>
  </motion.div>
);
