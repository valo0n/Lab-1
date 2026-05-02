/* Login page — versionin e plote me JWT do ta lidhesh me backend me vone */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    /* TODO: lidh me backend kur te kesh API auth te gatshme */
    alert(`Login te lidhet me backend!\nEmail: ${email}`);
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-10 font-lato">
      <div className="bg-white rounded-2xl shadow-card w-full max-w-md p-8">
        {/* Logo lart */}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-black text-dark mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="email@example.com"
              className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-black text-dark mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-green-600 text-white font-black py-3 rounded-xl transition-colors"
          >
            Kyçu
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Nuk ke llogari?{" "}
          <Link to="/register" className="text-primary font-black hover:underline">
            Regjistrohu
          </Link>
        </p>

        <button
          onClick={() => navigate("/")}
          className="block mx-auto mt-4 text-xs text-muted hover:text-primary transition-colors bg-transparent border-0 cursor-pointer"
        >
          ← Kthehu ne ballina
        </button>
      </div>
    </div>
  );
}
