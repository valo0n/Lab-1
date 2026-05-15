/* OrderManagement — admin page per menaxhimin e porosive */
import { useState, useMemo, useRef, useEffect } from "react";

/* Mock data — 40 porosi me produkte Paradox */
const ALL_ORDERS = [
  {
    no: 1,
    orderId: "#ORD0001",
    product: "iPhone 15 Pro Max",
    emoji: "📱",
    date: "01-01-2025",
    price: 1299.0,
    payment: "Paid",
    status: "Delivered",
  },
  {
    no: 2,
    orderId: "#ORD0002",
    product: "Sony WH-1000XM5",
    emoji: "🎧",
    date: "01-01-2025",
    price: 279.0,
    payment: "Unpaid",
    status: "Pending",
  },
  {
    no: 3,
    orderId: "#ORD0003",
    product: "Logitech MX Master 3S",
    emoji: "🖱️",
    date: "02-01-2025",
    price: 99.99,
    payment: "Paid",
    status: "Delivered",
  },
  {
    no: 4,
    orderId: "#ORD0004",
    product: "Samsung Galaxy S24",
    emoji: "📱",
    date: "02-01-2025",
    price: 1099.0,
    payment: "Paid",
    status: "Shipped",
  },
  {
    no: 5,
    orderId: "#ORD0005",
    product: "MacBook Pro M3",
    emoji: "💻",
    date: "03-01-2025",
    price: 1999.0,
    payment: "Unpaid",
    status: "Pending",
  },
  {
    no: 6,
    orderId: "#ORD0006",
    product: "PS5 Slim Digital",
    emoji: "🎮",
    date: "03-01-2025",
    price: 399.0,
    payment: "Unpaid",
    status: "Cancelled",
  },
  {
    no: 7,
    orderId: "#ORD0007",
    product: "AirPods Pro 2nd Gen",
    emoji: "🎧",
    date: "04-01-2025",
    price: 219.0,
    payment: "Paid",
    status: "Delivered",
  },
  {
    no: 8,
    orderId: "#ORD0008",
    product: "Logitech G Pro X Keyboard",
    emoji: "⌨️",
    date: "04-01-2025",
    price: 199.0,
    payment: "Paid",
    status: "Delivered",
  },
  {
    no: 9,
    orderId: "#ORD0009",
    product: 'LG UltraGear 27" 4K',
    emoji: "🖥️",
    date: "05-01-2025",
    price: 449.0,
    payment: "Unpaid",
    status: "Delivered",
  },
  {
    no: 10,
    orderId: "#ORD0010",
    product: "Apple Watch Series 9",
    emoji: "⌚",
    date: "05-01-2025",
    price: 399.0,
    payment: "Paid",
    status: "Delivered",
  },
  {
    no: 11,
    orderId: "#ORD0011",
    product: "JBL Flip 6 Speaker",
    emoji: "🔊",
    date: "06-01-2025",
    price: 119.0,
    payment: "Paid",
    status: "Shipped",
  },
  {
    no: 12,
    orderId: "#ORD0012",
    product: "HyperX Cloud III",
    emoji: "🎧",
    date: "06-01-2025",
    price: 89.99,
    payment: "Unpaid",
    status: "Pending",
  },
  {
    no: 13,
    orderId: "#ORD0013",
    product: 'iPad Pro 12.9"',
    emoji: "📱",
    date: "07-01-2025",
    price: 1099.0,
    payment: "Paid",
    status: "Delivered",
  },
  {
    no: 14,
    orderId: "#ORD0014",
    product: "Razer DeathAdder V3",
    emoji: "🖱️",
    date: "07-01-2025",
    price: 69.99,
    payment: "Paid",
    status: "Delivered",
  },
  {
    no: 15,
    orderId: "#ORD0015",
    product: 'Samsung 65" QLED TV',
    emoji: "📺",
    date: "08-01-2025",
    price: 1499.0,
    payment: "Unpaid",
    status: "Cancelled",
  },
  {
    no: 16,
    orderId: "#ORD0016",
    product: "Bose QuietComfort 45",
    emoji: "🎧",
    date: "08-01-2025",
    price: 329.0,
    payment: "Paid",
    status: "Delivered",
  },
  {
    no: 17,
    orderId: "#ORD0017",
    product: "Dell XPS 15",
    emoji: "💻",
    date: "09-01-2025",
    price: 1799.0,
    payment: "Paid",
    status: "Shipped",
  },
  {
    no: 18,
    orderId: "#ORD0018",
    product: "Nintendo Switch OLED",
    emoji: "🎮",
    date: "09-01-2025",
    price: 349.0,
    payment: "Paid",
    status: "Delivered",
  },
  {
    no: 19,
    orderId: "#ORD0019",
    product: "Xbox Series X",
    emoji: "🎮",
    date: "10-01-2025",
    price: 499.0,
    payment: "Unpaid",
    status: "Pending",
  },
  {
    no: 20,
    orderId: "#ORD0020",
    product: "Canon EOS R6",
    emoji: "📷",
    date: "10-01-2025",
    price: 2499.0,
    payment: "Paid",
    status: "Delivered",
  },
  {
    no: 21,
    orderId: "#ORD0021",
    product: "GoPro Hero 12",
    emoji: "📷",
    date: "11-01-2025",
    price: 399.0,
    payment: "Paid",
    status: "Delivered",
  },
  {
    no: 22,
    orderId: "#ORD0022",
    product: "Anker PowerBank 20K",
    emoji: "🔋",
    date: "11-01-2025",
    price: 49.99,
    payment: "Paid",
    status: "Delivered",
  },
  {
    no: 23,
    orderId: "#ORD0023",
    product: "Sony A7 IV Camera",
    emoji: "📷",
    date: "12-01-2025",
    price: 2498.0,
    payment: "Unpaid",
    status: "Pending",
  },
  {
    no: 24,
    orderId: "#ORD0024",
    product: "Microsoft Surface Pro 9",
    emoji: "💻",
    date: "12-01-2025",
    price: 999.0,
    payment: "Paid",
    status: "Shipped",
  },
  {
    no: 25,
    orderId: "#ORD0025",
    product: "Marshall Stanmore II",
    emoji: "🔊",
    date: "13-01-2025",
    price: 379.0,
    payment: "Unpaid",
    status: "Cancelled",
  },
  {
    no: 26,
    orderId: "#ORD0026",
    product: "DJI Mini 4 Pro",
    emoji: "🚁",
    date: "13-01-2025",
    price: 759.0,
    payment: "Paid",
    status: "Delivered",
  },
  {
    no: 27,
    orderId: "#ORD0027",
    product: "Kindle Paperwhite",
    emoji: "📚",
    date: "14-01-2025",
    price: 139.99,
    payment: "Paid",
    status: "Delivered",
  },
  {
    no: 28,
    orderId: "#ORD0028",
    product: "Steam Deck OLED",
    emoji: "🎮",
    date: "14-01-2025",
    price: 549.0,
    payment: "Paid",
    status: "Shipped",
  },
  {
    no: 29,
    orderId: "#ORD0029",
    product: "Garmin Fenix 7",
    emoji: "⌚",
    date: "15-01-2025",
    price: 699.0,
    payment: "Unpaid",
    status: "Pending",
  },
  {
    no: 30,
    orderId: "#ORD0030",
    product: "Razer Blade 15",
    emoji: "💻",
    date: "15-01-2025",
    price: 2299.0,
    payment: "Paid",
    status: "Delivered",
  },
  {
    no: 31,
    orderId: "#ORD0031",
    product: "Beats Studio Pro",
    emoji: "🎧",
    date: "16-01-2025",
    price: 349.99,
    payment: "Paid",
    status: "Delivered",
  },
  {
    no: 32,
    orderId: "#ORD0032",
    product: "Asus ROG Ally",
    emoji: "🎮",
    date: "16-01-2025",
    price: 599.0,
    payment: "Unpaid",
    status: "Cancelled",
  },
  {
    no: 33,
    orderId: "#ORD0033",
    product: "Logitech G915 TKL",
    emoji: "⌨️",
    date: "17-01-2025",
    price: 229.99,
    payment: "Paid",
    status: "Delivered",
  },
  {
    no: 34,
    orderId: "#ORD0034",
    product: "iPhone 15",
    emoji: "📱",
    date: "17-01-2025",
    price: 799.0,
    payment: "Paid",
    status: "Shipped",
  },
  {
    no: 35,
    orderId: "#ORD0035",
    product: "Samsung Galaxy Tab S9",
    emoji: "📱",
    date: "18-01-2025",
    price: 799.0,
    payment: "Unpaid",
    status: "Pending",
  },
  {
    no: 36,
    orderId: "#ORD0036",
    product: "Sennheiser HD 660S2",
    emoji: "🎧",
    date: "18-01-2025",
    price: 599.0,
    payment: "Paid",
    status: "Delivered",
  },
  {
    no: 37,
    orderId: "#ORD0037",
    product: "Meta Quest 3",
    emoji: "🥽",
    date: "19-01-2025",
    price: 499.0,
    payment: "Paid",
    status: "Delivered",
  },
  {
    no: 38,
    orderId: "#ORD0038",
    product: "Acer Predator Helios",
    emoji: "💻",
    date: "19-01-2025",
    price: 1599.0,
    payment: "Unpaid",
    status: "Pending",
  },
  {
    no: 39,
    orderId: "#ORD0039",
    product: "AirTag 4 Pack",
    emoji: "📍",
    date: "20-01-2025",
    price: 99.99,
    payment: "Paid",
    status: "Delivered",
  },
  {
    no: 40,
    orderId: "#ORD0040",
    product: "Corsair K70 RGB",
    emoji: "⌨️",
    date: "20-01-2025",
    price: 169.99,
    payment: "Paid",
    status: "Shipped",
  },
];

