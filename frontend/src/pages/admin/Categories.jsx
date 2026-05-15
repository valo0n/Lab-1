/* Categories — admin page per menaxhimin e kategorive */
import { useState, useMemo, useRef, useEffect } from "react";

/* 8 kategori kryesore */
const CATEGORIES = [
  { id: 1, name: "Smartphones", emoji: "📱", count: 145 },
  { id: 2, name: "Laptops", emoji: "💻", count: 87 },
  { id: 3, name: "Audio", emoji: "🎧", count: 98 },
  { id: 4, name: "Gaming", emoji: "🎮", count: 76 },
  { id: 5, name: "TV & Monitor", emoji: "📺", count: 56 },
  { id: 6, name: "Cameras", emoji: "📷", count: 42 },
  { id: 7, name: "Wearables", emoji: "⌚", count: 64 },
  { id: 8, name: "Accessories", emoji: "🔌", count: 120 },
];

/* Produkte ne kategori - 30 produkte elektronike Paradox */
const ALL_PRODUCTS = [
  {
    no: 1,
    name: "iPhone 15 Pro Max",
    emoji: "📱",
    date: "01-01-2025",
    order: 145,
    category: "Smartphones",
    tag: "featured",
  },
  {
    no: 2,
    name: "Sony WH-1000XM5",
    emoji: "🎧",
    date: "01-01-2025",
    order: 98,
    category: "Audio",
    tag: "featured",
  },
  {
    no: 3,
    name: "MacBook Pro M3",
    emoji: "💻",
    date: "02-01-2025",
    order: 87,
    category: "Laptops",
    tag: "featured",
  },
  {
    no: 4,
    name: "PS5 Slim Digital",
    emoji: "🎮",
    date: "02-01-2025",
    order: 76,
    category: "Gaming",
    tag: "sale",
  },
  {
    no: 5,
    name: "Samsung Galaxy S24",
    emoji: "📱",
    date: "03-01-2025",
    order: 130,
    category: "Smartphones",
    tag: "featured",
  },
  {
    no: 6,
    name: "AirPods Pro 2",
    emoji: "🎧",
    date: "03-01-2025",
    order: 110,
    category: "Audio",
    tag: "featured",
  },
  {
    no: 7,
    name: "Apple Watch Series 9",
    emoji: "⌚",
    date: "04-01-2025",
    order: 64,
    category: "Wearables",
    tag: "featured",
  },
  {
    no: 8,
    name: "Canon EOS R6",
    emoji: "📷",
    date: "04-01-2025",
    order: 28,
    category: "Cameras",
    tag: "sale",
  },
  {
    no: 9,
    name: 'LG UltraGear 27" 4K',
    emoji: "🖥️",
    date: "05-01-2025",
    order: 45,
    category: "TV & Monitor",
    tag: "sale",
  },
  {
    no: 10,
    name: "Logitech MX Master 3S",
    emoji: "🖱️",
    date: "05-01-2025",
    order: 88,
    category: "Accessories",
    tag: "featured",
  },
  {
    no: 11,
    name: 'iPad Pro 12.9"',
    emoji: "📱",
    date: "06-01-2025",
    order: 92,
    category: "Smartphones",
    tag: "featured",
  },
  {
    no: 12,
    name: "Bose QuietComfort 45",
    emoji: "🎧",
    date: "06-01-2025",
    order: 75,
    category: "Audio",
    tag: "sale",
  },
  {
    no: 13,
    name: "Dell XPS 15",
    emoji: "💻",
    date: "07-01-2025",
    order: 55,
    category: "Laptops",
    tag: "out",
  },
  {
    no: 14,
    name: "Xbox Series X",
    emoji: "🎮",
    date: "07-01-2025",
    order: 68,
    category: "Gaming",
    tag: "featured",
  },
  {
    no: 15,
    name: 'Samsung 65" QLED TV',
    emoji: "📺",
    date: "08-01-2025",
    order: 32,
    category: "TV & Monitor",
    tag: "sale",
  },
  {
    no: 16,
    name: "GoPro Hero 12",
    emoji: "📷",
    date: "08-01-2025",
    order: 45,
    category: "Cameras",
    tag: "featured",
  },
  {
    no: 17,
    name: "Garmin Fenix 7",
    emoji: "⌚",
    date: "09-01-2025",
    order: 38,
    category: "Wearables",
    tag: "out",
  },
  {
    no: 18,
    name: "Razer DeathAdder V3",
    emoji: "🖱️",
    date: "09-01-2025",
    order: 95,
    category: "Accessories",
    tag: "featured",
  },
  {
    no: 19,
    name: "iPhone 15",
    emoji: "📱",
    date: "10-01-2025",
    order: 120,
    category: "Smartphones",
    tag: "sale",
  },
  {
    no: 20,
    name: "JBL Flip 6 Speaker",
    emoji: "🔊",
    date: "10-01-2025",
    order: 82,
    category: "Audio",
    tag: "featured",
  },
  {
    no: 21,
    name: "Asus ROG Strix Laptop",
    emoji: "💻",
    date: "11-01-2025",
    order: 42,
    category: "Laptops",
    tag: "sale",
  },
  {
    no: 22,
    name: "Nintendo Switch OLED",
    emoji: "🎮",
    date: "11-01-2025",
    order: 78,
    category: "Gaming",
    tag: "featured",
  },
  {
    no: 23,
    name: "Logitech G915 TKL",
    emoji: "⌨️",
    date: "12-01-2025",
    order: 65,
    category: "Accessories",
    tag: "featured",
  },
  {
    no: 24,
    name: "Sony A7 IV Camera",
    emoji: "📷",
    date: "12-01-2025",
    order: 22,
    category: "Cameras",
    tag: "out",
  },
  {
    no: 25,
    name: "Samsung Galaxy Watch 6",
    emoji: "⌚",
    date: "13-01-2025",
    order: 56,
    category: "Wearables",
    tag: "sale",
  },
  {
    no: 26,
    name: "Meta Quest 3",
    emoji: "🥽",
    date: "13-01-2025",
    order: 50,
    category: "Gaming",
    tag: "featured",
  },
  {
    no: 27,
    name: "Anker PowerBank 20K",
    emoji: "🔋",
    date: "14-01-2025",
    order: 102,
    category: "Accessories",
    tag: "sale",
  },
  {
    no: 28,
    name: "DJI Mini 4 Pro Drone",
    emoji: "🚁",
    date: "14-01-2025",
    order: 35,
    category: "Cameras",
    tag: "featured",
  },
  {
    no: 29,
    name: "Sennheiser HD 660S2",
    emoji: "🎧",
    date: "15-01-2025",
    order: 48,
    category: "Audio",
    tag: "out",
  },
  {
    no: 30,
    name: "Kindle Paperwhite",
    emoji: "📚",
    date: "15-01-2025",
    order: 67,
    category: "Accessories",
    tag: "featured",
  },
];

