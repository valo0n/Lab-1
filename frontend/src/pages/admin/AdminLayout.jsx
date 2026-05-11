/* AdminLayout — layout-i komplet me sidebar dhe topbar */
import { useState } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const MAIN_MENU = [
  { label: "Dashboard", icon: "🏠", path: "/admin" },
  { label: "Order Management", icon: "🛒", path: "/admin/orders" },
  { label: "Customers", icon: "👥", path: "/admin/customers" },
  { label: "Coupon Code", icon: "🎟️", path: "/admin/coupons" },
  { label: "Categories", icon: "📂", path: "/admin/categories" },
  { label: "Transaction", icon: "💳", path: "/admin/transactions" },
  { label: "Brand", icon: "⭐", path: "/admin/brands" },
];

const PRODUCT_MENU = [
  { label: "Add Products", icon: "➕", path: "/admin/products/add" },
  { label: "Product Media", icon: "🖼️", path: "/admin/products/media" },
  { label: "Product List", icon: "📋", path: "/admin/products" },
  { label: "Product Reviews", icon: "💬", path: "/admin/products/reviews" },
];

const ADMIN_MENU = [
  { label: "Admin role", icon: "👤", path: "/admin/roles" },
  { label: "Control Authority", icon: "⚙️", path: "/admin/control" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  /* Komponent ndihmes per nje item te menuse */
  const MenuItem = ({ item }) => {
    const isActive = location.pathname === item.path;
    return (
      <Link
        to={item.path}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-black transition-colors ${
          isActive ? "bg-primary text-white" : "text-dark hover:bg-bg"
        }`}
      >
        <span className="text-lg">{item.icon}</span>
        {sidebarOpen && <span>{item.label}</span>}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-bg flex font-lato">
      {/* ── SIDEBAR ── */}
      <aside
        className={`bg-white border-r border-bg flex flex-col transition-all ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Logo + toggle */}
        <div className="p-4 flex items-center justify-between border-b border-bg">
          {sidebarOpen ? (
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-black">
                P
              </div>
              <div>
                <p className="font-black text-dark text-sm leading-none">PARADOX</p>
                <p className="font-black text-primary text-[10px] leading-none">TECH</p>
              </div>
            </Link>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-black mx-auto">
              P
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-muted hover:text-primary bg-transparent border-0 cursor-pointer text-xl"
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {sidebarOpen && (
            <p className="text-xs text-muted px-4 py-2 font-black">Main menu</p>
          )}
          {MAIN_MENU.map((item) => (
            <MenuItem key={item.path} item={item} />
          ))}

          {sidebarOpen && (
            <p className="text-xs text-muted px-4 py-2 font-black mt-4">Product</p>
          )}
          {PRODUCT_MENU.map((item) => (
            <MenuItem key={item.path} item={item} />
          ))}

          {sidebarOpen && (
            <p className="text-xs text-muted px-4 py-2 font-black mt-4">Admin</p>
          )}
          {ADMIN_MENU.map((item) => (
            <MenuItem key={item.path} item={item} />
          ))}
        </nav>

        {/* User info + logout */}
        <div className="p-3 border-t border-bg">
          {sidebarOpen ? (
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-black">
                {user?.name?.[0] || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-dark text-sm truncate">{user?.name}</p>
                <p className="text-xs text-muted truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                title="Dil"
                className="text-muted hover:text-danger bg-transparent border-0 cursor-pointer text-lg"
              >
                🚪
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              title="Dil"
              className="w-full flex justify-center p-2 text-muted hover:text-danger bg-transparent border-0 cursor-pointer text-xl"
            >
              🚪
            </button>
          )}

          {sidebarOpen && (
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2 text-sm font-black text-primary hover:bg-bg rounded-xl"
            >
              🛍️ Shko te dyqani
            </Link>
          )}
        </div>
      </aside>

      {/* ── MAIN AREA ── */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white border-b border-bg px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-black text-dark">Dashboard</h1>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden md:flex bg-bg rounded-xl px-4 py-2 items-center gap-2 w-80">
              <span className="text-muted">🔍</span>
              <input
                type="text"
                placeholder="Search data, users, or reports"
                className="bg-transparent outline-none text-sm flex-1 font-lato"
              />
            </div>

            {/* Notifications */}
            <button className="relative w-10 h-10 rounded-full bg-bg flex items-center justify-center hover:bg-light border-0 cursor-pointer transition-colors">
              <span className="text-lg">🔔</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
            </button>

            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-black">
              {user?.name?.[0] || "A"}
            </div>
          </div>
        </header>

        {/* Content area — ketu shfaqen faqet brenda admin-it */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
