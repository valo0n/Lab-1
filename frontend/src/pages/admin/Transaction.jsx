/* Transaction — admin page per menaxhimin e transaksioneve */
import { useState, useMemo, useRef, useEffect } from "react";

/* Mock data — 30 transaksione */
const ALL_TRANSACTIONS = [
  {
    id: "#CUST001",
    name: "John Doe",
    date: "01-01-2025",
    total: 2904.0,
    method: "CC",
    status: "Complete",
  },
  {
    id: "#CUST002",
    name: "Jane Smith",
    date: "02-01-2025",
    total: 1450.0,
    method: "PayPal",
    status: "Pending",
  },
  {
    id: "#CUST003",
    name: "Emily Davis",
    date: "02-01-2025",
    total: 3200.0,
    method: "Bank",
    status: "Complete",
  },
  {
    id: "#CUST004",
    name: "Michael Brown",
    date: "03-01-2025",
    total: 890.0,
    method: "CC",
    status: "Canceled",
  },
  {
    id: "#CUST005",
    name: "Sarah Wilson",
    date: "03-01-2025",
    total: 1599.0,
    method: "PayPal",
    status: "Complete",
  },
  {
    id: "#CUST006",
    name: "David Martinez",
    date: "04-01-2025",
    total: 4200.0,
    method: "Bank",
    status: "Complete",
  },
  {
    id: "#CUST007",
    name: "Lisa Anderson",
    date: "04-01-2025",
    total: 750.0,
    method: "CC",
    status: "Pending",
  },
  {
    id: "#CUST008",
    name: "James Taylor",
    date: "05-01-2025",
    total: 2100.0,
    method: "PayPal",
    status: "Complete",
  },
  {
    id: "#CUST009",
    name: "Anna Garcia",
    date: "05-01-2025",
    total: 599.0,
    method: "CC",
    status: "Canceled",
  },
  {
    id: "#CUST010",
    name: "Robert Lee",
    date: "06-01-2025",
    total: 3850.0,
    method: "Bank",
    status: "Complete",
  },
  {
    id: "#CUST011",
    name: "Maria Rodriguez",
    date: "06-01-2025",
    total: 1299.0,
    method: "CC",
    status: "Complete",
  },
  {
    id: "#CUST012",
    name: "Thomas Walker",
    date: "07-01-2025",
    total: 999.0,
    method: "PayPal",
    status: "Pending",
  },
  {
    id: "#CUST013",
    name: "Olivia Hall",
    date: "07-01-2025",
    total: 2499.0,
    method: "Bank",
    status: "Complete",
  },
  {
    id: "#CUST014",
    name: "Daniel Young",
    date: "08-01-2025",
    total: 449.0,
    method: "CC",
    status: "Canceled",
  },
  {
    id: "#CUST015",
    name: "Sophia King",
    date: "08-01-2025",
    total: 1799.0,
    method: "PayPal",
    status: "Complete",
  },
  {
    id: "#CUST016",
    name: "Matthew Wright",
    date: "09-01-2025",
    total: 2199.0,
    method: "CC",
    status: "Complete",
  },
  {
    id: "#CUST017",
    name: "Ava Scott",
    date: "09-01-2025",
    total: 1099.0,
    method: "Bank",
    status: "Pending",
  },
  {
    id: "#CUST018",
    name: "Christopher Green",
    date: "10-01-2025",
    total: 3499.0,
    method: "PayPal",
    status: "Complete",
  },
  {
    id: "#CUST019",
    name: "Isabella Adams",
    date: "10-01-2025",
    total: 879.0,
    method: "CC",
    status: "Complete",
  },
  {
    id: "#CUST020",
    name: "Andrew Baker",
    date: "11-01-2025",
    total: 1599.0,
    method: "Bank",
    status: "Canceled",
  },
  {
    id: "#CUST021",
    name: "Mia Nelson",
    date: "11-01-2025",
    total: 2299.0,
    method: "PayPal",
    status: "Complete",
  },
  {
    id: "#CUST022",
    name: "Joshua Carter",
    date: "12-01-2025",
    total: 1399.0,
    method: "CC",
    status: "Pending",
  },
  {
    id: "#CUST023",
    name: "Charlotte Mitchell",
    date: "12-01-2025",
    total: 4499.0,
    method: "Bank",
    status: "Complete",
  },
  {
    id: "#CUST024",
    name: "Ryan Perez",
    date: "13-01-2025",
    total: 699.0,
    method: "CC",
    status: "Complete",
  },
  {
    id: "#CUST025",
    name: "Amelia Roberts",
    date: "13-01-2025",
    total: 1899.0,
    method: "PayPal",
    status: "Canceled",
  },
  {
    id: "#CUST026",
    name: "Brandon Turner",
    date: "14-01-2025",
    total: 2799.0,
    method: "Bank",
    status: "Complete",
  },
  {
    id: "#CUST027",
    name: "Harper Phillips",
    date: "14-01-2025",
    total: 549.0,
    method: "CC",
    status: "Complete",
  },
  {
    id: "#CUST028",
    name: "Jason Campbell",
    date: "15-01-2025",
    total: 3299.0,
    method: "PayPal",
    status: "Pending",
  },
  {
    id: "#CUST029",
    name: "Evelyn Parker",
    date: "15-01-2025",
    total: 1199.0,
    method: "Bank",
    status: "Complete",
  },
  {
    id: "#CUST030",
    name: "Kevin Evans",
    date: "16-01-2025",
    total: 2099.0,
    method: "CC",
    status: "Canceled",
  },
];

