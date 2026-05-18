/* Login page — me API reale */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      /* Nese eshte admin -> dashboard admin; perndryshe -> ballina */
      if (result.user.roles?.includes("Admin")) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-10 font-lato">
      <div className="bg-white rounded-2xl shadow-card w-full max-w-md p-8">
        <Link to="/" className="flex items-center justify-center gap-2 mb-6">
          <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xl">
            P
          </div>
          <div>
            <p className="font-black text-dark">PARADOX</p>
            <p className="font-black text-xs text-primary">TECH</p>
          </div>
        </Link>

        <h1 className="text-2xl font-black text-dark text-center mb-2">Kyçu</h1>
        <p className="text-sm text-muted text-center mb-6">
          Hyr ne llogarine tende per te vazhduar
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-danger px-4 py-2 rounded-xl text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-black text-dark mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter your email"
              className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-black text-dark mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter your password"
              className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-green-600 text-white font-black py-3 rounded-xl transition-colors border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Duke u kyçur..." : "Kyçu"}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Nuk ke llogari?{" "}
          <Link
            to="/register"
            className="text-primary font-black hover:underline"
          >
            Regjistrohu
          </Link>
        </p>

        <Link
          to="/"
          className="block text-center mt-4 text-xs text-muted hover:text-primary transition-colors"
        >
          ← Kthehu ne ballina
        </Link>
      </div>
    </div>
  );
}
