/* ProtectedRoute — bllokon faqet sipas rolit te kerkuar */
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-primary flex items-center justify-center text-white font-black text-2xl animate-pulse">
            P
          </div>
          <p className="text-muted font-black">Duke ngarkuar...</p>
        </div>
      </div>
    );
  }

  /* Nese nuk je loguar, ridrejto te login */
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const userRoles = user.roles || [];
    const hasRequiredRole = userRoles.includes(requiredRole);

    if (!hasRequiredRole) {
      /* Ridrejto te dashboard-i i tij */
      if (userRoles.includes("Admin")) return <Navigate to="/admin" replace />;
      if (userRoles.includes("Manager"))
        return <Navigate to="/manager" replace />;
      if (userRoles.includes("Teknik"))
        return <Navigate to="/teknik" replace />;
      if (userRoles.includes("Shites"))
        return <Navigate to="/shites" replace />;
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