const ITEMS_PER_PAGE = 10;

export default function OrderManagement() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState("desc");
  const [filterPayment, setFilterPayment] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const filterRef = useRef(null);
  const sortRef = useRef(null);
  const moreRef = useRef(null);

  /* Mbyll dropdown-et kur klikon jashte */
  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target))
        setShowFilter(false);
      if (sortRef.current && !sortRef.current.contains(e.target))
        setShowSort(false);
      if (moreRef.current && !moreRef.current.contains(e.target))
        setShowMore(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Llogarit porosit e filtruara dhe te sortuara */
  const filteredOrders = useMemo(() => {
    let result = [...ALL_ORDERS];

    if (activeTab === "Completed") {
      result = result.filter((o) => o.status === "Delivered");
    } else if (activeTab === "Pending") {
      result = result.filter(
        (o) => o.status === "Pending" || o.status === "Shipped",
      );
    } else if (activeTab === "Canceled") {
      result = result.filter((o) => o.status === "Cancelled");
    }

    if (filterPayment !== "all") {
      result = result.filter((o) => o.payment === filterPayment);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderId.toLowerCase().includes(q) ||
          o.product.toLowerCase().includes(q),
      );
    }

    if (sortBy === "price") {
      result.sort((a, b) =>
        sortDir === "asc" ? a.price - b.price : b.price - a.price,
      );
    } else if (sortBy === "date") {
      result.sort((a, b) => {
        const cmp = a.date.localeCompare(b.date);
        return sortDir === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }, [activeTab, search, sortBy, sortDir, filterPayment]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE) || 1;
  const currentOrders = filteredOrders.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setPage(1);
  }, [activeTab, search, sortBy, sortDir, filterPayment]);

  const totalCount = ALL_ORDERS.length;
  const newCount = ALL_ORDERS.filter((o) => o.status === "Pending").length;
  const completedCount = ALL_ORDERS.filter(
    (o) => o.status === "Delivered",
  ).length;
  const canceledCount = ALL_ORDERS.filter(
    (o) => o.status === "Cancelled",
  ).length;

  const tabs = [
    { key: "All", label: `All order (${ALL_ORDERS.length})` },
    { key: "Completed", label: "Completed" },
    { key: "Pending", label: "Pending" },
    { key: "Canceled", label: "Canceled" },
  ];

  const statusBadge = (status) => {
    const map = {
      Delivered: { color: "text-primary", icon: "🚚" },
      Shipped: { color: "text-dark", icon: "🚚" },
      Pending: { color: "text-warning", icon: "🚚" },
      Cancelled: { color: "text-danger", icon: "🚚" },
    };
    const cfg = map[status] || { color: "text-muted", icon: "🚚" };
    return (
      <span
        className={`inline-flex items-center gap-1.5 text-sm font-black ${cfg.color}`}
      >
        <span>{cfg.icon}</span>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-5">
      {/* Title + Actions */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-black text-dark">Order List</h2>
        <div className="flex items-center gap-2">
          <button className="bg-primary hover:bg-green-600 text-white font-black text-sm px-5 py-2.5 rounded-full flex items-center gap-2 border-0 cursor-pointer transition-colors">
            ⊕ Add Order
          </button>
          <button className="bg-white border border-bg text-dark font-black text-sm px-5 py-2.5 rounded-full flex items-center gap-2 cursor-pointer hover:bg-bg transition-colors">
            More Action ⋮
          </button>
        </div>
      </div>

      {/* 4 Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-start justify-between mb-2">
            <p className="font-black text-dark">Total Orders</p>
            <button className="text-muted bg-transparent border-0 cursor-pointer">
              ⋮
            </button>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-black text-dark">
              {totalCount.toLocaleString()}
            </span>
            <span className="text-sm text-primary font-black">↑ 14.4%</span>
          </div>
          <p className="text-xs text-muted">Last 7 days</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-start justify-between mb-2">
            <p className="font-black text-dark">New Orders</p>
            <button className="text-muted bg-transparent border-0 cursor-pointer">
              ⋮
            </button>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-black text-dark">{newCount}</span>
            <span className="text-sm text-primary font-black">↑ 20%</span>
          </div>
          <p className="text-xs text-muted">Last 7 days</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-start justify-between mb-2">
            <p className="font-black text-dark">Completed Orders</p>
            <button className="text-muted bg-transparent border-0 cursor-pointer">
              ⋮
            </button>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-black text-dark">
              {completedCount}
            </span>
            <span className="text-sm text-primary font-black">85%</span>
          </div>
          <p className="text-xs text-muted">Last 7 days</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-start justify-between mb-2">
            <p className="font-black text-dark">Canceled Orders</p>
            <button className="text-muted bg-transparent border-0 cursor-pointer">
              ⋮
            </button>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-black text-dark">
              {canceledCount}
            </span>
            <span className="text-sm text-danger font-black">↓ 5%</span>
          </div>
          <p className="text-xs text-muted">Last 7 days</p>
        </div>
      </div>

      {/* Filters bar + Table */}
      <div className="bg-white rounded-2xl p-5 shadow-card">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          {/* Tabs */}
          <div className="flex bg-light/40 rounded-full p-1 gap-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`text-sm font-black px-5 py-2 rounded-full border-0 cursor-pointer transition-colors ${
                  activeTab === t.key
                    ? "bg-white text-dark shadow-card"
                    : "bg-transparent text-muted hover:text-dark"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Search + buttons */}
          <div className="flex items-center gap-2">
            <div className="bg-bg rounded-full px-4 py-2 flex items-center gap-2 w-72">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search order report"
                className="bg-transparent outline-none text-sm flex-1 font-lato"
              />
              <span className="text-muted text-sm">🔍</span>
            </div>

            {/* Filter button */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => {
                  setShowFilter(!showFilter);
                  setShowSort(false);
                  setShowMore(false);
                }}
                className="w-10 h-10 bg-white border border-bg rounded-full flex items-center justify-center hover:bg-bg cursor-pointer transition-colors"
                title="Filter"
              >
                ⚙️
              </button>
              {showFilter && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-hover border border-bg p-3 z-50">
                  <p className="text-xs font-black text-dark mb-2">
                    Filter by payment
                  </p>
                  {["all", "Paid", "Unpaid"].map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setFilterPayment(p);
                        setShowFilter(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-black bg-transparent border-0 cursor-pointer transition-colors ${
                        filterPayment === p
                          ? "bg-primary text-white"
                          : "text-dark hover:bg-bg"
                      }`}
                    >
                      {p === "all" ? "All payments" : p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort button */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => {
                  setShowSort(!showSort);
                  setShowFilter(false);
                  setShowMore(false);
                }}
                className="w-10 h-10 bg-white border border-bg rounded-full flex items-center justify-center hover:bg-bg cursor-pointer transition-colors"
                title="Sort"
              >
                ⇅
              </button>
              {showSort && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-hover border border-bg p-3 z-50">
                  <p className="text-xs font-black text-dark mb-2">Sort by</p>
                  {[
                    {
                      key: "date-desc",
                      label: "Date (newest)",
                      sb: "date",
                      sd: "desc",
                    },
                    {
                      key: "date-asc",
                      label: "Date (oldest)",
                      sb: "date",
                      sd: "asc",
                    },
                    {
                      key: "price-desc",
                      label: "Price (high → low)",
                      sb: "price",
                      sd: "desc",
                    },
                    {
                      key: "price-asc",
                      label: "Price (low → high)",
                      sb: "price",
                      sd: "asc",
                    },
                    { key: "none", label: "Default", sb: null, sd: "desc" },
                  ].map((s) => (
                    <button
                      key={s.key}
                      onClick={() => {
                        setSortBy(s.sb);
                        setSortDir(s.sd);
                        setShowSort(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-black bg-transparent border-0 cursor-pointer transition-colors ${
                        sortBy === s.sb && sortDir === s.sd
                          ? "bg-primary text-white"
                          : "text-dark hover:bg-bg"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* More button */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => {
                  setShowMore(!showMore);
                  setShowFilter(false);
                  setShowSort(false);
                }}
                className="w-10 h-10 bg-white border border-bg rounded-full flex items-center justify-center hover:bg-bg cursor-pointer transition-colors"
                title="More"
              >
                ⋯
              </button>
              {showMore && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-hover border border-bg p-3 z-50">
                  <button
                    onClick={() => {
                      setSearch("");
                      setActiveTab("All");
                      setSortBy(null);
                      setFilterPayment("all");
                      setShowMore(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-black text-dark hover:bg-bg bg-transparent border-0 cursor-pointer"
                  >
                    🗑️ Pastro filtrat
                  </button>
                  <button
                    onClick={() => {
                      alert("Export feature - per t'u implementuar");
                      setShowMore(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-black text-dark hover:bg-bg bg-transparent border-0 cursor-pointer"
                  >
                    📥 Export CSV
                  </button>
                  <button
                    onClick={() => {
                      window.print();
                      setShowMore(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-black text-dark hover:bg-bg bg-transparent border-0 cursor-pointer"
                  >
                    🖨️ Print
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-light/40 text-xs text-dark font-black">
                <th className="text-left px-4 py-3 rounded-l-xl">No.</th>
                <th className="text-left px-2 py-3">Order Id</th>
                <th className="text-left px-2 py-3">Product</th>
                <th className="text-left px-2 py-3">Date</th>
                <th className="text-left px-2 py-3">Price</th>
                <th className="text-left px-2 py-3">Payment</th>
                <th className="text-left px-2 py-3 rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-muted">
                    Asnje porosi nuk u gjet
                  </td>
                </tr>
              ) : (
                currentOrders.map((o) => (
                  <tr key={o.no} className="border-b border-bg text-sm">
                    <td className="px-4 py-3.5">
                      <input
                        type="checkbox"
                        className="accent-primary w-4 h-4 cursor-pointer"
                      />
                      <span className="ml-2 text-dark">1</span>
                    </td>
                    <td className="px-2 py-3.5 text-dark font-black">
                      {o.orderId}
                    </td>
                    <td className="px-2 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 bg-bg rounded-lg flex items-center justify-center text-xl">
                          {o.emoji}
                        </div>
                        <span className="font-black text-dark">
                          {o.product}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-3.5 text-dark">{o.date}</td>
                    <td className="px-2 py-3.5 text-dark">
                      {o.price.toFixed(2)}
                    </td>
                    <td className="px-2 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 font-black ${o.payment === "Paid" ? "text-primary" : "text-danger"}`}
                      >
                        <span className="w-2 h-2 rounded-full bg-current"></span>
                        {o.payment}
                      </span>
                    </td>
                    <td className="px-2 py-3.5">{statusBadge(o.status)}</td>
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
              className="bg-white border border-bg text-dark font-black text-sm px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-bg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
              className="bg-white border border-bg text-dark font-black text-sm px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-bg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
