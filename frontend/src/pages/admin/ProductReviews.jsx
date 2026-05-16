/* ProductReviews — menaxhimi i komenteve te produkteve */
import { useState, useMemo } from "react";

const ALL_REVIEWS = [
  {
    id: 1,
    customer: "John Doe",
    avatar: "👨",
    product: "iPhone 15 Pro Max",
    emoji: "📱",
    rating: 5,
    comment:
      "Telefoni më i mirë që kam pasur ndonjëherë! Kamera është fantastike.",
    date: "01-01-2025",
    status: "Approved",
  },
  {
    id: 2,
    customer: "Jane Smith",
    avatar: "👩",
    product: "Sony WH-1000XM5",
    emoji: "🎧",
    rating: 4,
    comment: "Cilësi e shkëlqyer e zërit, por çmimi është pak i lartë.",
    date: "02-01-2025",
    status: "Pending",
  },
  {
    id: 3,
    customer: "Emily Davis",
    avatar: "👩",
    product: "MacBook Pro M3",
    emoji: "💻",
    rating: 5,
    comment: "Performancë e jashtëzakonshme! Punon shumë shpejt.",
    date: "02-01-2025",
    status: "Approved",
  },
  {
    id: 4,
    customer: "Michael Brown",
    avatar: "👨",
    product: "PS5 Slim Digital",
    emoji: "🎮",
    rating: 5,
    comment: "Konzola perfekte për gaming. Grafika është mahnitëse!",
    date: "03-01-2025",
    status: "Approved",
  },
  {
    id: 5,
    customer: "Sarah Wilson",
    avatar: "👩",
    product: "Samsung Galaxy S24",
    emoji: "📱",
    rating: 3,
    comment: "Mirë por bateria mund të jetë më e mirë.",
    date: "03-01-2025",
    status: "Approved",
  },
  {
    id: 6,
    customer: "David Martinez",
    avatar: "👨",
    product: "AirPods Pro 2",
    emoji: "🎧",
    rating: 5,
    comment: "Noise cancellation është i pabesueshëm!",
    date: "04-01-2025",
    status: "Pending",
  },
  {
    id: 7,
    customer: "Lisa Anderson",
    avatar: "👩",
    product: "Apple Watch Series 9",
    emoji: "⌚",
    rating: 4,
    comment: "Ora elegante me funksione të mira shëndetësore.",
    date: "04-01-2025",
    status: "Approved",
  },
  {
    id: 8,
    customer: "James Taylor",
    avatar: "👨",
    product: "Canon EOS R6",
    emoji: "📷",
    rating: 5,
    comment: "Kamera profesionale me cilësi të lartë fotografish.",
    date: "05-01-2025",
    status: "Approved",
  },
  {
    id: 9,
    customer: "Anna Garcia",
    avatar: "👩",
    product: 'LG UltraGear 27" 4K',
    emoji: "🖥️",
    rating: 2,
    comment: "Pikselat e këqij u shfaqën pas një jave.",
    date: "05-01-2025",
    status: "Rejected",
  },
  {
    id: 10,
    customer: "Robert Lee",
    avatar: "👨",
    product: "Xbox Series X",
    emoji: "🎮",
    rating: 5,
    comment: "Best gaming console ever! Load times janë instant.",
    date: "06-01-2025",
    status: "Approved",
  },
];

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
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRating, setFilterRating] = useState(0);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let r = [...ALL_REVIEWS];
    if (filterStatus !== "all")
      r = r.filter((rv) => rv.status === filterStatus);
    if (filterRating > 0) r = r.filter((rv) => rv.rating === filterRating);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(
        (rv) =>
          rv.customer.toLowerCase().includes(q) ||
          rv.product.toLowerCase().includes(q),
      );
    }
    return r;
  }, [filterStatus, filterRating, search]);

  const total = ALL_REVIEWS.length;
  const approved = ALL_REVIEWS.filter((r) => r.status === "Approved").length;
  const pending = ALL_REVIEWS.filter((r) => r.status === "Pending").length;
  const avgRating = (
    ALL_REVIEWS.reduce((s, r) => s + r.rating, 0) / total
  ).toFixed(1);

  const handleApprove = (id) => alert(`Review #${id} u aprovua!`);
  const handleReject = (id) => alert(`Review #${id} u refuzua!`);
  const handleDelete = (id) => {
    if (confirm("Fshi kete koment?")) alert(`Review #${id} u fshi!`);
  };

  const statusColor = (s) => {
    if (s === "Approved") return "text-primary bg-bg";
    if (s === "Pending") return "text-warning bg-yellow-50";
    return "text-danger bg-red-50";
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-black text-dark">Product Reviews</h2>

      {/* 4 Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <p className="font-black text-dark mb-2">Total Reviews</p>
          <p className="text-2xl font-black text-dark">{total}</p>
          <p className="text-xs text-muted mt-1">All time</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <p className="font-black text-dark mb-2">Average Rating</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black text-dark">{avgRating}</p>
            <Stars rating={Math.round(avgRating)} />
          </div>
          <p className="text-xs text-muted mt-1">From {total} reviews</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <p className="font-black text-dark mb-2">Approved</p>
          <p className="text-2xl font-black text-primary">{approved}</p>
          <p className="text-xs text-muted mt-1">Published</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <p className="font-black text-dark mb-2">Pending</p>
          <p className="text-2xl font-black text-warning">{pending}</p>
          <p className="text-xs text-muted mt-1">Need review</p>
        </div>
      </div>

      {/* Filters + Reviews list */}
      <div className="bg-white rounded-2xl p-5 shadow-card">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div className="flex flex-wrap gap-1">
            {["all", "Approved", "Pending", "Rejected"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`text-sm font-black px-4 py-2 rounded-full border-0 cursor-pointer transition-colors ${
                  filterStatus === s
                    ? "bg-primary text-white"
                    : "bg-bg text-dark hover:bg-light/60"
                }`}
              >
                {s === "all" ? `Te gjitha (${total})` : s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-bg rounded-full px-4 py-2 flex items-center gap-2 w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search reviews..."
                className="bg-transparent outline-none text-sm flex-1 font-lato"
              />
              <span className="text-muted text-sm">🔍</span>
            </div>

            <select
              value={filterRating}
              onChange={(e) => setFilterRating(Number(e.target.value))}
              className="bg-white border border-bg rounded-full px-4 py-2 text-sm font-black text-dark outline-none cursor-pointer"
            >
              <option value={0}>All ratings</option>
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} ⭐
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reviews list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-6xl mb-3">💬</p>
            <p className="text-muted font-black">Asnje koment nuk u gjet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((rv) => (
              <div
                key={rv.id}
                className="border border-bg rounded-xl p-4 hover:bg-bg/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-bg rounded-full flex items-center justify-center text-2xl">
                      {rv.avatar}
                    </div>
                    <div>
                      <p className="font-black text-dark">{rv.customer}</p>
                      <div className="flex items-center gap-2">
                        <Stars rating={rv.rating} />
                        <span className="text-xs text-muted">{rv.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-black px-3 py-1 rounded-full ${statusColor(rv.status)}`}
                    >
                      {rv.status}
                    </span>
                    {rv.status === "Pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(rv.id)}
                          className="text-primary hover:bg-bg w-8 h-8 rounded-full bg-transparent border-0 cursor-pointer"
                          title="Aprovo"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => handleReject(rv.id)}
                          className="text-danger hover:bg-red-50 w-8 h-8 rounded-full bg-transparent border-0 cursor-pointer"
                          title="Refuzo"
                        >
                          ✕
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(rv.id)}
                      className="text-muted hover:text-danger bg-transparent border-0 cursor-pointer text-lg"
                      title="Fshi"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2 text-sm">
                  <span className="text-xl">{rv.emoji}</span>
                  <span className="font-black text-dark">{rv.product}</span>
                </div>

                <p className="text-sm text-dark leading-relaxed">
                  {rv.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
