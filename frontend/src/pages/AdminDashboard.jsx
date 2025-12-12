import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api.js";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [tests, setTests] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  const navigate = useNavigate();

  // Fetch ALL tests + user count
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const testsRes = await API.get("/admin/tests/all");
        setTests(testsRes.data.tests || []);

        const usersRes = await API.get("/admin/user-count");
        setTotalUsers(usersRes.data.count || 0);

      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, []);

  // STATUS LOGIC
  const getStatus = (test) => {
    const now = new Date();
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

  // DELETE TEST
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return;
    try {
      await API.delete(`/admin/tests/${id}`);
      setTests((prev) => prev.filter((t) => t._id !== id));
      alert("Test deleted successfully.");
    } catch (err) {
      alert("Delete failed");
      console.error(err);
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // PUBLISH / UNPUBLISH
  const togglePublish = async (test) => {
    try {
      await API.put(`/admin/tests/${test._id}/toggle`);
      setTests((prev) =>
        prev.map((t) =>
          t._id === test._id ? { ...t, published: !t.published } : t
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 backdrop-blur-md bg-white/10 border-b border-white/20 shadow-lg sticky top-0 z-20">
        <h1 className="text-2xl font-bold text-white drop-shadow-md">
          Admin Dashboard 👑
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/admin/create-test")}
            className="bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-indigo-500 hover:to-pink-500 px-5 py-2 rounded-xl font-semibold shadow-lg transition-all"
          >
            ➕ Create Test
          </button>

          <button
            onClick={() => navigate("/admin/pending-users")}
            className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-red-500 rounded-xl shadow-lg"
          >
            👥 Pending User Requests
          </button>

          {/* LOGOUT BUTTON */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-700 rounded-xl shadow-lg hover:scale-105 transition-all"
          >
            🚪 Logout
          </button>
        </div>
      </nav>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-8 mt-10 text-center">
        <StatCard title="Total Users" value={totalUsers} color="text-indigo-400" />
        <StatCard title="Total Tests" value={tests.length} color="text-pink-400" />
      </div>

      {/* Tests List */}
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
          <p className="text-center text-white/70 text-lg">No tests available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {tests.map((test, index) => {
              const status = getStatus(test);

              return (
                <motion.div
                  key={test._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 w-full max-w-sm shadow-lg hover:scale-105 transition-all"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-2xl font-semibold">{test.title}</h3>
                    <span className={`px-3 py-1 rounded-xl text-xs font-bold ${getStatusColor(status)}`}>
                      {status}
                    </span>
                  </div>

                  <p className="text-white/70 text-sm mb-4">
                    {test.description || "No description provided"}
                  </p>

                  <p className="text-white/80 text-sm mb-1">
                    ⏱ Duration: {test.duration} mins
                  </p>
                  <p className="text-white/60 text-xs">🕒 Start: {new Date(test.startTime).toLocaleString()}</p>
                  <p className="text-white/60 text-xs mb-4">⏳ End: {new Date(test.endTime).toLocaleString()}</p>

                  {/* Publish Status */}
                  <p className="text-white/70 text-xs mb-4">
                    📢 Status:{" "}
                    <span className={test.published ? "text-green-400" : "text-red-400"}>
                      {test.published ? "Published" : "Unpublished"}
                    </span>
                  </p>

                  {/* Buttons */}
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button label="➕ Add Qs" color="green" onClick={() => navigate(`/admin/add-question/${test._id}`)} />
                    <Button label="📤 Upload" color="yellow" onClick={() => navigate(`/admin/upload-questions/${test._id}`)} />
                    <Button label="🏆 Leaderboard" color="indigo" onClick={() => navigate(`/leaderboard/${test._id}`)} />
                    <Button label={test.published ? "Unpublish" : "Publish"} color="purple" onClick={() => togglePublish(test)} />
                    <Button label="🗑 Delete" color="red" onClick={() => handleDelete(test._id)} />
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

/* Reusable Components */
const Button = ({ label, color, onClick }) => {
  const colors = {
    green: "from-green-500 to-emerald-600",
    yellow: "from-yellow-500 to-orange-500",
    indigo: "from-indigo-500 to-purple-600",
    red: "from-red-500 to-rose-600",
    purple: "from-purple-500 to-indigo-600",
  };
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-4 py-2 bg-gradient-to-r ${colors[color]} rounded-xl font-medium shadow-md hover:brightness-110 transition-all`}
    >
      {label}
    </motion.button>
  );
};

const StatCard = ({ title, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="backdrop-blur-xl bg-white/10 p-6 rounded-2xl border border-white/20 shadow-lg"
  >
    <h2 className={`text-4xl font-extrabold ${color}`}>{value}</h2>
    <p className="text-white/80 mt-1 font-medium">{title}</p>
  </motion.div>
);
