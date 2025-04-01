import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { auth } = useSelector((state) => state);

  if (!auth.token) {
    // Changed from `if (!auth)` to check specifically for token
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
