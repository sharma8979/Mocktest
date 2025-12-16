import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api.js";
import { motion } from "framer-motion";

export default function PendingUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const { data } = await API.get("/admin/pending-users");
        setUsers(data.users || []);
      } catch (err) {
        console.error("Error loading users:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white text-xl">
        Loading pending users...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 p-10 text-white relative overflow-hidden">

      {/* 🔙 BACK BUTTON */}
      <button
        onClick={() => navigate("/admin")}
        className="absolute top-6 left-6 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-lg border border-white/30 shadow-lg transition font-medium"
      >
        ⬅ Back to Dashboard
      </button>

      {/* 🌈 BACKGROUND BLOBS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 1 }}
        className="absolute w-[450px] h-[450px] bg-pink-500 rounded-full blur-3xl top-10 left-10 opacity-10"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 1 }}
        className="absolute w-[600px] h-[600px] bg-indigo-500 rounded-full blur-3xl bottom-10 right-10 opacity-10"
      />

      {/* 🧾 HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center mb-10"
      >
        <h2 className="text-4xl font-extrabold drop-shadow-lg">
          Pending User Requests 👥
        </h2>
        <p className="text-white/80 mt-3 text-lg max-w-2xl mx-auto">
          Review and manage newly registered users.  
          Approve eligible candidates or reject invalid registrations.
        </p>
      </motion.div>

      {/* 📊 STATS */}
      <div className="relative z-10 flex justify-center mb-10">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-10 py-6 shadow-lg">
          <p className="text-sm text-white/70">Total Pending Requests</p>
          <h3 className="text-4xl font-bold text-yellow-400 text-center">
            {users.length}
          </h3>
        </div>
      </div>

      {/* 🧩 USERS LIST */}
      {users.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 text-center text-xl text-white/80 mt-20"
        >
          🎉 No pending user requests at the moment.
        </motion.p>
      ) : (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {users.map((u, index) => (
            <motion.div
              key={u._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 p-6 rounded-2xl backdrop-blur-xl border border-white/20 shadow-xl hover:scale-105 transition-all"
            >
              <h3 className="text-2xl font-semibold mb-1">{u.name}</h3>
              <p className="text-white/70 mb-4">{u.email}</p>

              <div className="flex gap-4 mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={async () => {
                    await API.put(`/admin/approve-user/${u._id}`);
                    setUsers(users.filter((x) => x._id !== u._id));
                  }}
                  className="flex-1 px-4 py-2 bg-green-500 rounded-xl font-semibold shadow-lg"
                >
                  Approve ✔
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={async () => {
                    await API.put(`/admin/reject-user/${u._id}`);
                    setUsers(users.filter((x) => x._id !== u._id));
                  }}
                  className="flex-1 px-4 py-2 bg-red-500 rounded-xl font-semibold shadow-lg"
                >
                  Reject ✖
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
