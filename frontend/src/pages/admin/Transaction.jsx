/* Transaction admin — transaksionet nga porositë reale */
import { useState, useEffect } from "react";
import { api } from "../../lib/api";

export default function Transaction() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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

  /* Filtro porositë */
  const filteredOrders = orders.filter((o) => {
    if (filter === "completed" && o.statusi_porosis !== "completed")
      return false;
    if (filter === "pending" && o.statusi_porosis !== "pending") return false;
    if (filter === "canceled" && o.statusi_porosis !== "canceled") return false;
    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      const customerName =
        `${o.customers?.emri || ""} ${o.customers?.mbiemri || ""}`.toLowerCase();
      const orderId = `ord${o.id.toString().padStart(6, "0")}`.toLowerCase();
      return customerName.includes(search) || orderId.includes(search);
    }
    return true;
  });

  /* Llogarit statistikat */
  const totalRevenue = orders
    .filter((o) => o.statusi_porosis === "completed")
    .reduce((sum, o) => sum + parseFloat(o.shuma_totale), 0);

  const completedCount = orders.filter(
    (o) => o.statusi_porosis === "completed",
  ).length;
  const pendingCount = orders.filter(
    (o) => o.statusi_porosis === "pending",
  ).length;
  const canceledCount = orders.filter(
    (o) => o.statusi_porosis === "canceled",
  ).length;

  /* Llogarit perqindjet */
  const completedPercent =
    orders.length > 0 ? Math.round((completedCount / orders.length) * 100) : 0;
  const pendingPercent =
    orders.length > 0 ? Math.round((pendingCount / orders.length) * 100) : 0;
  const canceledPercent =
    orders.length > 0 ? Math.round((canceledCount / orders.length) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-start justify-between mb-2">
            <p className="font-black text-dark text-sm">Total Revenue</p>
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-2xl font-black text-dark mb-1">
            €{totalRevenue.toLocaleString()}
          </p>
          <p className="text-xs text-primary font-black">
            ↑ Nga porosit e perfunduara
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-start justify-between mb-2">
            <p className="font-black text-dark text-sm">Completed</p>
            <span className="text-2xl">✓</span>
          </div>
          <p className="text-2xl font-black text-dark mb-1">{completedCount}</p>
          <p className="text-xs text-primary font-black">
            {completedPercent}% e totalit
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-start justify-between mb-2">
            <p className="font-black text-dark text-sm">Pending</p>
            <span className="text-2xl">⏳</span>
          </div>
          <p className="text-2xl font-black text-dark mb-1">{pendingCount}</p>
          <p className="text-xs text-warning font-black">
            {pendingPercent}% e totalit
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-start justify-between mb-2">
            <p className="font-black text-dark text-sm">Canceled</p>
            <span className="text-2xl">✗</span>
          </div>
          <p className="text-2xl font-black text-dark mb-1">{canceledCount}</p>
          <p className="text-xs text-danger font-black">
            {canceledPercent}% e totalit
          </p>
        </div>
      </div>

      {/* Header + Filter */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-black text-dark">Transactions</h2>
          <p className="text-sm text-muted mt-1">
            {loading
              ? "Duke ngarkuar..."
              : `${filteredOrders.length} transaksione`}
          </p>
        </div>

        <div className="bg-white border border-bg rounded-full px-4 py-2.5 flex items-center gap-2 w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Kërko transaksion..."
            className="bg-transparent outline-none text-sm flex-1 font-lato"
          />
          <span className="text-muted text-sm">🔍</span>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2 flex-wrap">
        {[
          { value: "all", label: "Të gjitha", count: orders.length },
          { value: "completed", label: "Completed", count: completedCount },
          { value: "pending", label: "Pending", count: pendingCount },
          { value: "canceled", label: "Canceled", count: canceledCount },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-full text-xs font-black border-0 cursor-pointer transition-colors ${
              filter === f.value
                ? "bg-primary text-white"
                : "bg-white text-dark hover:bg-bg"
            }`}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-muted">Duke ngarkuar...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-5xl mb-3">💳</p>
            <p className="font-black text-dark">Asnjë transaksion</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg">
                <tr className="text-left text-xs text-muted">
                  <th className="px-4 py-3 font-black">Customer ID</th>
                  <th className="px-4 py-3 font-black">Klienti</th>
                  <th className="px-4 py-3 font-black">Data</th>
                  <th className="px-4 py-3 font-black">Totali</th>
                  <th className="px-4 py-3 font-black">Metoda</th>
                  <th className="px-4 py-3 font-black">Statusi</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-bg hover:bg-bg/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-black text-dark">
                      #ORD{order.id.toString().padStart(6, "0")}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <p className="font-black text-dark">
                        {order.customers?.emri} {order.customers?.mbiemri}
                      </p>
                      <p className="text-xs text-muted">
                        {order.customers?.email}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted">
                      {new Date(order.data_porosis).toLocaleDateString("sq-AL")}
                    </td>
                    <td className="px-4 py-3 text-sm font-black text-primary">
                      €{parseFloat(order.shuma_totale).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-dark capitalize">
                      {order.metoda_pageses}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-black px-3 py-1 rounded-full inline-flex items-center gap-1 ${
                          order.statusi_porosis === "completed"
                            ? "bg-primary/10 text-primary"
                            : order.statusi_porosis === "pending"
                              ? "bg-warning/10 text-warning"
                              : order.statusi_porosis === "canceled"
                                ? "bg-red-100 text-danger"
                                : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {order.statusi_porosis}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
