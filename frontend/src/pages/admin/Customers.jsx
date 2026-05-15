/* Customers — admin page per menaxhimin e klienteve */
import { useState, useMemo } from "react";

/* Mock data - 30 kliente */
const ALL_CUSTOMERS = [
  {
    id: "#CUST001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    address: "123 Main St, NY",
    orders: 25,
    spent: 3450.0,
    status: "Active",
    reg: "15.01.2025",
    lastBuy: "10.01.2025",
    total: 150,
    completed: 140,
    canceled: 10,
    avatar: "👨",
  },
  {
    id: "#CUST002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1234567891",
    address: "456 Oak Ave, LA",
    orders: 5,
    spent: 250.0,
    status: "Inactive",
    reg: "10.02.2025",
    lastBuy: "15.02.2025",
    total: 5,
    completed: 4,
    canceled: 1,
    avatar: "👩",
  },
  {
    id: "#CUST003",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "+1234567892",
    address: "789 Pine Rd, TX",
    orders: 30,
    spent: 4600.0,
    status: "VIP",
    reg: "01.01.2025",
    lastBuy: "20.01.2025",
    total: 180,
    completed: 175,
    canceled: 5,
    avatar: "👩",
  },
  {
    id: "#CUST004",
    name: "Michael Brown",
    email: "michael.b@example.com",
    phone: "+1234567893",
    address: "321 Elm St, FL",
    orders: 18,
    spent: 2100.0,
    status: "Active",
    reg: "05.01.2025",
    lastBuy: "12.01.2025",
    total: 80,
    completed: 75,
    canceled: 5,
    avatar: "👨",
  },
  {
    id: "#CUST005",
    name: "Sarah Wilson",
    email: "sarah.w@example.com",
    phone: "+1234567894",
    address: "654 Maple Dr, WA",
    orders: 12,
    spent: 890.0,
    status: "Active",
    reg: "20.01.2025",
    lastBuy: "18.01.2025",
    total: 45,
    completed: 42,
    canceled: 3,
    avatar: "👩",
  },
  {
    id: "#CUST006",
    name: "David Martinez",
    email: "david.m@example.com",
    phone: "+1234567895",
    address: "987 Cedar Ln, AZ",
    orders: 35,
    spent: 5200.0,
    status: "VIP",
    reg: "10.01.2025",
    lastBuy: "22.01.2025",
    total: 200,
    completed: 195,
    canceled: 5,
    avatar: "👨",
  },
  {
    id: "#CUST007",
    name: "Lisa Anderson",
    email: "lisa.a@example.com",
    phone: "+1234567896",
    address: "159 Birch Way, CO",
    orders: 3,
    spent: 150.0,
    status: "Inactive",
    reg: "25.01.2025",
    lastBuy: "26.01.2025",
    total: 3,
    completed: 3,
    canceled: 0,
    avatar: "👩",
  },
  {
    id: "#CUST008",
    name: "James Taylor",
    email: "james.t@example.com",
    phone: "+1234567897",
    address: "753 Spruce St, OR",
    orders: 22,
    spent: 3100.0,
    status: "Active",
    reg: "08.01.2025",
    lastBuy: "19.01.2025",
    total: 95,
    completed: 90,
    canceled: 5,
    avatar: "👨",
  },
  {
    id: "#CUST009",
    name: "Anna Garcia",
    email: "anna.g@example.com",
    phone: "+1234567898",
    address: "246 Willow Ct, NV",
    orders: 8,
    spent: 620.0,
    status: "Active",
    reg: "15.02.2025",
    lastBuy: "21.02.2025",
    total: 25,
    completed: 23,
    canceled: 2,
    avatar: "👩",
  },
  {
    id: "#CUST010",
    name: "Robert Lee",
    email: "robert.l@example.com",
    phone: "+1234567899",
    address: "864 Ash Pl, MA",
    orders: 28,
    spent: 4200.0,
    status: "VIP",
    reg: "03.01.2025",
    lastBuy: "23.01.2025",
    total: 160,
    completed: 155,
    canceled: 5,
    avatar: "👨",
  },
];

const ITEMS_PER_PAGE = 10;

