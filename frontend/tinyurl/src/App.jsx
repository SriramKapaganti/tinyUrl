import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import Dashboard from "./pages/Dashboard";
import Stats from "./pages/stats";
import LoginForm from "./pages/login";
import UserlinksSheet from "./pages/userLinks";
import ProtectedRoute from "./components/protectedRoute";
import SignupForm from "./pages/signup";
function App() {
  return (
    <div style={{ width: "100wh", height: "100vh", padding: "0px" }}>
      <main className="container">
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginForm />} />
          <Route exact path="/signup" element={<SignupForm />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/links"
            element={
              <ProtectedRoute>
                <UserlinksSheet />
              </ProtectedRoute>
            }
          />

          <Route
            path="/code/:code"
            element={
              <ProtectedRoute>
                <Stats />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="container">TinyLink • simple URL shortener</div>
      </footer>
    </div>
  );
}

export default App;
