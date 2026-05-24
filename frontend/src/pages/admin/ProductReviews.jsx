/* ProductReviews — menaxhimi i komenteve te produkteve nga DB */
import { useState, useEffect, useMemo } from "react";
import { api } from "../../lib/api";

const CATEGORY_EMOJI = {
  Smartphones: "📱",
  Laptops: "💻",
  Audio: "🎧",
  Gaming: "🎮",
  "TV & Monitor": "📺",
  Cameras: "📷",
  Wearables: "⌚",
  Accessories: "🔌",
};

const Stars = ({ rating }) => (
  <span className="text-sm">
    {[1, 2, 3, 4, 5].map((i) => (
      <span
        key={i}
        className={i <= rating ? "text-yellow-400" : "text-gray-200"}
      >
        ★
      </span>
    ))}
  </span>
);

export default function ProductReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRating, setFilterRating] = useState(0);
  const [search, setSearch] = useState("");

  /* Merr te gjitha reviews nga API */
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await api.get("/reviews");
      setReviews(data);
    } catch (err) {
      console.error("Fetch reviews error:", err);
      alert("Gabim ne marrjen e reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  /* Filtrime */
  const filtered = useMemo(() => {
    let r = [...reviews];
    if (filterStatus === "approved") r = r.filter((rv) => rv.aprovuar === true);
    if (filterStatus === "pending")
      r = r.filter((rv) => rv.aprovuar === false || rv.aprovuar === null);
    if (filterRating > 0) r = r.filter((rv) => rv.vleresimi === filterRating);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter((rv) => {
        const customerName =
          `${rv.customers?.emri || ""} ${rv.customers?.mbiemri || ""}`.toLowerCase();
        const productName = (rv.products?.emertimi || "").toLowerCase();
        return customerName.includes(q) || productName.includes(q);
      });
    }
    return r;
  }, [reviews, filterStatus, filterRating, search]);

  const total = reviews.length;
  const approved = reviews.filter((r) => r.aprovuar === true).length;
  const pending = reviews.filter(
    (r) => r.aprovuar === false || r.aprovuar === null,
  ).length;
  const avgRating =
    total > 0
      ? (reviews.reduce((s, r) => s + r.vleresimi, 0) / total).toFixed(1)
      : 0;

  /* Aprovo review */
  const handleApprove = async (id) => {
    try {
      await api.put(`/reviews/${id}/approve`, { aprovuar: true });
      alert("✅ Review u aprovua!");
      fetchReviews();
    } catch (err) {
      alert(`Gabim: ${err.data?.error || err.message}`);
    }
  };

  /* Refuzo review */
  const handleReject = async (id) => {
    try {
      await api.put(`/reviews/${id}/approve`, { aprovuar: false });
      alert("✅ Review u refuzua");
      fetchReviews();
    } catch (err) {
      alert(`Gabim: ${err.data?.error || err.message}`);
    }
  };

  /* Fshi review */
  const handleDelete = async (id) => {
    if (!confirm("A je i sigurt që do të fshish këtë koment?")) return;
    try {
      await api.delete(`/reviews/${id}`);
      alert("✅ Review u fshi");
      fetchReviews();
    } catch (err) {
      alert(`Gabim: ${err.data?.error || err.message}`);
    }
  };

  const statusBadge = (rv) => {
    if (rv.aprovuar === true)
      return { label: "Approved", color: "text-primary bg-bg" };
    return { label: "Pending", color: "text-warning bg-yellow-50" };
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-black text-dark">Product Reviews</h2>

      {/* 4 Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <p className="font-black text-dark mb-2">Total Reviews</p>
          <p className="text-2xl font-black text-dark">{total}</p>
          <p className="text-xs text-muted mt-1">Të gjitha</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <p className="font-black text-dark mb-2">Average Rating</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black text-dark">{avgRating}</p>
            <Stars rating={Math.round(avgRating)} />
          </div>
          <p className="text-xs text-muted mt-1">Nga {total} reviews</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <p className="font-black text-dark mb-2">Approved</p>
          <p className="text-2xl font-black text-primary">{approved}</p>
          <p className="text-xs text-muted mt-1">Publikuar</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <p className="font-black text-dark mb-2">Pending</p>
          <p className="text-2xl font-black text-warning">{pending}</p>
          <p className="text-xs text-muted mt-1">Duhen review</p>
        </div>
      </div>

      {/* Filters + Reviews list */}
      <div className="bg-white rounded-2xl p-5 shadow-card">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div className="flex flex-wrap gap-1">
            {[
              { key: "all", label: `Të gjitha (${total})` },
              { key: "approved", label: `Approved (${approved})` },
              { key: "pending", label: `Pending (${pending})` },
            ].map((s) => (
              <button
                key={s.key}
                onClick={() => setFilterStatus(s.key)}
                className={`text-sm font-black px-4 py-2 rounded-full border-0 cursor-pointer transition-colors ${
                  filterStatus === s.key
                    ? "bg-primary text-white"
                    : "bg-bg text-dark hover:bg-light/60"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-bg rounded-full px-4 py-2 flex items-center gap-2 w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Kërko reviews..."
                className="bg-transparent outline-none text-sm flex-1 font-lato"
              />
              <span className="text-muted text-sm">🔍</span>
            </div>

            <select
              value={filterRating}
              onChange={(e) => setFilterRating(Number(e.target.value))}
              className="bg-white border border-bg rounded-full px-4 py-2 text-sm font-black text-dark outline-none cursor-pointer"
            >
              <option value={0}>Të gjitha rating-et</option>
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} ⭐
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reviews list */}
        {loading ? (
          <div className="text-center py-16 text-muted">Duke ngarkuar...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-6xl mb-3">💬</p>
            <p className="text-muted font-black">Asnjë koment nuk u gjet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((rv) => {
              const emoji =
                rv.products?.categories?.ikona ||
                CATEGORY_EMOJI[rv.products?.categories?.emertimi] ||
                "📦";
              const status = statusBadge(rv);

              return (
                <div
                  key={rv.id}
                  className="border border-bg rounded-xl p-4 hover:bg-bg/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-black">
                        {rv.customers?.emri?.[0]?.toUpperCase()}
                        {rv.customers?.mbiemri?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-dark">
                          {rv.customers?.emri} {rv.customers?.mbiemri}
                        </p>
                        <div className="flex items-center gap-2">
                          <Stars rating={rv.vleresimi} />
                          <span className="text-xs text-muted">
                            {new Date(rv.data_vleresimit).toLocaleDateString(
                              "sq-AL",
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-black px-3 py-1 rounded-full ${status.color}`}
                      >
                        {status.label}
                      </span>
                      {!rv.aprovuar && (
                        <button
                          onClick={() => handleApprove(rv.id)}
                          className="text-primary hover:bg-bg w-8 h-8 rounded-full bg-transparent border-0 cursor-pointer font-black text-lg"
                          title="Aprovo"
                        >
                          ✓
                        </button>
                      )}
                      {rv.aprovuar && (
                        <button
                          onClick={() => handleReject(rv.id)}
                          className="text-warning hover:bg-yellow-50 w-8 h-8 rounded-full bg-transparent border-0 cursor-pointer font-black"
                          title="Hiq aprovimin"
                        >
                          ⊘
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(rv.id)}
                        className="text-danger hover:bg-red-50 w-8 h-8 rounded-full bg-transparent border-0 cursor-pointer text-lg"
                        title="Fshi"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2 text-sm">
                    <span className="text-xl">{emoji}</span>
                    <span className="font-black text-dark">
                      {rv.products?.emertimi}
                    </span>
                  </div>

                  {rv.komenti && (
                    <p className="text-sm text-dark leading-relaxed">
                      "{rv.komenti}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
