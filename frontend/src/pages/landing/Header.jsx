/* Header — top navbar me React Router dhe Cart badge */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const NAV_LINKS = [
  "Ballina",
  "Smartphones",
  "Laptops",
  "TV & Monitor",
  "Audio",
  "Gaming",
  "Tablets",
  "Wearables",
  "Cameras",
  "Smart Home",
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { cartCount } = useCart();

  return (
    <header className="font-lato">
      {/* ── Top info bar ── */}
      <div className="bg-dark text-white px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-1">
          <div className="flex gap-4 text-xs opacity-80">
            <span>📍 Prishtinë, Kosovë</span>
            <span className="hidden sm:inline">📞 +383 44 123 456</span>
          </div>

          <div className="flex items-center gap-3 text-xs opacity-80">
            <span className="hidden sm:inline">🚚 Dorëzim Falas mbi €100</span>
            <span className="hidden sm:inline text-white/30">|</span>
            <span className="hidden sm:inline">🔒 Blerje e Sigurt</span>
            <span className="text-white/30">|</span>
            <Link to="/login" className="font-black hover:underline">
              Kyçu / Regjistrohu
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main navbar ── */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-black text-lg">
              P
            </div>
            <div className="hidden sm:block text-left">
              <p className="font-black text-dark text-base leading-none">
                PARADOX
              </p>
              <p className="font-black text-primary text-xs leading-none">
                TECH
              </p>
            </div>
          </Link>

          <button className="hidden md:flex items-center gap-2 bg-primary text-white font-black text-sm px-4 py-2.5 rounded-xl flex-shrink-0 border-0 cursor-pointer">
            ☰ Kategorite
          </button>

          {/* Search bar */}
          <div className="flex flex-1">
            <input
              type="text"
              placeholder="Kërko produkte elektronike..."
              className="flex-1 px-4 py-2.5 border border-primary border-r-0 rounded-l-xl text-sm outline-none font-lato"
            />
            <button className="bg-primary text-white font-black text-sm px-5 py-2.5 rounded-r-xl flex-shrink-0 border-0 cursor-pointer hover:bg-green-600 transition-colors">
              🔍
            </button>
          </div>

          {/* Action icons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button className="hidden sm:flex flex-col items-center p-2 text-gray-500 hover:text-primary transition-colors bg-transparent border-0 cursor-pointer">
              <span className="text-xl">🤍</span>
              <span className="text-xs">Wishlist</span>
            </button>

            {/* Cart — me link dhe badge real */}
            <Link
              to="/cart"
              className="relative flex flex-col items-center p-2 text-gray-500 hover:text-primary transition-colors"
            >
              <span className="text-xl">🛒</span>
              <span className="hidden sm:block text-xs">Shporta</span>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-danger text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <Link
              to="/login"
              className="flex flex-col items-center p-2 text-gray-500 hover:text-primary transition-colors"
            >
              <span className="text-xl">👤</span>
              <span className="hidden sm:block text-xs">Kyçu</span>
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-xl bg-transparent border-0 cursor-pointer"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:block border-t border-bg">
          <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto">
            {NAV_LINKS.map((link, i) => (
              <button
                key={link}
                onClick={() => navigate("/")}
                className={`px-3 py-2 text-sm font-black whitespace-nowrap border-0 cursor-pointer transition-colors bg-transparent
                  ${
                    i === 0
                      ? "text-primary border-b-2 border-primary"
                      : "text-dark hover:text-primary border-b-2 border-transparent hover:border-primary"
                  }`}
              >
                {link}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-bg px-4 py-2 space-y-0.5">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => {
                  navigate("/");
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-black text-dark hover:bg-bg transition-colors bg-transparent border-0 cursor-pointer"
              >
                {link}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
