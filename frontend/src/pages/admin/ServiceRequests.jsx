/* ServiceRequests admin — menaxho kerkesat e servisit */
import { useState, useEffect } from "react";
import { api } from "../../lib/api";

const STATUS_OPTIONS = [
  {
    value: "pending",
    label: "Në Pritje",
    color: "bg-yellow-100 text-yellow-700",
    icon: "⏳",
  },
  {
    value: "in_progress",
    label: "Duke u Servisuar",
    color: "bg-blue-100 text-blue-700",
    icon: "🔧",
  },
  {
    value: "completed",
    label: "Përfunduar",
    color: "bg-green-100 text-green-700",
    icon: "✓",
  },
  {
    value: "canceled",
    label: "Anuluar",
    color: "bg-red-100 text-red-700",
    icon: "✗",
  },
];

const getStatusInfo = (status) =>
  STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];

export default function ServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchQuery) params.append("search", searchQuery);
      const data = await api.get(`/service-requests?${params.toString()}`);
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line
  }, [statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => fetchRequests(), 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, [searchQuery]);

  const openDetails = (req) => {
    setSelectedRequest(req);
    setEditForm({
      statusi: req.statusi || "pending",
      kostoja: req.kostoja || "",
      data_perfundimit: req.data_perfundimit?.split("T")[0] || "",
    });
  };

  const handleSave = async () => {
    try {
      await api.put(`/service-requests/${selectedRequest.id}`, editForm);
      alert("✅ Kërkesa u përditësua!");
      setSelectedRequest(null);
      fetchRequests();
    } catch (err) {
      alert(`Gabim: ${err.data?.error || err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Fshi këtë kërkesë?")) return;
    try {
      await api.delete(`/service-requests/${id}`);
      fetchRequests();
    } catch (err) {
      alert(`Gabim: ${err.data?.error || err.message}`);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-black text-dark">Service Requests</h2>
          <p className="text-sm text-muted mt-1">
            {loading ? "Duke ngarkuar..." : `${requests.length} kërkesa`}
          </p>
        </div>
        <div className="bg-white border border-bg rounded-full px-4 py-2.5 flex items-center gap-2 w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Kërko..."
            className="bg-transparent outline-none text-sm flex-1"
          />
          <span className="text-muted text-sm">🔍</span>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-4 py-2 rounded-full text-xs font-black border-0 cursor-pointer transition-colors ${
            statusFilter === "all"
              ? "bg-primary text-white"
              : "bg-white text-dark hover:bg-bg"
          }`}
        >
          Të gjitha ({requests.length})
        </button>
        {STATUS_OPTIONS.map((s) => {
          const count = requests.filter((r) => r.statusi === s.value).length;
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
              {s.icon} {s.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Lista */}
      {loading ? (
        <div className="bg-white rounded-2xl p-10 text-center text-muted shadow-card">
          Duke ngarkuar...
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center shadow-card">
          <p className="text-5xl mb-3">🔧</p>
          <p className="font-black text-dark">Asnjë kërkesë servisi</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => {
            const status = getStatusInfo(r.statusi);
            return (
              <div
                key={r.id}
                className={`bg-white rounded-2xl p-5 shadow-card border-l-4 ${
                  r.statusi === "completed"
                    ? "border-primary"
                    : r.statusi === "canceled"
                      ? "border-danger"
                      : r.statusi === "in_progress"
                        ? "border-blue-500"
                        : "border-warning"
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-black text-dark">
                        #SR{r.id.toString().padStart(5, "0")}
                      </p>
                      <span
                        className={`text-xs font-black px-3 py-1 rounded-full ${status.color}`}
                      >
                        {status.icon} {status.label}
                      </span>
                    </div>
                    <p className="text-sm text-dark font-black">
                      📦 {r.products?.emertimi}
                    </p>
                    <p className="text-xs text-muted">
                      👤 {r.customers?.emri} {r.customers?.mbiemri} ·{" "}
                      {r.customers?.email}
                    </p>
                  </div>
                  <div className="text-right text-xs text-muted">
                    {new Date(r.data_kerkeses).toLocaleDateString("sq-AL")}
                    {r.kostoja && (
                      <p className="font-black text-primary mt-1">
                        €{parseFloat(r.kostoja).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-bg rounded-xl p-3 mb-3">
                  <p className="text-xs font-black text-muted mb-1">PROBLEMI</p>
                  <p className="text-sm text-dark">{r.pershkrimi_problemit}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openDetails(r)}
                    className="bg-primary text-white text-xs font-black px-4 py-2 rounded-lg border-0 cursor-pointer hover:bg-green-600"
                  >
                    ✏️ Menaxho
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="bg-red-50 text-danger text-xs font-black px-4 py-2 rounded-lg border-0 cursor-pointer hover:bg-red-100"
                  >
                    🗑️ Fshi
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {selectedRequest && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedRequest(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-black text-dark">
                Menaxho #SR{selectedRequest.id.toString().padStart(5, "0")}
              </h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-2xl bg-transparent border-0 cursor-pointer text-muted"
              >
                ✕
              </button>
            </div>

            <div className="bg-bg rounded-xl p-3 mb-4">
              <p className="font-black text-dark text-sm">
                {selectedRequest.products?.emertimi}
              </p>
              <p className="text-xs text-muted mt-1">
                {selectedRequest.pershkrimi_problemit}
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-black text-dark mb-1">
                  Statusi
                </label>
                <select
                  value={editForm.statusi}
                  onChange={(e) =>
                    setEditForm({ ...editForm, statusi: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary bg-white cursor-pointer"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-black text-dark mb-1">
                  Kostoja (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.kostoja}
                  onChange={(e) =>
                    setEditForm({ ...editForm, kostoja: e.target.value })
                  }
                  placeholder="50.00"
                  className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-dark mb-1">
                  Data e Përfundimit
                </label>
                <input
                  type="date"
                  value={editForm.data_perfundimit}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      data_perfundimit: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setSelectedRequest(null)}
                className="flex-1 bg-bg text-dark font-black py-2.5 rounded-xl border-0 cursor-pointer"
              >
                Anulo
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-primary hover:bg-green-600 text-white font-black py-2.5 rounded-xl border-0 cursor-pointer"
              >
                💾 Ruaj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
