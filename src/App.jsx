import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ViewReport from "./pages/ViewReport";
import Loader from "./components/Loader";

function App() {
  const { user, role, loading } = useContext(AuthContext);

  if (loading) return <Loader/>;

  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route
          path="/"
          element={!user ? <Login /> : <Navigate to="/dashboard" />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            user ? (
              role === "admin" ? (
                <AdminDashboard />
              ) : (
                <Dashboard />
              )
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* ADMIN ONLY PAGE */}
        <Route
          path="/report/:id"
          element={
            user && role === "admin" ? (
              <ViewReport />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
