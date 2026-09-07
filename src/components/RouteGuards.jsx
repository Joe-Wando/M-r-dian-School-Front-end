import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "./ui/Spinner";

export function RequireAuth({ children }) {
  const { isAuthenticated, ready } = useAuth();
  const location = useLocation();
  if (!ready) return <Spinner />;
  if (!isAuthenticated) {
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }
  return children;
}

export function RequireAdmin({ children }) {
  const { isAuthenticated, isAdmin, ready } = useAuth();
  const location = useLocation();
  if (!ready) return <Spinner />;
  if (!isAuthenticated) {
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
}
