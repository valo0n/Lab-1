/* Shites Dashboard - menaxhon porositë dhe klientët */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

const STATUS_LABELS = {
  pending: {
    label: "Në Pritje",
    color: "bg-yellow-100 text-yellow-700",
    icon: "⏳",
  },
  processing: {
    label: "Duke u Procesuar",
    color: "bg-blue-100 text-blue-700",
    icon: "🔄",
  },
  shipped: {
    label: "Dërguar",
    color: "bg-purple-100 text-purple-700",
    icon: "🚚",
  },
  completed: {
    label: "Përfunduar",
    color: "bg-green-100 text-green-700",
    icon: "✓",
  },
  canceled: { label: "Anuluar", color: "bg-red-100 text-red-700", icon: "✗" },
};

export default function ShitesDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await api.get("/orders");
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = orders.filter((o) => {
    if (filter === "all") return true;
    return o.statusi_porosis === filter;
  });

  const todayRevenue = orders
    .filter((o) => o.statusi_porosis === "completed")
    .reduce((sum, o) => sum + parseFloat(o.shuma_totale), 0);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, {
        statusi_porosis: newStatus,
      });
      fetchOrders();
    } catch (err) {
      alert(`Gabim: ${err.data?.error || err.message}`);
    }
  };

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
            <p className="text-xs text-muted">🛒 Shites Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-black text-dark text-sm">{user?.emri_plote}</p>
            <p className="text-xs text-muted">{user?.email}</p>
          </div>
          <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-black">
            {user?.emri_plote?.[0]?.toUpperCase() || "S"}
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
            Menaxhoni porositë dhe ndihmoni klientët në procesin e blerjes.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-card">
            <p className="font-black text-dark text-sm">Total Porosi</p>
            <p className="text-2xl font-black text-dark mt-2">
              {orders.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-card">
            <p className="font-black text-dark text-sm">Të Përfunduara</p>
            <p className="text-2xl font-black text-primary mt-2">
              {orders.filter((o) => o.statusi_porosis === "completed").length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-card">
            <p className="font-black text-dark text-sm">Në Pritje</p>
            <p className="text-2xl font-black text-warning mt-2">
              {orders.filter((o) => o.statusi_porosis === "pending").length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-card">
            <p className="font-black text-dark text-sm">Shitje Totale</p>
            <p className="text-2xl font-black text-primary mt-2">
              €{todayRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-xs font-black border-0 cursor-pointer transition-colors ${
              filter === "all"
                ? "bg-primary text-white"
                : "bg-white text-dark hover:bg-bg"
            }`}
          >
            Të gjitha ({orders.length})
          </button>
          {Object.entries(STATUS_LABELS).map(([key, s]) => {
            const count = orders.filter(
              (o) => o.statusi_porosis === key,
            ).length;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-full text-xs font-black border-0 cursor-pointer transition-colors ${
                  filter === key
                    ? "bg-primary text-white"
                    : "bg-white text-dark hover:bg-bg"
                }`}
              >
                {s.icon} {s.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Orders */}
        {loading ? (
          <div className="bg-white rounded-2xl p-10 text-center text-muted shadow-card">
            Duke ngarkuar...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-card">
            <p className="text-5xl mb-3">📦</p>
            <p className="font-black text-dark">Asnjë porosi</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-bg">
                  <tr className="text-left text-xs text-muted">
                    <th className="px-4 py-3 font-black">#ID</th>
                    <th className="px-4 py-3 font-black">Klienti</th>
                    <th className="px-4 py-3 font-black">Data</th>
                    <th className="px-4 py-3 font-black">Totali</th>
                    <th className="px-4 py-3 font-black">Pagesa</th>
                    <th className="px-4 py-3 font-black">Statusi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o) => (
                    <tr
                      key={o.id}
                      className="border-t border-bg hover:bg-bg/30"
                    >
                      <td className="px-4 py-3 text-sm font-black text-dark">
                        #ORD{o.id.toString().padStart(6, "0")}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <p className="font-black text-dark">
                          {o.customers?.emri} {o.customers?.mbiemri}
                        </p>
                        <p className="text-xs text-muted">
                          {o.customers?.email}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted">
                        {new Date(o.data_porosis).toLocaleDateString("sq-AL")}
                      </td>
                      <td className="px-4 py-3 text-sm font-black text-primary">
                        €{parseFloat(o.shuma_totale).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-dark capitalize">
                        {o.metoda_pageses}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={o.statusi_porosis}
                          onChange={(e) =>
                            handleStatusChange(o.id, e.target.value)
                          }
                          className="text-xs font-black px-3 py-1 rounded-full bg-bg border-0 outline-none cursor-pointer"
                        >
                          {Object.entries(STATUS_LABELS).map(([key, s]) => (
                            <option key={key} value={key}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
