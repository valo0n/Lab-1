/* OrderManagement — lista e porosive nga DB me filter dhe veprime */
import { useState, useEffect } from "react";
import { getOrders, updateOrderStatus, deleteOrder } from "../../lib/api";

const STATUS_OPTIONS = [
  {
    value: "pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    value: "processing",
    label: "Processing",
    color: "bg-blue-100 text-blue-700",
  },
  {
    value: "shipped",
    label: "Shipped",
    color: "bg-purple-100 text-purple-700",
  },
  {
    value: "completed",
    label: "Completed",
    color: "bg-green-100 text-green-700",
  },
  { value: "canceled", label: "Canceled", color: "bg-red-100 text-red-700" },
];

const getStatusStyle = (status) => {
  const found = STATUS_OPTIONS.find((s) => s.value === status);
  return found ? found.color : "bg-gray-100 text-gray-700";
};

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  /* Ngarko porosit nga API */
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (statusFilter !== "all") params.status = statusFilter;
      if (searchQuery) params.search = searchQuery;

      const data = await getOrders(params);
      setOrders(data);
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError("Nuk mund të ngarkohen porosit");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [statusFilter]);

  /* Search me debounce */
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, [searchQuery]);

  /* Ndrysho statusin e porosise */
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      /* Perditeso lokalisht pa rifreskuar te gjithe listen */
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, statusi_porosis: newStatus } : o,
        ),
      );
    } catch (err) {
      console.error("Update status error:", err);
      alert(`Gabim: ${err.data?.error || err.message}`);
    }
  };

  /* Fshi porosine */
  const handleDelete = async (orderId) => {
    if (!confirm(`A je i sigurt që do të fshish porosinë #${orderId}?`)) return;

    try {
      await deleteOrder(orderId);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      alert("Porosia u fshi me sukses");
    } catch (err) {
      console.error("Delete order error:", err);
      alert(`Gabim: ${err.data?.error || err.message}`);
    }
  };

  /* Llogarit numrin e produkteve ne porosi */
  const getItemsCount = (order) => {
    return order.order_details?.reduce((sum, d) => sum + d.sasia, 0) || 0;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-black text-dark">Order Management</h2>
          <p className="text-sm text-muted mt-1">
            {loading ? "Duke ngarkuar..." : `${orders.length} porosi gjithsej`}
          </p>
        </div>

        {/* Search */}
        <div className="bg-white border border-bg rounded-full px-4 py-2.5 flex items-center gap-2 w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Kërko klientin..."
            className="bg-transparent outline-none text-sm flex-1 font-lato"
          />
          <span className="text-muted text-sm">🔍</span>
        </div>
      </div>

      {/* Status filters */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-4 py-2 rounded-full text-xs font-black border-0 cursor-pointer transition-colors ${
            statusFilter === "all"
              ? "bg-primary text-white"
              : "bg-white text-dark hover:bg-bg"
          }`}
        >
          Të gjitha ({orders.length})
        </button>
        {STATUS_OPTIONS.map((s) => {
          const count = orders.filter(
            (o) => o.statusi_porosis === s.value,
          ).length;
          return (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value)}
              className={`px-4 py-2 rounded-full text-xs font-black border-0 cursor-pointer transition-colors ${
                statusFilter === s.value
                  ? "bg-primary text-white"
                  : "bg-white text-dark hover:bg-bg"
              }`}
            >
              {s.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Lista */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-10 text-center">
            <p className="text-muted">Duke ngarkuar porositë...</p>
          </div>
        ) : error ? (
          <div className="p-10 text-center">
            <p className="text-5xl mb-3">⚠️</p>
            <p className="font-black text-danger mb-2">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-3 bg-primary text-white px-5 py-2 rounded-xl font-black border-0 cursor-pointer hover:bg-green-600"
            >
              Provo prap
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-5xl mb-3">📦</p>
            <p className="font-black text-dark mb-2">Asnjë porosi ende</p>
            <p className="text-xs text-muted">
              Porosit do shfaqen këtu kur klientët të bëjnë blerje
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg">
                <tr className="text-left text-xs text-muted">
                  <th className="px-4 py-3 font-black">#ID</th>
                  <th className="px-4 py-3 font-black">Klienti</th>
                  <th className="px-4 py-3 font-black">Data</th>
                  <th className="px-4 py-3 font-black">Produkte</th>
                  <th className="px-4 py-3 font-black">Pagesa</th>
                  <th className="px-4 py-3 font-black">Total</th>
                  <th className="px-4 py-3 font-black">Status</th>
                  <th className="px-4 py-3 font-black text-center">Veprime</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
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
                      {new Date(order.data_porosis).toLocaleDateString(
                        "sq-AL",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        },
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-dark">
                      {getItemsCount(order)} produkte
                    </td>
                    <td className="px-4 py-3 text-sm text-dark">
                      {order.metoda_pageses}
                    </td>
                    <td className="px-4 py-3 text-sm font-black text-primary">
                      €{parseFloat(order.shuma_totale).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.statusi_porosis}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className={`text-xs font-black px-3 py-1.5 rounded-full border-0 cursor-pointer outline-none ${getStatusStyle(
                          order.statusi_porosis,
                        )}`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-center">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-primary hover:bg-bg p-2 rounded-lg cursor-pointer bg-transparent border-0 transition-colors"
                          title="Shiko detajet"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="text-danger hover:bg-red-50 p-2 rounded-lg cursor-pointer bg-transparent border-0 transition-colors"
                          title="Fshi"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal me detajet e porosise */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-black text-dark">
                Porosia #ORD{selectedOrder.id.toString().padStart(6, "0")}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-2xl bg-transparent border-0 cursor-pointer text-muted hover:text-dark"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-bg rounded-xl p-3">
                <p className="text-xs text-muted mb-1">Klienti</p>
                <p className="font-black text-dark">
                  {selectedOrder.customers?.emri}{" "}
                  {selectedOrder.customers?.mbiemri}
                </p>
                <p className="text-xs text-muted">
                  {selectedOrder.customers?.email}
                </p>
              </div>
              <div className="bg-bg rounded-xl p-3">
                <p className="text-xs text-muted mb-1">Data e Porosisë</p>
                <p className="font-black text-dark">
                  {new Date(selectedOrder.data_porosis).toLocaleString("sq-AL")}
                </p>
              </div>
              <div className="bg-bg rounded-xl p-3">
                <p className="text-xs text-muted mb-1">Metoda e Pagesës</p>
                <p className="font-black text-dark capitalize">
                  {selectedOrder.metoda_pageses}
                </p>
              </div>
              <div className="bg-bg rounded-xl p-3">
                <p className="text-xs text-muted mb-1">Status</p>
                <span
                  className={`inline-block text-xs font-black px-3 py-1 rounded-full ${getStatusStyle(
                    selectedOrder.statusi_porosis,
                  )}`}
                >
                  {selectedOrder.statusi_porosis}
                </span>
              </div>
            </div>

            {selectedOrder.adresa_dorezimit && (
              <div className="bg-bg rounded-xl p-3 mb-5">
                <p className="text-xs text-muted mb-1">Adresa e Dorëzimit</p>
                <p className="text-sm text-dark">
                  {selectedOrder.adresa_dorezimit}
                </p>
              </div>
            )}

            {/* Produktet */}
            <h4 className="font-black text-dark mb-3">Produktet</h4>
            <div className="space-y-2 mb-5">
              {selectedOrder.order_details?.map((detail) => (
                <div
                  key={detail.id}
                  className="flex items-center justify-between bg-bg rounded-xl p-3"
                >
                  <div className="flex-1">
                    <p className="font-black text-dark text-sm">
                      {detail.products?.emertimi}
                    </p>
                    <p className="text-xs text-muted">
                      {detail.products?.marka} · Sasia: {detail.sasia}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-primary text-sm">
                      €{parseFloat(detail.shuma).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted">
                      €{parseFloat(detail.cmimi_njesi).toLocaleString()} ×{" "}
                      {detail.sasia}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totali */}
            <div className="border-t border-bg pt-3 flex justify-between items-center">
              <span className="font-black text-dark text-lg">Totali:</span>
              <span className="font-black text-primary text-xl">
                €{parseFloat(selectedOrder.shuma_totale).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
