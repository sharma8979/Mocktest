import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api.js";
import { motion } from "framer-motion";

export default function CreateTest() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30);
  const [published, setPublished] = useState(false);

  // ⭐ Indian format values
  const [date, setDate] = useState("");      // DD-MM-YYYY
  const [time, setTime] = useState("");      // HH:MM AM/PM
  const [endTime, setEndTime] = useState(""); // formatted IN

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Convert DD-MM-YYYY + 12-hour time → JS Date
  const parseIndianDateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return null;

    const [day, month, year] = dateStr.split("-").map(Number);
    let [timePart, modifier] = timeStr.split(" "); // Example: "05:30 PM"
    let [hours, minutes] = timePart.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return new Date(year, month - 1, day, hours, minutes, 0);
  };

  // Convert JS Date → Indian readable
  const formatIndianDateTime = (date) => {
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Calculate end time
  const updateEndTime = (newDate, newTime, dur) => {
    const start = parseIndianDateTime(newDate, newTime);
    if (!start) return "";

    const end = new Date(start.getTime() + Number(dur) * 60000);
    return formatIndianDateTime(end);
  };

  const handleDateChange = (e) => {
    const val = e.target.value;
    setDate(val);
    setEndTime(updateEndTime(val, time, duration));
  };

  const handleTimeChange = (e) => {
    const val = e.target.value;
    setTime(val);
    setEndTime(updateEndTime(date, val, duration));
  };

  const handleDurationChange = (e) => {
    const dur = e.target.value;
    setDuration(dur);
    setEndTime(updateEndTime(date, time, dur));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const startDate = parseIndianDateTime(date, time);
    if (!startDate) {
      setMessage("⚠ Invalid date or time");
      return;
    }

    if (startDate <= new Date()) {
      setMessage("⚠ Start time must be in the future");
      return;
    }

    try {
      const { data } = await API.post("/admin/tests", {
        title,
        description,
        duration,
        published,
        startTime: startDate.toISOString(), // backend gets clean timestamp
      });

      setMessage("✅ Test created successfully!");
      setTimeout(() => navigate(`/admin/add-question/${data.test._id}`), 1200);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to create test");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white flex items-center justify-center px-6 relative overflow-hidden">
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-10 w-full max-w-lg shadow-xl"
      >
        <h2 className="text-4xl font-bold text-center mb-6 text-pink-300">
          🧾 Create Test (India Format)
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          <input
            type="text"
            placeholder="Test Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-white/80 text-black"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/80 text-black"
          />

          <input
            type="number"
            value={duration}
            onChange={handleDurationChange}
            placeholder="Duration (mins)"
            className="w-full p-3 rounded-lg bg-white/80 text-black"
            min="1"
          />

          {/* DATE INPUT (DD-MM-YYYY) */}
          <input
            type="text"
            placeholder="Date (DD-MM-YYYY)"
            value={date}
            onChange={handleDateChange}
            className="w-full p-3 rounded-lg bg-white/80 text-black"
          />

          {/* TIME INPUT (HH:MM AM/PM) */}
          <input
            type="text"
            placeholder="Time (HH:MM AM/PM)"
            value={time}
            onChange={handleTimeChange}
            className="w-full p-3 rounded-lg bg-white/80 text-black"
          />

          {/* END TIME DISPLAY */}
          <p className="text-lg font-semibold text-green-300">
            End Time: {endTime || "---"}
          </p>

          <button className="w-full py-3 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-xl shadow-lg text-lg font-bold">
            Create Test
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 font-bold text-yellow-300">{message}</p>
        )}
      </motion.div>
    </div>
  );
}
