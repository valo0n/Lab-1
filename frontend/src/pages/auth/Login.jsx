/* Login me redirect sipas role */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);

    setLoading(false);

    /* login() kthen { success, user } ose { success:false, message } */
    if (!result.success) {
      setError(result.message || "Email ose password i gabuar");
      return;
    }

    /* Redirect sipas rolit */
    const roles = result.user?.roles || [];

    if (roles.includes("Admin")) {
      navigate("/admin");
    } else if (roles.includes("Manager")) {
      navigate("/manager");
    } else if (roles.includes("Teknik")) {
      navigate("/teknik");
    } else if (roles.includes("Shites")) {
      navigate("/shites");
    } else {
      /* Klient ose role tjeter */
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 font-lato">
      <div className="bg-white rounded-2xl shadow-card p-8 w-full max-w-md">
        <div className="flex items-center gap-2 justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xl">
            P
          </div>
          <div>
            <p className="font-black text-dark text-lg leading-none">PARADOX</p>
            <p className="font-black text-primary text-xs leading-none">TECH</p>
          </div>
        </div>

        <h1 className="text-2xl font-black text-dark text-center mb-2">
          Mirë se erdhët!
        </h1>
        <p className="text-sm text-muted text-center mb-6">
          Kyçu te llogaria juaj
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-danger px-4 py-3 rounded-xl mb-4 text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-black text-dark mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-black text-dark mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-green-600 text-white font-black py-3 rounded-xl border-0 cursor-pointer disabled:opacity-50 transition-colors"
          >
            {loading ? "Duke u kyçur..." : "Kyçu"}
          </button>
        </form>

        <p className="text-sm text-muted text-center mt-5">
          Nuk ke llogari?{" "}
          <Link
            to="/register"
            className="text-primary font-black hover:underline no-underline"
          >
            Regjistrohu
          </Link>
        </p>

        <Link
          to="/"
          className="block text-center text-xs text-muted hover:text-primary mt-3 no-underline"
        >
          ← Kthehu te ballina
        </Link>

        {/* Test credentials */}
        <div className="mt-6 pt-5 border-t border-bg">
          <p className="text-xs font-black text-muted mb-2">
            🔑 Test Credentials:
          </p>
          <div className="bg-bg rounded-xl p-3 text-xs space-y-1 font-mono">
            <p>
              <span className="font-black">Admin:</span> admin@paradox.com /
              Loni1234
            </p>
            <p>
              <span className="font-black">Manager:</span> manager@paradox.com /
              Loni1234
            </p>
            <p>
              <span className="font-black">Teknik:</span> teknik@paradox.com /
              Loni1234
            </p>
            <p>
              <span className="font-black">Shites:</span> shites@paradox.com /
              Loni1234
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
