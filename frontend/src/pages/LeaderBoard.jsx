import React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api.js";
import { motion } from "framer-motion";


export default function Leaderboard() {
  const { id: testId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await API.get(`/attempts/leaderboard/${testId}`);
        setLeaderboard(data.leaderboard || []);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      }
    };
    fetchLeaderboard();
  }, [testId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 text-white">
      
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center text-5xl font-extrabold drop-shadow-lg mb-10"
      >
        🏆 Leaderboard
      </motion.h2>

      {/* If no data */}
      {leaderboard.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xl font-medium text-white/80 mt-20"
        >
          No submissions yet for this test.
        </motion.p>
      )}

      {/* Leaderboard Table */}
      {leaderboard.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="overflow-x-auto max-w-4xl mx-auto backdrop-blur-xl bg-white/20 shadow-xl border border-white/30 rounded-2xl"
        >
          <table className="w-full text-white">
            <thead>
              <tr className="bg-white/20">
                <th className="py-4 px-6 text-left font-semibold">Rank</th>
                <th className="py-4 px-6 text-left font-semibold">Name</th>
                <th className="py-4 px-6 text-left font-semibold">Score</th>
                <th className="py-4 px-6 text-left font-semibold">Finished</th>
              </tr>
            </thead>

            <tbody>
              {leaderboard.map((user, index) => (
                <motion.tr
                  key={user.rank}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-white/10 transition"
                >
                  <td className="py-4 px-6 font-bold text-lg">{user.rank}</td>
                  <td className="py-4 px-6">{user.name}</td>
                  <td className="py-4 px-6 font-semibold">{user.totalMarks}</td>
                  <td className="py-4 px-6">
                    {new Date(user.finishedAt).toLocaleString("en-IN")}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Back Button */}
      <div className="text-center mt-12">
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(255,255,255,0.4)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-white/20 text-white rounded-xl font-semibold shadow-xl backdrop-blur-lg hover:bg-white/30 transition"
        >
          ⬅ Back to Dashboard
        </motion.button>
      </div>

      {/* Decorative glowing circles */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        className="absolute top-10 left-10 w-[400px] h-[400px] rounded-full bg-white blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        className="absolute bottom-10 right-10 w-[450px] h-[450px] rounded-full bg-pink-400 blur-3xl"
      />
    </div>
  );
}