const ITEMS_PER_PAGE = 10;

export default function Categories() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCat, setSelectedCat] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const moreRef = useRef(null);
  const filterRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target))
        setShowMore(false);
      if (filterRef.current && !filterRef.current.contains(e.target))
        setShowFilter(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Filtro produktet */
  const filtered = useMemo(() => {
    let result = [...ALL_PRODUCTS];

    if (selectedCat) {
      result = result.filter((p) => p.category === selectedCat);
    }

    if (activeTab === "Featured") {
      result = result.filter((p) => p.tag === "featured");
    } else if (activeTab === "Sale") {
      result = result.filter((p) => p.tag === "sale");
    } else if (activeTab === "OutOfStock") {
      result = result.filter((p) => p.tag === "out");
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    return result;
  }, [activeTab, search, selectedCat]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const current = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setPage(1);
  }, [activeTab, search, selectedCat]);

  const tabs = [
    { key: "All", label: `All Product (${ALL_PRODUCTS.length})` },
    { key: "Featured", label: "Featured Products" },
    { key: "Sale", label: "On Sale" },
    { key: "OutOfStock", label: "Out of Stock" },
  ];

  return (
    <div className="space-y-5">
      {/* Title + Actions */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-black text-dark">Discover</h2>
        <div className="flex items-center gap-2">
          <button className="bg-primary hover:bg-green-600 text-white font-black text-sm px-5 py-2.5 rounded-full flex items-center gap-2 border-0 cursor-pointer transition-colors">
            ⊕ Add Product
          </button>
          <button className="bg-white border border-bg text-dark font-black text-sm px-5 py-2.5 rounded-full flex items-center gap-2 cursor-pointer hover:bg-bg transition-colors">
            More Action ⋮
          </button>
        </div>
      </div>

      {/* Categories grid */}
      <div className="relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() =>
                setSelectedCat(selectedCat === c.name ? null : c.name)
              }
              className={`bg-white rounded-2xl p-4 shadow-card flex items-center gap-3 border-2 transition-all cursor-pointer ${
                selectedCat === c.name
                  ? "border-primary"
                  : "border-transparent hover:border-primary/30"
              }`}
            >
              <div className="w-14 h-14 bg-bg rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                {c.emoji}
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="font-black text-dark text-sm">{c.name}</p>
                <p className="text-xs text-muted">{c.count} items</p>
              </div>
            </button>
          ))}
        </div>

        {/* Arrow right (decorative) */}
        <button className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-card items-center justify-center text-dark cursor-pointer hover:bg-bg transition-colors border-0">
          →
        </button>
      </div>

      {/* Products table */}
      <div className="bg-white rounded-2xl p-5 shadow-card">
        {/* Filters bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`text-sm font-black px-4 py-2 rounded-full border-0 cursor-pointer transition-colors ${
                  activeTab === t.key
                    ? "bg-light/60 text-dark"
                    : "bg-transparent text-muted hover:bg-bg"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Search + buttons */}
          <div className="flex items-center gap-2">
            <div className="bg-bg rounded-full px-4 py-2 flex items-center gap-2 w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your product"
                className="bg-transparent outline-none text-sm flex-1 font-lato"
              />
              <span className="text-muted text-sm">🔍</span>
            </div>

            {/* Filter */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => {
                  setShowFilter(!showFilter);
                  setShowMore(false);
                }}
                className="w-10 h-10 bg-white border border-bg rounded-full flex items-center justify-center hover:bg-bg cursor-pointer transition-colors"
              >
                ⚙️
              </button>
              {showFilter && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-hover border border-bg p-3 z-50">
                  <p className="text-xs font-black text-dark mb-2">
                    Filter by category
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCat(null);
                      setShowFilter(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-black bg-transparent border-0 cursor-pointer transition-colors ${
                      !selectedCat
                        ? "bg-primary text-white"
                        : "text-dark hover:bg-bg"
                    }`}
                  >
                    Të gjitha
                  </button>
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCat(c.name);
                        setShowFilter(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-black bg-transparent border-0 cursor-pointer transition-colors ${
                        selectedCat === c.name
                          ? "bg-primary text-white"
                          : "text-dark hover:bg-bg"
                      }`}
                    >
                      {c.emoji} {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Add */}
            <button
              onClick={() => alert("Shto produkt te ri")}
              className="w-10 h-10 bg-white border border-bg rounded-full flex items-center justify-center hover:bg-primary hover:text-white cursor-pointer transition-colors text-primary"
            >
              ⊕
            </button>

            {/* More */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => {
                  setShowMore(!showMore);
                  setShowFilter(false);
                }}
                className="w-10 h-10 bg-white border border-bg rounded-full flex items-center justify-center hover:bg-bg cursor-pointer transition-colors"
              >
                ⋯
              </button>
              {showMore && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-hover border border-bg p-3 z-50">
                  <button
                    onClick={() => {
                      setSearch("");
                      setActiveTab("All");
                      setSelectedCat(null);
                      setShowMore(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-black text-dark hover:bg-bg bg-transparent border-0 cursor-pointer"
                  >
                    🗑️ Pastro filtrat
                  </button>
                  <button
                    onClick={() => {
                      alert("Export CSV");
                      setShowMore(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-black text-dark hover:bg-bg bg-transparent border-0 cursor-pointer"
                  >
                    📥 Export
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selected category indicator */}
        {selectedCat && (
          <div className="mb-3 flex items-center gap-2">
            <span className="text-xs text-muted">Filtruar sipas:</span>
            <span className="bg-light/60 text-dark text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
              {selectedCat}
              <button
                onClick={() => setSelectedCat(null)}
                className="ml-1 bg-transparent border-0 cursor-pointer hover:text-danger"
              >
                ✕
              </button>
            </span>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-light/40 text-xs text-dark font-black">
                <th className="text-left px-4 py-3 rounded-l-xl">No.</th>
                <th className="text-left px-2 py-3">Product</th>
                <th className="text-left px-2 py-3">Created Date</th>
                <th className="text-left px-2 py-3">Order</th>
                <th className="text-left px-2 py-3 rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody>
              {current.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-muted">
                    Asnje produkt nuk u gjet
                  </td>
                </tr>
              ) : (
                current.map((p) => (
                  <tr key={p.no} className="border-b border-bg text-sm">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="accent-primary w-4 h-4 cursor-pointer"
                        />
                        <span className="text-dark">1</span>
                      </div>
                    </td>
                    <td className="px-2 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 bg-bg rounded-lg flex items-center justify-center text-xl">
                          {p.emoji}
                        </div>
                        <span className="font-black text-dark">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-2 py-3.5 text-dark">{p.date}</td>
                    <td className="px-2 py-3.5 text-dark">{p.order}</td>
                    <td className="px-2 py-3.5">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => alert(`Editing ${p.name}`)}
                          className="text-muted hover:text-primary bg-transparent border-0 cursor-pointer text-lg"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Fshi ${p.name}?`))
                              alert(`U fshi ${p.name}`);
                          }}
                          className="text-muted hover:text-danger bg-transparent border-0 cursor-pointer text-lg"
                          title="Fshi"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-5">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="bg-white border border-bg text-dark font-black text-sm px-4 py-2 rounded-xl cursor-pointer hover:bg-bg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-black border-0 cursor-pointer transition-colors ${
                    p === page
                      ? "bg-primary text-white"
                      : "bg-white border border-bg text-dark hover:bg-bg"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="bg-white border border-bg text-dark font-black text-sm px-4 py-2 rounded-xl cursor-pointer hover:bg-bg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
