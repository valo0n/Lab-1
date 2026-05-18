/* Header — top navbar plotesisht funksional */
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useSearch } from "../../context/SearchContext";
import { useAuth } from "../../context/AuthContext";
import { getCategories } from "../../lib/api";
const NAV_LINKS = [
  { label: "Ballina", path: "/" },
  { label: "Smartphones", cat: "Smartphones" },
  { label: "Laptops", cat: "Laptops" },
  { label: "TV & Monitor", cat: "TV & Monitor" },
  { label: "Audio", cat: "Audio" },
  { label: "Gaming", cat: "Gaming" },
  { label: "Tablets", cat: "Tablets" },
  { label: "Wearables", cat: "Wearables" },
  { label: "Cameras", cat: "Cameras" },
  { label: "Smart Home", cat: "Smart Home" },
];

export default function Header() {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { setSearchQuery, setSelectedCategory } = useSearch();
  const { user, logout, isAdmin } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const [categories, setCategories] = useState([]);

  const catMenuRef = useRef(null);
  const userMenuRef = useRef(null);

  /* Mbyll dropdown-et kur klikon jashte */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (catMenuRef.current && !catMenuRef.current.contains(e.target)) {
        setCatMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* Ngarko kategorit nga DB */
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err) => console.error("Header categories error:", err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!localSearch.trim()) return;
    setSearchQuery(localSearch);
    setSelectedCategory("");
    navigate(`/shop?q=${encodeURIComponent(localSearch)}`);
  };

  const handleNavClick = (link) => {
    if (link.path) {
      navigate(link.path);
    } else if (link.cat) {
      setSelectedCategory(link.cat);
      setSearchQuery("");
      navigate(`/shop?cat=${encodeURIComponent(link.cat)}`);
    }
    setMenuOpen(false);
  };

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat.emertimi);
    setSearchQuery("");
    navigate(`/shop?cat=${encodeURIComponent(cat.emertimi)}`);
    setCatMenuOpen(false);
  };

  /* Logout */
  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate("/");
  };

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
            {user ? (
              <span className="font-black">
                Mirë se erdhët, {user.emri_plote || user.user_name}!
              </span>
            ) : (
              <Link to="/login" className="font-black hover:underline">
                Kyçu / Regjistrohu
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Main navbar ── */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 shrink-0">
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

          {/* Kategorite dropdown */}
          <div className="relative hidden md:block" ref={catMenuRef}>
            <button
              onClick={() => setCatMenuOpen(!catMenuOpen)}
              className="flex items-center gap-2 bg-primary text-white font-black text-sm px-4 py-2.5 rounded-xl shrink-0 border-0 cursor-pointer hover:bg-green-600 transition-colors"
            >
              ☰ Kategorite
            </button>
            {catMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-hover border border-bg py-2 z-50">
                {categories.length === 0 ? (
                  <p className="px-4 py-2 text-sm text-muted">
                    Duke ngarkuar...
                  </p>
                ) : (
                  categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleCategoryClick(c)}
                      className="w-full text-left px-4 py-2 text-sm font-black text-dark hover:bg-bg transition-colors bg-transparent border-0 cursor-pointer flex items-center gap-3"
                    >
                      <span className="text-lg">{c.ikona || "📦"}</span>
                      {c.emertimi}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex flex-1">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Kërko produkte elektronike..."
              className="flex-1 px-4 py-2.5 border border-primary border-r-0 rounded-l-xl text-sm outline-none font-lato"
            />
            <button
              type="submit"
              className="bg-primary text-white font-black text-sm px-5 py-2.5 rounded-r-xl shrink-0 border-0 cursor-pointer hover:bg-green-600 transition-colors"
            >
              🔍
            </button>
          </form>

          {/* Action icons */}
          <div className="flex items-center gap-1 shrink-0">
            <Link
              to="/wishlist"
              className="hidden sm:flex flex-col items-center p-2 text-gray-500 hover:text-primary transition-colors relative"
            >
              <span className="text-xl">🤍</span>
              <span className="text-xs">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-danger text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black">
                  {wishlistCount}
                </span>
              )}
            </Link>

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

            {/* Account dropdown — me logout */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex flex-col items-center p-2 text-gray-500 hover:text-primary transition-colors bg-transparent border-0 cursor-pointer"
              >
                <span className="text-xl">{user ? "👨" : "👤"}</span>
                <span className="hidden sm:block text-xs">
                  {user ? "Profili" : "Kyçu"}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-hover border border-bg py-2 z-50">
                  {user ? (
                    <>
                      {/* User info ne krye */}
                      <div className="px-4 py-2 border-b border-bg mb-1">
                        <p className="font-black text-dark text-sm truncate">
                          {user.emri_plote || user.user_name}
                        </p>
                        <p className="text-xs text-muted truncate">
                          {user.email}
                        </p>
                        {user.roles?.length > 0 && (
                          <span className="inline-block mt-1 text-xs font-black text-primary bg-bg px-2 py-0.5 rounded-full">
                            {user.roles[0]}
                          </span>
                        )}
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-sm font-black text-primary hover:bg-bg transition-colors"
                        >
                          ⚙️ Admin Panel
                        </Link>
                      )}

                      <Link
                        to="/wishlist"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm font-black text-dark hover:bg-bg transition-colors"
                      >
                        🤍 Lista e Favoriteve
                      </Link>
                      <Link
                        to="/cart"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm font-black text-dark hover:bg-bg transition-colors"
                      >
                        🛒 Shporta
                      </Link>

                      <hr className="my-1 border-bg" />

                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm font-black text-danger hover:bg-red-50 transition-colors bg-transparent border-0 cursor-pointer"
                      >
                        🚪 Dil
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm font-black text-dark hover:bg-bg transition-colors"
                      >
                        🔑 Kyçu
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm font-black text-dark hover:bg-bg transition-colors"
                      >
                        ✍️ Regjistrohu
                      </Link>
                      <hr className="my-1 border-bg" />
                      <Link
                        to="/wishlist"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm font-black text-dark hover:bg-bg transition-colors"
                      >
                        🤍 Lista e Favoriteve
                      </Link>
                      <Link
                        to="/cart"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm font-black text-dark hover:bg-bg transition-colors"
                      >
                        🛒 Shporta
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

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
                key={link.label}
                onClick={() => handleNavClick(link)}
                className={`px-3 py-2 text-sm font-black whitespace-nowrap border-0 cursor-pointer transition-colors bg-transparent
                  ${
                    i === 0
                      ? "text-primary border-b-2 border-primary"
                      : "text-dark hover:text-primary border-b-2 border-transparent hover:border-primary"
                  }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-bg px-4 py-2 space-y-0.5 bg-white">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link)}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-black text-dark hover:bg-bg transition-colors bg-transparent border-0 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <hr className="border-bg" />
            <Link
              to="/wishlist"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-black text-dark hover:bg-bg transition-colors"
            >
              🤍 Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
