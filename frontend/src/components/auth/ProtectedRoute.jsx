/* ProtectedRoute — bllokon faqet admin nese nuk je i loguar */
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();

  /* Prit derisa AuthContext te ngarkohet nga localStorage */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted">Duke ngarkuar...</p>
      </div>
    );
  }

  /* Nese nuk je loguar ose nuk je admin, ridrejto te login */
  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
