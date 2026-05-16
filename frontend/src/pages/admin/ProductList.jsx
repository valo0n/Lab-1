/* ProductList — lista e plote e produkteve */
import { useState, useMemo, useRef, useEffect } from "react";

const ALL_PRODUCTS = [
  {
    id: "P001",
    name: "iPhone 15 Pro Max",
    emoji: "📱",
    category: "Smartphones",
    price: 1299.0,
    stock: 45,
    status: "In Stock",
    sold: 145,
  },
  {
    id: "P002",
    name: "Sony WH-1000XM5",
    emoji: "🎧",
    category: "Audio",
    price: 279.0,
    stock: 32,
    status: "In Stock",
    sold: 98,
  },
  {
    id: "P003",
    name: "MacBook Pro M3",
    emoji: "💻",
    category: "Laptops",
    price: 1999.0,
    stock: 0,
    status: "Out of Stock",
    sold: 87,
  },
  {
    id: "P004",
    name: "PS5 Slim Digital",
    emoji: "🎮",
    category: "Gaming",
    price: 399.0,
    stock: 12,
    status: "Low Stock",
    sold: 76,
  },
  {
    id: "P005",
    name: "Samsung Galaxy S24",
    emoji: "📱",
    category: "Smartphones",
    price: 1099.0,
    stock: 28,
    status: "In Stock",
    sold: 130,
  },
  {
    id: "P006",
    name: "AirPods Pro 2",
    emoji: "🎧",
    category: "Audio",
    price: 219.0,
    stock: 56,
    status: "In Stock",
    sold: 110,
  },
  {
    id: "P007",
    name: "Apple Watch Series 9",
    emoji: "⌚",
    category: "Wearables",
    price: 399.0,
    stock: 38,
    status: "In Stock",
    sold: 64,
  },
  {
    id: "P008",
    name: "Canon EOS R6",
    emoji: "📷",
    category: "Cameras",
    price: 2499.0,
    stock: 8,
    status: "Low Stock",
    sold: 28,
  },
  {
    id: "P009",
    name: 'LG UltraGear 27" 4K',
    emoji: "🖥️",
    category: "TV & Monitor",
    price: 449.0,
    stock: 22,
    status: "In Stock",
    sold: 45,
  },
  {
    id: "P010",
    name: "Logitech MX Master 3S",
    emoji: "🖱️",
    category: "Accessories",
    price: 99.99,
    stock: 0,
    status: "Out of Stock",
    sold: 88,
  },
  {
    id: "P011",
    name: 'iPad Pro 12.9"',
    emoji: "📱",
    category: "Smartphones",
    price: 1099.0,
    stock: 19,
    status: "In Stock",
    sold: 92,
  },
  {
    id: "P012",
    name: "Bose QuietComfort 45",
    emoji: "🎧",
    category: "Audio",
    price: 329.0,
    stock: 41,
    status: "In Stock",
    sold: 75,
  },
  {
    id: "P013",
    name: "Dell XPS 15",
    emoji: "💻",
    category: "Laptops",
    price: 1799.0,
    stock: 6,
    status: "Low Stock",
    sold: 55,
  },
  {
    id: "P014",
    name: "Xbox Series X",
    emoji: "🎮",
    category: "Gaming",
    price: 499.0,
    stock: 35,
    status: "In Stock",
    sold: 68,
  },
  {
    id: "P015",
    name: 'Samsung 65" QLED TV',
    emoji: "📺",
    category: "TV & Monitor",
    price: 1499.0,
    stock: 14,
    status: "In Stock",
    sold: 32,
  },
  {
    id: "P016",
    name: "GoPro Hero 12",
    emoji: "📷",
    category: "Cameras",
    price: 399.0,
    stock: 29,
    status: "In Stock",
    sold: 45,
  },
  {
    id: "P017",
    name: "Garmin Fenix 7",
    emoji: "⌚",
    category: "Wearables",
    price: 699.0,
    stock: 0,
    status: "Out of Stock",
    sold: 38,
  },
  {
    id: "P018",
    name: "Razer DeathAdder V3",
    emoji: "🖱️",
    category: "Accessories",
    price: 69.99,
    stock: 67,
    status: "In Stock",
    sold: 95,
  },
  {
    id: "P019",
    name: "iPhone 15",
    emoji: "📱",
    category: "Smartphones",
    price: 799.0,
    stock: 53,
    status: "In Stock",
    sold: 120,
  },
  {
    id: "P020",
    name: "JBL Flip 6 Speaker",
    emoji: "🔊",
    category: "Audio",
    price: 119.0,
    stock: 4,
    status: "Low Stock",
    sold: 82,
  },
];

const ITEMS_PER_PAGE = 10;

