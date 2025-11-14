import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import CreateTest from "./pages/CreateTest.jsx";
import AddQuestion from "./pages/AddQuestion.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import TestAttempt from "./pages/TestAttempt.jsx";
import Leaderboard from "./pages/LeaderBoard.jsx"
import UploadQuestions from "./pages/UploadQuestions.jsx";
import "./index.css";





function PrivateRoute({ children, role }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  // Make role case-insensitive and optional
  if (role && user.role?.toLowerCase() !== role.toLowerCase()) {
    console.warn(`Redirected: Expected ${role}, got ${user.role}`);
    return <Navigate to="/" />;
  }

  return children;
}


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
  path="/admin/upload-questions/:id"
  element={
    <PrivateRoute role="admin">
      <UploadQuestions />
    </PrivateRoute>
  }
/>

        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
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

        <Route
          path="/admin/create-test"
          element={
            <PrivateRoute role="admin">
              <CreateTest />
            </PrivateRoute>
          }
        />
       

<Route
  path="/attempt/:id"
  element={
    <PrivateRoute role="user">
      <TestAttempt />
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
      </Routes>
    </BrowserRouter>
  );
}
