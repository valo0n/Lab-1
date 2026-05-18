/* Register page — krijo llogari te re */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    emri_plote: "",
    telefoni: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    /* Validim baze */
    if (formData.password !== formData.confirmPassword) {
      setError("Passwordat nuk perputhen!");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password duhet te kete te pakten 6 karaktere!");
      return;
    }

    setLoading(true);

    /* Regjistro */
    const result = await register({
      user_name: formData.user_name,
      email: formData.email,
      password: formData.password,
      emri_plote: formData.emri_plote,
      telefoni: formData.telefoni,
    });

    if (result.success) {
      /* Pas regjistrimit, bej login automatik */
      const loginResult = await login(formData.email, formData.password);
      setLoading(false);
      if (loginResult.success) {
        navigate("/");
      } else {
        navigate("/login");
      }
    } else {
      setError(result.message);
      setLoading(false);
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

        <h1 className="text-2xl font-black text-dark text-center mb-2">
          Regjistrohu
        </h1>
        <p className="text-sm text-muted text-center mb-6">
          Krijo nje llogari te re
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-danger px-4 py-2 rounded-xl text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-black text-dark mb-1">
              Emri i plote
            </label>
            <input
              type="text"
              name="emri_plote"
              value={formData.emri_plote}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Valon Krasniqi"
              className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-black text-dark mb-1">
              Username
            </label>
            <input
              type="text"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="valon123"
              className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-black text-dark mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="email@example.com"
              className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-black text-dark mb-1">
              Telefon (opsional)
            </label>
            <input
              type="tel"
              name="telefoni"
              value={formData.telefoni}
              onChange={handleChange}
              disabled={loading}
              placeholder="+383 44 123 456"
              className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-black text-dark mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Min. 6 karaktere"
              className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-black text-dark mb-1">
              Konfirmo Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Shkruaj prap passwordin"
              className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-green-600 text-white font-black py-3 rounded-xl transition-colors border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Duke u regjistruar..." : "Regjistrohu"}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Ke nje llogari?{" "}
          <Link to="/login" className="text-primary font-black hover:underline">
            Kyçu
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
