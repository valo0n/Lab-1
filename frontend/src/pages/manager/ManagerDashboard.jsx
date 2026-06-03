/* Manager Dashboard - mban statistika dhe inventari */
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, getDashboardStats } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

export default function ManagerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [statsData, prodData, supData] = await Promise.all([
          getDashboardStats().catch(() => null),
          api.get("/products").catch(() => []),
          api.get("/suppliers").catch(() => []),
        ]);
        setStats(statsData);
        setProducts(prodData);
        setSuppliers(supData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const lowStock = products.filter((p) => p.sasia_stokut < 10 && p.aktiv);
  const outOfStock = products.filter((p) => p.sasia_stokut === 0 && p.aktiv);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-bg font-lato">
      <header className="bg-white border-b border-bg px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black">
            P
          </div>
          <div>
            <p className="font-black text-dark">PARADOX TECH</p>
            <p className="text-xs text-muted">📊 Manager Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-black text-dark text-sm">{user?.emri_plote}</p>
            <p className="text-xs text-muted">{user?.email}</p>
          </div>
          <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-black">
            {user?.emri_plote?.[0]?.toUpperCase() || "M"}
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-50 hover:bg-red-100 text-danger font-black text-sm px-4 py-2 rounded-xl border-0 cursor-pointer"
          >
            🚪 Dil
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-5">
        <div className="bg-gradient-to-r from-primary to-green-600 text-white rounded-2xl p-6">
          <h1 className="text-2xl font-black mb-1">
            Mirë se erdhët, {user?.emri_plote}! 👋
          </h1>
          <p className="text-sm opacity-90">
            Mbikqyrni inventarin, furnitorët dhe statistikat e dyqanit.
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-10 text-center text-muted shadow-card">
            Duke ngarkuar...
          </div>
        ) : (
          <>
            {/* Stats nga API */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 shadow-card">
                  <p className="font-black text-dark text-sm">Total Revenue</p>
                  <p className="text-2xl font-black text-primary mt-2">
                    €{stats.revenue?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-card">
                  <p className="font-black text-dark text-sm">Total Porosi</p>
                  <p className="text-2xl font-black text-dark mt-2">
                    {stats.totalOrders || 0}
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-card">
                  <p className="font-black text-dark text-sm">
                    Produkte Aktive
                  </p>
                  <p className="text-2xl font-black text-blue-600 mt-2">
                    {stats.totalProducts || products.length}
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-card">
                  <p className="font-black text-dark text-sm">Klientë</p>
                  <p className="text-2xl font-black text-warning mt-2">
                    {stats.totalCustomers || 0}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Low stock */}
              <div className="bg-white rounded-2xl p-5 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-dark text-lg">
                    ⚠️ Stok i Ulët
                  </h3>
                  <span className="text-xs font-black bg-warning/10 text-warning px-3 py-1 rounded-full">
                    {lowStock.length} produkte
                  </span>
                </div>
                {lowStock.length === 0 ? (
                  <p className="text-muted text-sm text-center py-5">
                    Asnjë produkt me stok të ulët ✓
                  </p>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {lowStock.slice(0, 10).map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between bg-bg rounded-xl p-3"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-dark text-sm truncate">
                            {p.emertimi}
                          </p>
                          <p className="text-xs text-muted">{p.marka}</p>
                        </div>
                        <span
                          className={`font-black text-sm px-3 py-1 rounded-lg ${
                            p.sasia_stokut === 0
                              ? "bg-red-100 text-danger"
                              : "bg-warning/20 text-warning"
                          }`}
                        >
                          {p.sasia_stokut} njësi
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Suppliers */}
              <div className="bg-white rounded-2xl p-5 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-dark text-lg">
                    🏢 Furnitorët
                  </h3>
                  <span className="text-xs font-black bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {suppliers.length} furnitorë
                  </span>
                </div>
                {suppliers.length === 0 ? (
                  <p className="text-muted text-sm text-center py-5">
                    Asnjë furnitor
                  </p>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {suppliers.slice(0, 10).map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center gap-3 bg-bg rounded-xl p-3"
                      >
                        <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-black">
                          {s.emertimi[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-dark text-sm truncate">
                            {s.emertimi}
                          </p>
                          <p className="text-xs text-muted truncate">
                            {s.email || s.telefoni}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Read-only info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
              <p className="text-sm text-dark">
                💡 <strong>Roli i Manager-it:</strong> ti mund të shohësh
                statistikat, inventarin dhe furnitorët. Për të bërë ndryshime te
                produktet ose porositë, kontakto adminin.
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
