import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { auth } = useSelector((state) => state);

  if (!auth) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
