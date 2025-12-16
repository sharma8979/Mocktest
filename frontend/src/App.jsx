import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import CreateTest from "./pages/CreateTest.jsx";
import AddQuestion from "./pages/AddQuestion.jsx";
import TestAttempt from "./pages/TestAttempt.jsx";
import Leaderboard from "./pages/LeaderBoard.jsx";
import UploadQuestions from "./pages/UploadQuestions.jsx";
import PendingUsers from "./pages/PendingUsers.jsx";
import Home from "./pages/Home.jsx";

import { useAuth } from "./context/AuthContext.jsx";
import "./index.css";

function PrivateRoute({ children, role }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (role && user.role?.toLowerCase() !== role.toLowerCase()) {
    return <Navigate to="/" />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ USER DASHBOARD (FIX) */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute role="user">
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* USER TEST */}
        <Route
          path="/attempt/:id"
          element={
            <PrivateRoute role="user">
              <TestAttempt />
            </PrivateRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/create-test"
          element={
            <PrivateRoute role="admin">
              <CreateTest />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/add-question/:id"
          element={
            <PrivateRoute role="admin">
              <AddQuestion />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/upload-questions/:id"
          element={
            <PrivateRoute role="admin">
              <UploadQuestions />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/pending-users"
          element={
            <PrivateRoute role="admin">
              <PendingUsers />
            </PrivateRoute>
          }
        />

        <Route
          path="/leaderboard/:id"
          element={
            <PrivateRoute>
              <Leaderboard />
            </PrivateRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
