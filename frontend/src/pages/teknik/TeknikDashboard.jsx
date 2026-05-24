/* Teknik Dashboard - sheh service requests qe i jane caktuar */
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

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

export default function TeknikDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedReq, setSelectedReq] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await api.get("/service-requests");
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filtered = requests.filter((r) => {
    if (filter === "all") return true;
    return r.statusi === filter;
  });

  const pending = requests.filter((r) => r.statusi === "pending").length;
  const inProgress = requests.filter((r) => r.statusi === "in_progress").length;
  const completed = requests.filter((r) => r.statusi === "completed").length;

  const openDetails = (req) => {
    setSelectedReq(req);
    setEditForm({
      statusi: req.statusi,
      kostoja: req.kostoja || "",
      data_perfundimit: req.data_perfundimit?.split("T")[0] || "",
    });
  };

  const handleSave = async () => {
    try {
      await api.put(`/service-requests/${selectedReq.id}`, editForm);
      alert("✅ Kërkesa u përditësua!");
      setSelectedReq(null);
      fetchRequests();
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
      {/* Header */}
      <header className="bg-white border-b border-bg px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black">
            P
          </div>
          <div>
            <p className="font-black text-dark">PARADOX TECH</p>
            <p className="text-xs text-muted">🔧 Teknik Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-black text-dark text-sm">{user?.emri_plote}</p>
            <p className="text-xs text-muted">{user?.email}</p>
          </div>
          <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-black">
            {user?.emri_plote?.[0]?.toUpperCase() || "T"}
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-50 hover:bg-red-100 text-danger font-black text-sm px-4 py-2 rounded-xl border-0 cursor-pointer transition-colors"
          >
            🚪 Dil
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-5">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-primary to-green-600 text-white rounded-2xl p-6">
          <h1 className="text-2xl font-black mb-1">
            Mirë se erdhët, {user?.emri_plote}! 👋
          </h1>
          <p className="text-sm opacity-90">
            Kontrolloni kërkesat e servisit dhe përditësoni statusin e tyre.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-card">
            <div className="flex items-start justify-between mb-2">
              <p className="font-black text-dark text-sm">Të Gjitha</p>
              <span className="text-2xl">📋</span>
            </div>
            <p className="text-3xl font-black text-dark">{requests.length}</p>
            <p className="text-xs text-muted mt-1">Kërkesa servisi</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-card">
            <div className="flex items-start justify-between mb-2">
              <p className="font-black text-dark text-sm">Në Pritje</p>
              <span className="text-2xl">⏳</span>
            </div>
            <p className="text-3xl font-black text-warning">{pending}</p>
            <p className="text-xs text-muted mt-1">Duhen nisur</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-card">
            <div className="flex items-start justify-between mb-2">
              <p className="font-black text-dark text-sm">Në Servis</p>
              <span className="text-2xl">🔧</span>
            </div>
            <p className="text-3xl font-black text-blue-600">{inProgress}</p>
            <p className="text-xs text-muted mt-1">Duke punuar</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-card">
            <div className="flex items-start justify-between mb-2">
              <p className="font-black text-dark text-sm">Përfunduar</p>
              <span className="text-2xl">✓</span>
            </div>
            <p className="text-3xl font-black text-primary">{completed}</p>
            <p className="text-xs text-muted mt-1">U kryen</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-xs font-black border-0 cursor-pointer transition-colors ${
              filter === "all"
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
                onClick={() => setFilter(s.value)}
                className={`px-4 py-2 rounded-full text-xs font-black border-0 cursor-pointer transition-colors ${
                  filter === s.value
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
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-card">
            <p className="text-5xl mb-3">🔧</p>
            <p className="font-black text-dark">Asnjë kërkesë</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((r) => {
              const status =
                STATUS_OPTIONS.find((s) => s.value === r.statusi) ||
                STATUS_OPTIONS[0];
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
                  <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
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
                      <p className="text-sm text-dark font-black mb-1">
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
                    <p className="text-xs font-black text-muted mb-1">
                      PROBLEMI
                    </p>
                    <p className="text-sm text-dark">
                      {r.pershkrimi_problemit}
                    </p>
                  </div>

                  <button
                    onClick={() => openDetails(r)}
                    className="bg-primary text-white text-xs font-black px-4 py-2 rounded-lg border-0 cursor-pointer hover:bg-green-600"
                  >
                    🔧 Menaxho Servisin
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal */}
      {selectedReq && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedReq(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-black text-dark">
                Menaxho #SR{selectedReq.id.toString().padStart(5, "0")}
              </h3>
              <button
                onClick={() => setSelectedReq(null)}
                className="text-2xl bg-transparent border-0 cursor-pointer text-muted"
              >
                ✕
              </button>
            </div>

            <div className="bg-bg rounded-xl p-3 mb-4">
              <p className="font-black text-dark text-sm">
                {selectedReq.products?.emertimi}
              </p>
              <p className="text-xs text-muted mt-1">
                Klient: {selectedReq.customers?.emri}{" "}
                {selectedReq.customers?.mbiemri}
              </p>
              <p className="text-xs text-muted mt-2">
                {selectedReq.pershkrimi_problemit}
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
                onClick={() => setSelectedReq(null)}
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
