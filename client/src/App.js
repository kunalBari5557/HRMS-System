import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import "./index.css";
import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Dashboard from "./components/pages/Dashboard/Dashboard";
import Settings from "./components/pages/Settings";
import Profile from "./components/pages/Profile";
import { ThemeProvider } from "./helper/ThemeProvider";

const App = () => {
  const { auth } = useSelector((state) => state);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={auth.token ? <Navigate to="/dashboard" replace /> : <Login />} 
          />
          <Route 
            path="/signup" 
            element={auth.token ? <Navigate to="/dashboard" replace /> : <Signup />} 
          />

          {/* Protected Routes with Layout wrapping all authenticated pages */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;