export default function ProductList() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target))
        setShowFilter(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(() => {
    let r = [...ALL_PRODUCTS];
    if (filterStatus !== "all") r = r.filter((p) => p.status === filterStatus);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q),
      );
    }
    return r;
  }, [search, filterStatus]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const current = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setPage(1);
  }, [search, filterStatus]);

  const totalProducts = ALL_PRODUCTS.length;
  const inStock = ALL_PRODUCTS.filter((p) => p.status === "In Stock").length;
  const lowStock = ALL_PRODUCTS.filter((p) => p.status === "Low Stock").length;
  const outOfStock = ALL_PRODUCTS.filter(
    (p) => p.status === "Out of Stock",
  ).length;

  const statusColor = (s) => {
    if (s === "In Stock") return "text-primary";
    if (s === "Low Stock") return "text-warning";
    return "text-danger";
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-black text-dark">Product List</h2>
        <button className="bg-primary hover:bg-green-600 text-white font-black text-sm px-5 py-2.5 rounded-full flex items-center gap-2 border-0 cursor-pointer transition-colors">
          ⊕ Add Product
        </button>
      </div>

      {/* 4 Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <p className="font-black text-dark mb-2">Total Products</p>
          <p className="text-2xl font-black text-dark">{totalProducts}</p>
          <p className="text-xs text-muted mt-1">All items</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <p className="font-black text-dark mb-2">In Stock</p>
          <p className="text-2xl font-black text-primary">{inStock}</p>
          <p className="text-xs text-muted mt-1">Available</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <p className="font-black text-dark mb-2">Low Stock</p>
          <p className="text-2xl font-black text-warning">{lowStock}</p>
          <p className="text-xs text-muted mt-1">Need restock</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <p className="font-black text-dark mb-2">Out of Stock</p>
          <p className="text-2xl font-black text-danger">{outOfStock}</p>
          <p className="text-xs text-muted mt-1">Unavailable</p>
        </div>
      </div>

      {/* Filters + Table */}
      <div className="bg-white rounded-2xl p-5 shadow-card">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <h3 className="font-black text-dark">
            Të gjitha produktet ({filtered.length})
          </h3>
          <div className="flex items-center gap-2">
            <div className="bg-bg rounded-full px-4 py-2 flex items-center gap-2 w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search product..."
                className="bg-transparent outline-none text-sm flex-1 font-lato"
              />
              <span className="text-muted text-sm">🔍</span>
            </div>

            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="w-10 h-10 bg-white border border-bg rounded-full flex items-center justify-center hover:bg-bg cursor-pointer transition-colors"
              >
                ⚙️
              </button>
              {showFilter && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-hover border border-bg p-3 z-50">
                  <p className="text-xs font-black text-dark mb-2">
                    Filter by status
                  </p>
                  {["all", "In Stock", "Low Stock", "Out of Stock"].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setFilterStatus(s);
                        setShowFilter(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-black bg-transparent border-0 cursor-pointer transition-colors ${
                        filterStatus === s
                          ? "bg-primary text-white"
                          : "text-dark hover:bg-bg"
                      }`}
                    >
                      {s === "all" ? "Te gjitha" : s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-light/40 text-xs text-dark font-black">
                <th className="text-left px-4 py-3 rounded-l-xl">ID</th>
                <th className="text-left px-2 py-3">Product</th>
                <th className="text-left px-2 py-3">Category</th>
                <th className="text-left px-2 py-3">Price</th>
                <th className="text-left px-2 py-3">Stock</th>
                <th className="text-left px-2 py-3">Sold</th>
                <th className="text-left px-2 py-3">Status</th>
                <th className="text-left px-2 py-3 rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody>
              {current.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-muted">
                    Asnje produkt nuk u gjet
                  </td>
                </tr>
              ) : (
                current.map((p) => (
                  <tr key={p.id} className="border-b border-bg text-sm">
                    <td className="px-4 py-3.5 text-dark font-black">{p.id}</td>
                    <td className="px-2 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 bg-bg rounded-lg flex items-center justify-center text-xl">
                          {p.emoji}
                        </div>
                        <span className="font-black text-dark">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-2 py-3.5 text-dark">{p.category}</td>
                    <td className="px-2 py-3.5 text-dark font-black">
                      ${p.price.toLocaleString()}
                    </td>
                    <td className="px-2 py-3.5 text-dark">{p.stock}</td>
                    <td className="px-2 py-3.5 text-dark">{p.sold}</td>
                    <td className="px-2 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 font-black ${statusColor(p.status)}`}
                      >
                        <span className="w-2 h-2 rounded-full bg-current"></span>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-2 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => alert(`Editing ${p.name}`)}
                          className="text-muted hover:text-primary bg-transparent border-0 cursor-pointer text-lg"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Fshi ${p.name}?`)) alert("U fshi!");
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
                  className={`w-9 h-9 rounded-lg text-sm font-black border-0 cursor-pointer transition-colors ${p === page ? "bg-primary text-white" : "bg-white border border-bg text-dark hover:bg-bg"}`}
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
