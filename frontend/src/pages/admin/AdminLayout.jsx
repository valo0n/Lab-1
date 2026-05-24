/* AdminLayout — Sidebar + Topbar me logout dropdown te avatar-i */
import { useState, useRef, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const MENU_ITEMS = [
  {
    section: "Main menu",
    items: [
      { icon: "🏠", label: "Dashboard", path: "/admin", exact: true },
      { icon: "🛒", label: "Order Management", path: "/admin/orders" },
      { icon: "👥", label: "Customers", path: "/admin/customers" },
      { icon: "📂", label: "Categories", path: "/admin/categories" },
      { icon: "💳", label: "Transaction", path: "/admin/transactions" },
      { icon: "🏢", label: "Suppliers", path: "/admin/suppliers" },
      { icon: "🛡️", label: "Warranties", path: "/admin/warranties" },
      {
        icon: "🔧",
        label: "Service Requests",
        path: "/admin/service-requests",
      },
    ],
  },
  {
    section: "Product",
    items: [
      {
        icon: "➕",
        label: "Add Products",
        path: "/admin/products/add",
        exact: true,
      },
      {
        icon: "🖼️",
        label: "Product Media",
        path: "/admin/products/media",
        exact: true,
      },
      {
        icon: "📋",
        label: "Product List",
        path: "/admin/products",
        exact: true,
      },
      {
        icon: "💬",
        label: "Product Reviews",
        path: "/admin/products/reviews",
        exact: true,
      },
    ],
  },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const avatarMenuRef = useRef(null);

  /* Mbylle dropdown kur klikon jashte */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(e.target)) {
        setAvatarMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  const handleLogout = async () => {
    await logout();
    setAvatarMenuOpen(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-bg font-lato">
      {/* SIDEBAR */}
      <aside
        className={`bg-white border-r border-bg flex flex-col transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="p-4 border-b border-bg flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2 no-underline">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-lg flex-shrink-0">
              P
            </div>
            {sidebarOpen && (
              <div>
                <p className="font-black text-dark text-base leading-none">
                  PARADOX
                </p>
                <p className="font-black text-primary text-xs leading-none">
                  TECH
                </p>
              </div>
            )}
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-muted hover:text-primary bg-transparent border-0 cursor-pointer text-lg"
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {MENU_ITEMS.map((section) => (
            <div key={section.section} className="mb-4">
              {sidebarOpen && (
                <p className="px-4 mb-2 text-xs font-black text-muted uppercase tracking-wide">
                  {section.section}
                </p>
              )}
              <div className="space-y-0.5 px-2">
                {section.items.map((item) => {
                  const active = isActive(item);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-black transition-colors no-underline ${
                        active
                          ? "bg-primary text-white"
                          : "text-dark hover:bg-bg"
                      }`}
                      title={!sidebarOpen ? item.label : ""}
                    >
                      <span className="text-lg flex-shrink-0">{item.icon}</span>
                      {sidebarOpen && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User info poshte sidebar (vetem nese sidebar i hapur) */}
        {sidebarOpen && (
          <div className="p-3 border-t border-bg">
            <div className="bg-bg rounded-xl p-3 flex items-center gap-2">
              <div className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center font-black text-sm flex-shrink-0">
                {user?.emri_plote?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-dark text-xs truncate">
                  {user?.emri_plote || user?.user_name}
                </p>
                <p className="text-xs text-muted truncate">{user?.email}</p>
              </div>
            </div>
            <Link
              to="/"
              className="block mt-2 text-center text-xs text-primary hover:underline no-underline font-black"
            >
              🔙 Shko te dyqani
            </Link>
          </div>
        )}
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOPBAR */}
        <header className="bg-white border-b border-bg px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-black text-dark">Dashboard</h1>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="bg-bg rounded-full px-4 py-2 flex items-center gap-2 w-80">
              <span className="text-muted text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search data, users, or reports"
                className="bg-transparent outline-none text-sm flex-1 font-lato"
              />
            </div>

            {/* Notifications */}
            <button className="relative w-10 h-10 bg-bg rounded-full flex items-center justify-center cursor-pointer hover:bg-bg/70 border-0 text-lg">
              🔔
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
            </button>

            {/* ═══════ AVATAR ME DROPDOWN ═══════ */}
            <div className="relative" ref={avatarMenuRef}>
              <button
                onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-black border-0 cursor-pointer hover:bg-green-600 transition-colors"
                title="Profili"
              >
                {user?.emri_plote?.[0]?.toUpperCase() || "A"}
              </button>

              {avatarMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-hover border border-bg py-2 z-50">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-bg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-black text-lg shrink-0">
                        {user?.emri_plote?.[0]?.toUpperCase() || "A"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-dark text-sm truncate">
                          {user?.emri_plote ||
                            user?.user_name ||
                            "Administrator"}
                        </p>
                        <p className="text-xs text-muted truncate">
                          {user?.email}
                        </p>
                        {user?.roles?.length > 0 && (
                          <span className="inline-block mt-1 text-xs font-black text-primary bg-bg px-2 py-0.5 rounded-full">
                            {user.roles[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <Link
                    to="/admin"
                    onClick={() => setAvatarMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm font-black text-dark hover:bg-bg transition-colors no-underline"
                  >
                    🏠 Dashboard
                  </Link>

                  <Link
                    to="/"
                    onClick={() => setAvatarMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm font-black text-dark hover:bg-bg transition-colors no-underline"
                  >
                    🔙 Shko te Dyqani
                  </Link>

                  <hr className="my-1 border-bg" />

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2.5 text-sm font-black text-danger hover:bg-red-50 transition-colors bg-transparent border-0 cursor-pointer"
                  >
                    🚪 Dil nga Llogaria
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-bg">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
