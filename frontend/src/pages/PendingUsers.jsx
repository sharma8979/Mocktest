import React, { useEffect, useState } from "react";
import API from "../utils/api.js";
import { motion } from "framer-motion";

export default function PendingUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div className="flex items-center justify-center min-h-screen text-white text-xl">
        Loading pending users...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 p-10 text-white">
      <h2 className="text-4xl font-bold mb-8 text-center drop-shadow-lg">
        Pending User Requests 👥
      </h2>

      {users.length === 0 ? (
        <p className="text-center text-xl text-white/80">
          No pending user requests.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {users.map((u) => (
            <motion.div
              key={u._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 p-6 rounded-2xl backdrop-blur-xl border border-white/20 shadow-xl"
            >
              <p className="text-xl font-semibold">{u.name}</p>
              <p className="text-white/70">{u.email}</p>

              <div className="flex gap-4 mt-5">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={async () => {
                    await API.put(`/admin/approve-user/${u._id}`);
                    setUsers(users.filter((x) => x._id !== u._id));
                  }}
                  className="px-4 py-2 bg-green-500 rounded-xl font-semibold shadow-lg"
                >
                  Approve ✔
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={async () => {
                    await API.put(`/admin/reject-user/${u._id}`);
                    setUsers(users.filter((x) => x._id !== u._id));
                  }}
                  className="px-4 py-2 bg-red-500 rounded-xl font-semibold shadow-lg"
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
