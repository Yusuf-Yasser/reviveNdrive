import React from "react";
import { Navigate } from "react-router-dom";
import AdminLogin from "../pages/Auth/AdminLogin";
import Dashboard from "../pages/Admin/Dashboard";

// Admin route protection component
const AdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin");

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export const adminRoutes = [
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin/dashboard",
    element: (
      <AdminRoute>
        <Dashboard />
      </AdminRoute>
    ),
  },
];