export default function Customers() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [overviewTab, setOverviewTab] = useState("active");
  const [periodTab, setPeriodTab] = useState("this");
  const [selectedId, setSelectedId] = useState("#CUST001");

  /* Filtro klientet */
  const filteredCustomers = useMemo(() => {
    if (!search.trim()) return ALL_CUSTOMERS;
    const q = search.toLowerCase();
    return ALL_CUSTOMERS.filter(
      (c) =>
        c.id.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q),
    );
  }, [search]);

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE) || 1;
  const currentCustomers = filteredCustomers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  /* Klienti i zgjedhur per panel-in djathtas */
  const selected =
    ALL_CUSTOMERS.find((c) => c.id === selectedId) || ALL_CUSTOMERS[0];

  /* Status colors */
  const statusColor = (s) => {
    if (s === "Active") return "text-primary";
    if (s === "VIP") return "text-warning";
    return "text-danger";
  };

  return (
    <div className="space-y-5">
      {/* ── TOP: 3 Stat cards (col 1) + Customer Overview (col 2) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 3 Stat cards stacked */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-card">
            <div className="flex items-start justify-between mb-3">
              <p className="font-black text-dark">Total Customers</p>
              <button className="text-muted bg-transparent border-0 cursor-pointer">
                ⋮
              </button>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-dark">11,040</span>
              <span className="text-sm text-primary font-black">↑ 14.4%</span>
            </div>
            <p className="text-xs text-muted mt-1">Last 7 days</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-card">
            <div className="flex items-start justify-between mb-3">
              <p className="font-black text-dark">New Customers</p>
              <button className="text-muted bg-transparent border-0 cursor-pointer">
                ⋮
              </button>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-dark">2,370</span>
              <span className="text-sm text-primary font-black">↑ 20%</span>
            </div>
            <p className="text-xs text-muted mt-1">Last 7 days</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-card">
            <div className="flex items-start justify-between mb-3">
              <p className="font-black text-dark">Visitor</p>
              <button className="text-muted bg-transparent border-0 cursor-pointer">
                ⋮
              </button>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-dark">250k</span>
              <span className="text-sm text-primary font-black">↑ 20%</span>
            </div>
            <p className="text-xs text-muted mt-1">Last 7 days</p>
          </div>
        </div>

        {/* Customer Overview chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <p className="font-black text-dark text-base">Customer Overview</p>
            <div className="flex items-center gap-2">
              <div className="flex bg-bg rounded-full p-1 gap-1">
                <button
                  onClick={() => setPeriodTab("this")}
                  className={`text-xs font-black px-3 py-1 rounded-full border-0 cursor-pointer transition-colors ${
                    periodTab === "this"
                      ? "bg-light text-dark"
                      : "text-muted bg-transparent"
                  }`}
                >
                  This week
                </button>
                <button
                  onClick={() => setPeriodTab("last")}
                  className={`text-xs font-black px-3 py-1 rounded-full border-0 cursor-pointer transition-colors ${
                    periodTab === "last"
                      ? "bg-light text-dark"
                      : "text-muted bg-transparent"
                  }`}
                >
                  Last week
                </button>
              </div>
              <button className="text-muted bg-transparent border-0 cursor-pointer text-xl">
                ⋮
              </button>
            </div>
          </div>

          {/* 4 tabs me numra */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { key: "active", num: "25k", label: "Active Customers" },
              { key: "repeat", num: "5.6k", label: "Repeat Customers" },
              { key: "visitor", num: "250k", label: "Shop Visitor" },
              { key: "conv", num: "5.5%", label: "Conversion Rate" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setOverviewTab(t.key)}
                className={`text-left pb-2 border-0 bg-transparent cursor-pointer transition-colors ${
                  overviewTab === t.key
                    ? "border-b-2 border-primary"
                    : "border-b-2 border-transparent"
                }`}
              >
                <p className="text-xl font-black text-dark">{t.num}</p>
                <p className="text-xs text-muted">{t.label}</p>
              </button>
            ))}
          </div>

          {/* Chart */}
          <div className="relative h-56">
            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs text-muted">
              <span>50k</span>
              <span>40k</span>
              <span>30k</span>
              <span>20k</span>
              <span>10k</span>
              <span>0k</span>
            </div>

            <svg
              className="absolute left-10 right-0 top-0 bottom-6 w-[calc(100%-2.5rem)] h-[calc(100%-1.5rem)]"
              viewBox="0 0 600 200"
              preserveAspectRatio="none"
            >
              <path
                d="M 0 130 L 100 130 L 200 80 L 300 90 L 300 40 L 400 40 L 500 120 L 600 60 L 600 200 L 0 200 Z"
                fill="#4ea674"
                opacity="0.15"
              />
              <path
                d="M 0 130 L 100 130 L 200 80 L 300 90 L 300 40 L 400 40 L 500 120 L 600 60"
                stroke="#4ea674"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="300"
                y1="40"
                x2="300"
                y2="200"
                stroke="#4ea674"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.4"
              />
              <circle
                cx="300"
                cy="40"
                r="6"
                fill="white"
                stroke="#4ea674"
                strokeWidth="3"
              />
            </svg>

            <div
              className="absolute"
              style={{ left: "calc(50% - 35px)", top: "10px" }}
            >
              <div className="bg-light text-dark text-xs font-black px-3 py-1.5 rounded-lg shadow-md text-center">
                Thursday
                <br />
                25,409
              </div>
            </div>

            <div className="absolute left-10 right-0 bottom-0 grid grid-cols-7 text-xs text-muted text-center">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span className="font-black text-dark">Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM: Customer Details Table (col 1-2) + Customer Panel (col 3) ── */}
      <div className="space-y-3">
        <h2 className="text-xl font-black text-dark">Customer Details</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-card">
            {/* Search */}
            <div className="mb-4">
              <div className="bg-bg rounded-full px-4 py-2 flex items-center gap-2 max-w-md">
                <span className="text-muted text-sm">🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search customer..."
                  className="bg-transparent outline-none text-sm flex-1 font-lato"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-light/40 text-xs text-dark font-black">
                    <th className="text-left px-3 py-3 rounded-l-xl">
                      Customer Id
                    </th>
                    <th className="text-left px-2 py-3">Name</th>
                    <th className="text-left px-2 py-3">Phone</th>
                    <th className="text-left px-2 py-3">Order Count</th>
                    <th className="text-left px-2 py-3">Total Spend</th>
                    <th className="text-left px-2 py-3">Status</th>
                    <th className="text-left px-2 py-3 rounded-r-xl">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCustomers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-10 text-muted">
                        Asnje klient nuk u gjet
                      </td>
                    </tr>
                  ) : (
                    currentCustomers.map((c) => (
                      <tr
                        key={c.id + Math.random()}
                        onClick={() => setSelectedId(c.id)}
                        className={`border-b border-bg text-sm cursor-pointer transition-colors ${
                          selectedId === c.id ? "bg-bg/50" : "hover:bg-bg/30"
                        }`}
                      >
                        <td className="px-3 py-3.5 text-dark">{c.id}</td>
                        <td className="px-2 py-3.5 text-dark font-black">
                          {c.name}
                        </td>
                        <td className="px-2 py-3.5 text-dark">{c.phone}</td>
                        <td className="px-2 py-3.5 text-dark">{c.orders}</td>
                        <td className="px-2 py-3.5 text-dark">
                          {c.spent.toFixed(2)}
                        </td>
                        <td className="px-2 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 font-black ${statusColor(c.status)}`}
                          >
                            <span className="w-2 h-2 rounded-full bg-current"></span>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-2 py-3.5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                alert(`Mesazh per ${c.name}`);
                              }}
                              className="text-muted hover:text-primary bg-transparent border-0 cursor-pointer text-lg"
                              title="Mesazh"
                            >
                              💬
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Fshi ${c.name}?`))
                                  alert("Klienti u fshi");
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
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
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
                    ),
                  )}
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

          {/* Customer Detail Panel — djathtas */}
          <div className="bg-white rounded-2xl p-5 shadow-card h-fit">
            {/* Header me avatar + emer */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-14 h-14 rounded-full bg-bg flex items-center justify-center text-3xl">
                {selected.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-dark">{selected.name}</p>
                <p className="text-xs text-muted truncate">{selected.email}</p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selected.email);
                  alert("U kopjua emaili!");
                }}
                className="text-muted hover:text-primary bg-transparent border-0 cursor-pointer text-lg"
                title="Kopjo"
              >
                📋
              </button>
            </div>

            {/* Customer Info */}
            <p className="text-xs font-black text-muted mb-2">Customer Info</p>
            <div className="space-y-2 mb-5">
              <div className="bg-bg rounded-xl px-3 py-2.5 flex items-center gap-2">
                <span>📞</span>
                <span className="text-sm text-dark">{selected.phone}</span>
              </div>
              <div className="bg-bg rounded-xl px-3 py-2.5 flex items-center gap-2">
                <span>📍</span>
                <span className="text-sm text-dark">{selected.address}</span>
              </div>
            </div>

            {/* Social Media */}
            <p className="text-xs font-black text-muted mb-2">Social Media</p>
            <div className="flex gap-2 mb-5">
              {["📘", "💬", "🐦", "💼", "📷"].map((icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 bg-bg rounded-full flex items-center justify-center text-base border-0 cursor-pointer hover:bg-light transition-colors"
                >
                  {icon}
                </button>
              ))}
            </div>

            {/* Activity */}
            <p className="text-xs font-black text-muted mb-2">Activity</p>
            <div className="space-y-1.5 mb-5">
              <p className="text-sm text-dark">
                Registration: <span className="font-black">{selected.reg}</span>
              </p>
              <p className="text-sm text-dark">
                Last purchase:{" "}
                <span className="font-black">{selected.lastBuy}</span>
              </p>
            </div>

            {/* Order overview */}
            <p className="text-xs font-black text-muted mb-2">Order overview</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="border border-bg rounded-xl p-3 text-center">
                <p className="text-xl font-black text-dark">{selected.total}</p>
                <p className="text-xs text-primary">Total order</p>
              </div>
              <div className="border border-bg rounded-xl p-3 text-center">
                <p className="text-xl font-black text-dark">
                  {selected.completed}
                </p>
                <p className="text-xs text-primary">Completed</p>
              </div>
              <div className="border border-bg rounded-xl p-3 text-center">
                <p className="text-xl font-black text-dark">
                  {selected.canceled}
                </p>
                <p className="text-xs text-danger">Canceled</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
