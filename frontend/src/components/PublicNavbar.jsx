import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function PublicNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "text-pink-400 border-b-2 border-pink-400"
      : "text-white/80 hover:text-white";

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-black/30 border-b border-white/10 shadow-xl">
      <div className="max-w-7xl mx-auto px-10 py-4 flex items-center justify-between">

        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          className="text-3xl font-extrabold tracking-wide cursor-pointer select-none"
        >
          Test<span className="text-pink-400">Hub</span>
        </div>

        {/* CENTER NAV LINKS */}
        <div className="hidden md:flex items-center gap-10 text-sm font-semibold tracking-wide">
          <button
            onClick={() => navigate("/")}
            className={`pb-1 transition-all ${isActive("/")}`}
          >
            Home
          </button>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-4">
          {location.pathname !== "/login" && (
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 rounded-xl border border-white/20 text-white/90 hover:bg-white/10 transition"
            >
              Login
            </button>
          )}

          {location.pathname !== "/register" && (
            <button
              onClick={() => navigate("/register")}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-500 shadow-lg hover:scale-105 hover:brightness-110 transition-all"
            >
              Register
            </button>
          )}
        </div>

      </div>
    </nav>
  );
}