const ITEMS_PER_PAGE = 10;

export default function Transaction() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState("desc");
  const [filterMethod, setFilterMethod] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [cardActive, setCardActive] = useState(true);

  const filterRef = useRef(null);
  const sortRef = useRef(null);
  const moreRef = useRef(null);

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

  /* Filtro */
  const filtered = useMemo(() => {
    let result = [...ALL_TRANSACTIONS];

    if (activeTab === "Completed")
      result = result.filter((t) => t.status === "Complete");
    else if (activeTab === "Pending")
      result = result.filter((t) => t.status === "Pending");
    else if (activeTab === "Canceled")
      result = result.filter((t) => t.status === "Canceled");

    if (filterMethod !== "all")
      result = result.filter((t) => t.method === filterMethod);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.name.toLowerCase().includes(q) ||
          t.method.toLowerCase().includes(q),
      );
    }

    if (sortBy === "total") {
      result.sort((a, b) =>
        sortDir === "asc" ? a.total - b.total : b.total - a.total,
      );
    } else if (sortBy === "date") {
      result.sort((a, b) => {
        const cmp = a.date.localeCompare(b.date);
        return sortDir === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }, [activeTab, search, sortBy, sortDir, filterMethod]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const current = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setPage(1);
  }, [activeTab, search, sortBy, sortDir, filterMethod]);

  /* Status color */
  const statusColor = (s) => {
    if (s === "Complete") return "text-primary";
    if (s === "Pending") return "text-warning";
    return "text-danger";
  };

  /* Numerime per tabs */
  const tabs = [
    { key: "All", label: `All order (${ALL_TRANSACTIONS.length})` },
    { key: "Completed", label: "Completed" },
    { key: "Pending", label: "Pending" },
    { key: "Canceled", label: "Canceled" },
  ];

  return (
    <div className="space-y-5">
      {/* ── TOP: 4 Stat cards (2x2 grid) + Payment Method ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 4 Stat cards in 2x2 grid - takes 2 cols */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-card">
            <div className="flex items-start justify-between mb-2">
              <p className="font-black text-dark">Total Revenue</p>
              <button className="text-muted bg-transparent border-0 cursor-pointer">
                ⋮
              </button>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-black text-dark">$15,045</span>
              <span className="text-sm text-primary font-black">↑ 14.4%</span>
            </div>
            <p className="text-xs text-muted">Last 7 days</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-card">
            <div className="flex items-start justify-between mb-2">
              <p className="font-black text-dark">Completed Transactions</p>
              <button className="text-muted bg-transparent border-0 cursor-pointer">
                ⋮
              </button>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-black text-dark">3,150</span>
              <span className="text-sm text-primary font-black">↑ 20%</span>
            </div>
            <p className="text-xs text-muted">Last 7 days</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-card">
            <div className="flex items-start justify-between mb-2">
              <p className="font-black text-dark">Pending Transactions</p>
              <button className="text-muted bg-transparent border-0 cursor-pointer">
                ⋮
              </button>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-black text-dark">150</span>
              <span className="text-sm text-primary font-black">85%</span>
            </div>
            <p className="text-xs text-muted">Last 7 days</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-card">
            <div className="flex items-start justify-between mb-2">
              <p className="font-black text-dark">Failed Transactions</p>
              <button className="text-muted bg-transparent border-0 cursor-pointer">
                ⋮
              </button>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-black text-dark">75</span>
              <span className="text-sm text-danger font-black">15%</span>
            </div>
            <p className="text-xs text-muted">Last 7 days</p>
          </div>
        </div>

        {/* Payment Method card */}
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-start justify-between mb-4">
            <p className="font-black text-dark text-base">Payment Method</p>
            <button className="text-muted bg-transparent border-0 cursor-pointer">
              ⋮
            </button>
          </div>

          {/* Credit card visual */}
          <div className="bg-gradient-to-br from-primary via-emerald-500 to-emerald-700 rounded-2xl p-5 text-white mb-4 relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10"></div>
            <div className="absolute right-4 top-4 flex">
              <div className="w-6 h-6 rounded-full bg-white/40"></div>
              <div className="w-6 h-6 rounded-full bg-white/60 -ml-2"></div>
            </div>

            <p className="text-lg font-black mb-8">Finaci</p>
            <p className="text-lg font-black tracking-widest mb-4">
              **** **** **** 2345
            </p>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs opacity-75 mb-0.5">Card Holder name</p>
                <p className="font-black text-sm">Noman Manzoor</p>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-75 mb-0.5">Expiry Date</p>
                <p className="font-black text-sm">02/30</p>
              </div>
            </div>
          </div>

          {/* Card info */}
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Status:</span>
              <span
                className={`font-black ${cardActive ? "text-primary" : "text-danger"}`}
              >
                {cardActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Transactions:</span>
              <span className="font-black text-dark">1,250</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Revenue:</span>
              <span className="font-black text-dark">$50,000</span>
            </div>
            <button
              onClick={() => alert("Hape modal-in e transaksioneve")}
              className="text-primary text-sm font-black bg-transparent border-0 cursor-pointer hover:underline w-full text-left mt-1"
            >
              View Transactions →
            </button>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => alert("Shto kart te re")}
              className="flex-1 border-2 border-bg text-dark font-black text-sm py-2.5 rounded-xl cursor-pointer hover:bg-bg transition-colors flex items-center justify-center gap-2"
            >
              ⊕ Add Card
            </button>
            <button
              onClick={() => setCardActive(!cardActive)}
              className={`flex-1 font-black text-sm py-2.5 rounded-xl cursor-pointer transition-colors border-2 ${
                cardActive
                  ? "border-red-200 bg-red-50 text-danger hover:bg-red-100"
                  : "border-primary bg-primary/10 text-primary hover:bg-primary/20"
              }`}
            >
              {cardActive ? "Deactivate" : "Activate"}
            </button>
          </div>
        </div>
      </div>

      {/* ── BOTTOM: Transactions Table ── */}
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
                placeholder="Search payment history"
                className="bg-transparent outline-none text-sm flex-1 font-lato"
              />
              <span className="text-muted text-sm">🔍</span>
            </div>

            {/* Filter */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => {
                  setShowFilter(!showFilter);
                  setShowSort(false);
                  setShowMore(false);
                }}
                className="w-10 h-10 bg-white border border-bg rounded-full flex items-center justify-center hover:bg-bg cursor-pointer transition-colors"
              >
                ⚙️
              </button>
              {showFilter && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-hover border border-bg p-3 z-50">
                  <p className="text-xs font-black text-dark mb-2">
                    Filter by method
                  </p>
                  {["all", "CC", "PayPal", "Bank"].map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setFilterMethod(m);
                        setShowFilter(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-black bg-transparent border-0 cursor-pointer transition-colors ${
                        filterMethod === m
                          ? "bg-primary text-white"
                          : "text-dark hover:bg-bg"
                      }`}
                    >
                      {m === "all" ? "All methods" : m}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => {
                  setShowSort(!showSort);
                  setShowFilter(false);
                  setShowMore(false);
                }}
                className="w-10 h-10 bg-white border border-bg rounded-full flex items-center justify-center hover:bg-bg cursor-pointer transition-colors"
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
                      key: "total-desc",
                      label: "Total (high → low)",
                      sb: "total",
                      sd: "desc",
                    },
                    {
                      key: "total-asc",
                      label: "Total (low → high)",
                      sb: "total",
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

            {/* More */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => {
                  setShowMore(!showMore);
                  setShowFilter(false);
                  setShowSort(false);
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
                      setSortBy(null);
                      setFilterMethod("all");
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
                <th className="text-left px-4 py-3 rounded-l-xl">
                  Customer Id
                </th>
                <th className="text-left px-2 py-3">Name</th>
                <th className="text-left px-2 py-3">Date</th>
                <th className="text-left px-2 py-3">Total</th>
                <th className="text-left px-2 py-3">Method</th>
                <th className="text-left px-2 py-3">Status</th>
                <th className="text-left px-2 py-3 rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody>
              {current.length === 0 ? (
                <tr>
                  <td c olSpan="7" className="text-center py-10 text-muted">
                    Asnje transaksion nuk u gjet
                  </td>
                </tr>
              ) : (
                current.map((t, i) => (
                  <tr key={t.id + i} className="border-b border-bg text-sm">
                    <td className="px-4 py-3.5 text-dark">{t.id}</td>
                    <td className="px-2 py-3.5 text-dark font-black">
                      {t.name}
                    </td>
                    <td className="px-2 py-3.5 text-dark">{t.date}</td>
                    <td className="px-2 py-3.5 text-dark font-black">
                      $
                      {t.total.toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                      })}
                    </td>
                    <td className="px-2 py-3.5 text-dark">{t.method}</td>
                    <td className="px-2 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 font-black ${statusColor(t.status)}`}
                      >
                        <span className="w-2 h-2 rounded-full bg-current"></span>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-2 py-3.5">
                      <button
                        onClick={() =>
                          alert(
                            `Detajet per ${t.name}\nID: ${t.id}\nTotal: $${t.total}`,
                          )
                        }
                        className="text-primary text-sm font-black bg-transparent border-0 cursor-pointer hover:underline"
                      >
                        View Details
                      </button>
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
