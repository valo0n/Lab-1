/* Dashboard — admin dashboard ne ngjyra Paradox jeshile */
import { useState } from "react";

/* Mock data */
const TRANSACTIONS = [
  {
    no: 1,
    id: "#6545",
    date: "01 Oct | 11:29 am",
    status: "Paid",
    amount: "$64",
  },
  {
    no: 2,
    id: "#5412",
    date: "01 Oct | 11:29 am",
    status: "Pending",
    amount: "$557",
  },
  {
    no: 3,
    id: "#6622",
    date: "01 Oct | 11:29 am",
    status: "Paid",
    amount: "$156",
  },
  {
    no: 4,
    id: "#6462",
    date: "01 Oct | 11:29 am",
    status: "Paid",
    amount: "$265",
  },
  {
    no: 5,
    id: "#6462",
    date: "01 Oct | 11:29 am",
    status: "Paid",
    amount: "$265",
  },
];

const TOP_PRODUCTS = [
  { name: "Apple iPhone 13", id: "#FXZ-4567", price: "$999.00", emoji: "📱" },
  { name: "Nike Air Jordan", id: "#FXZ-4567", price: "$72.40", emoji: "👟" },
  { name: "T-shirt", id: "#FXZ-4567", price: "$35.40", emoji: "👕" },
  { name: "Assorted Cross Bag", id: "#FXZ-4567", price: "$80.00", emoji: "👜" },
];

const BEST_SELLING = [
  {
    name: "Apple iPhone 13",
    total: 104,
    status: "Stock",
    price: "$999.00",
    emoji: "📱",
    inStock: true,
  },
  {
    name: "Nike Air Jordan",
    total: 56,
    status: "Stock out",
    price: "$999.00",
    emoji: "👟",
    inStock: false,
  },
  {
    name: "T-shirt",
    total: 266,
    status: "Stock",
    price: "$999.00",
    emoji: "👕",
    inStock: true,
  },
  {
    name: "Cross Bag",
    total: 506,
    status: "Stock",
    price: "$999.00",
    emoji: "👜",
    inStock: true,
  },
];

const NEW_PRODUCTS = [
  { name: "Smart Fitness Tracker", price: "$39.99", emoji: "⌚" },
  { name: "Leather Wallet", price: "$19.99", emoji: "👛" },
  { name: "Electric Hair Trimmer", price: "$34.99", emoji: "💈" },
];

export default function Dashboard() {
  const [reportTab, setReportTab] = useState("this");

  return (
    <div className="space-y-5">
      {/* ── ROW 1: 3 Stat cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total Sales */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-black text-dark text-base">Total Sales</p>
              <p className="text-xs text-muted mt-1">Last 7 days</p>
            </div>
            <button className="text-muted bg-transparent border-0 cursor-pointer text-xl">
              ⋮
            </button>
          </div>
          <div className="flex items-baseline gap-2 my-4">
            <span className="text-3xl font-black text-dark">$350K</span>
            <span className="text-sm text-muted">Sales</span>
            <span className="text-sm text-primary font-black">↑ 10.4%</span>
          </div>
          <p className="text-xs text-muted mb-4">
            Previous 7days <span className="font-black text-dark">($235)</span>
          </p>
          <button className="w-full border-2 border-primary text-primary font-black py-2.5 rounded-full hover:bg-bg cursor-pointer transition-colors text-sm">
            Details
          </button>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-black text-dark text-base">Total Orders</p>
              <p className="text-xs text-muted mt-1">Last 7 days</p>
            </div>
            <button className="text-muted bg-transparent border-0 cursor-pointer text-xl">
              ⋮
            </button>
          </div>
          <div className="flex items-baseline gap-2 my-4">
            <span className="text-3xl font-black text-dark">10.7K</span>
            <span className="text-sm text-muted">order</span>
            <span className="text-sm text-primary font-black">↑ 14.4%</span>
          </div>
          <p className="text-xs text-muted mb-4">
            Previous 7days <span className="font-black text-dark">(7.6k)</span>
          </p>
          <button className="w-full border-2 border-primary text-primary font-black py-2.5 rounded-full hover:bg-bg cursor-pointer transition-colors text-sm">
            Details
          </button>
        </div>

        {/* Pending & Canceled */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-black text-dark text-base">
                Pending & Canceled
              </p>
              <p className="text-xs text-muted mt-1">Last 7 days</p>
            </div>
            <button className="text-muted bg-transparent border-0 cursor-pointer text-xl">
              ⋮
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 my-4">
            <div>
              <p className="text-xs text-muted mb-1">Pending</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-dark">509</span>
                <span className="text-xs text-muted">user 204</span>
              </div>
            </div>
            <div className="border-l border-bg pl-4">
              <p className="text-xs text-muted mb-1">Canceled</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-danger">94</span>
                <span className="text-xs text-danger">↓ 14.4%</span>
              </div>
            </div>
          </div>
          <button className="w-full border-2 border-primary text-primary font-black py-2.5 rounded-full hover:bg-bg cursor-pointer transition-colors text-sm">
            Details
          </button>
        </div>
      </div>

      {/* ── ROW 2: Report (2 cols) + Users (1 col) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Report for this week */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <p className="font-black text-dark text-base">
              Report for this week
            </p>
            <div className="flex items-center gap-2">
              <div className="flex bg-bg rounded-full p-1 gap-1">
                <button
                  onClick={() => setReportTab("this")}
                  className={`text-xs font-black px-3 py-1 rounded-full border-0 cursor-pointer transition-colors ${
                    reportTab === "this"
                      ? "bg-light text-dark"
                      : "text-muted bg-transparent"
                  }`}
                >
                  This week
                </button>
                <button
                  onClick={() => setReportTab("last")}
                  className={`text-xs font-black px-3 py-1 rounded-full border-0 cursor-pointer transition-colors ${
                    reportTab === "last"
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

          {/* Tabs me numra */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <div className="border-b-2 border-primary pb-2">
              <p className="text-xl font-black text-dark">52k</p>
              <p className="text-xs text-muted">Customers</p>
            </div>
            <div className="pb-2">
              <p className="text-xl font-black text-dark">3.5k</p>
              <p className="text-xs text-muted">Total Products</p>
            </div>
            <div className="pb-2">
              <p className="text-xl font-black text-dark">2.5k</p>
              <p className="text-xs text-muted">Stock Products</p>
            </div>
            <div className="pb-2">
              <p className="text-xl font-black text-dark">0.5k</p>
              <p className="text-xs text-muted">Out of Stock</p>
            </div>
            <div className="pb-2">
              <p className="text-xl font-black text-dark">250k</p>
              <p className="text-xs text-muted">Revenue</p>
            </div>
          </div>

          {/* Chart */}
          <div className="relative h-56">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs text-muted">
              <span>50k</span>
              <span>40k</span>
              <span>30k</span>
              <span>20k</span>
              <span>10k</span>
              <span>0k</span>
            </div>

            {/* SVG Chart */}
            <svg
              className="absolute left-10 right-0 top-0 bottom-6 w-[calc(100%-2.5rem)] h-[calc(100%-1.5rem)]"
              viewBox="0 0 600 200"
              preserveAspectRatio="none"
            >
              <path
                d="M 0 150 L 100 150 L 200 100 L 300 130 L 300 80 L 400 80 L 500 130 L 600 110 L 600 200 L 0 200 Z"
                fill="#4ea674"
                opacity="0.15"
              />
              <path
                d="M 0 150 L 100 150 L 200 100 L 300 130 L 300 80 L 400 80 L 500 130 L 600 110"
                stroke="#4ea674"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="300"
                y1="80"
                x2="300"
                y2="200"
                stroke="#4ea674"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.4"
              />
              <circle
                cx="300"
                cy="80"
                r="6"
                fill="white"
                stroke="#4ea674"
                strokeWidth="3"
              />
            </svg>

            {/* Tooltip */}
            <div
              className="absolute"
              style={{ left: "calc(50% - 30px)", top: "20px" }}
            >
              <div className="bg-light text-dark text-xs font-black px-3 py-1.5 rounded-lg shadow-md text-center">
                Thursday
                <br />
                14k
              </div>
            </div>

            {/* X-axis labels */}
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

        {/* Users in last 30 minutes */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-start justify-between mb-2">
            <p className="font-black text-dark text-base">
              Users in last 30 minutes
            </p>
            <button className="text-muted bg-transparent border-0 cursor-pointer text-xl">
              ⋮
            </button>
          </div>
          <p className="text-3xl font-black text-dark mb-1">21.5K</p>
          <p className="text-xs text-muted mb-3">Users per minute</p>

          {/* Bars */}
          <div className="flex items-end gap-1 h-16 mb-5">
            {[
              40, 60, 80, 50, 70, 90, 60, 75, 85, 70, 65, 80, 70, 90, 60, 75,
              85, 70, 80, 90, 70, 85, 60, 75,
            ].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-primary rounded-sm"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>

          {/* Sales by country */}
          <div className="border-t border-bg pt-4">
            <div className="flex justify-between items-center mb-3">
              <p className="font-black text-dark text-sm">Sales by Country</p>
              <p className="text-xs text-muted">Sales</p>
            </div>

            {[
              {
                flag: "🇺🇸",
                country: "US",
                value: "30k",
                percent: 26,
                up: true,
                label: "25.8%",
              },
              {
                flag: "🇧🇷",
                country: "Brazil",
                value: "30k",
                percent: 16,
                up: false,
                label: "15.8%",
              },
              {
                flag: "🇦🇺",
                country: "Australia",
                value: "25k",
                percent: 36,
                up: true,
                label: "35.8%",
              },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <span className="text-xl">{c.flag}</span>
                <div className="w-12">
                  <p className="text-sm font-black text-dark">{c.value}</p>
                  <p className="text-xs text-muted">{c.country}</p>
                </div>
                <div className="flex-1 h-1.5 bg-bg rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${c.percent}%` }}
                  />
                </div>
                <span
                  className={`text-xs font-black ${c.up ? "text-primary" : "text-danger"}`}
                >
                  {c.up ? "↑" : "↓"} {c.label}
                </span>
              </div>
            ))}

            <button className="w-full mt-4 border-2 border-primary text-primary font-black py-2.5 rounded-full hover:bg-bg cursor-pointer transition-colors text-sm">
              View Insight
            </button>
          </div>
        </div>
      </div>

      {/* ── ROW 3: Transaction (2 cols) + Top Products (1 col) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Transaction */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <p className="font-black text-dark text-base">Transaction</p>
            <button className="bg-light text-dark text-xs font-black px-4 py-2 rounded-full border-0 cursor-pointer flex items-center gap-1.5 hover:bg-primary hover:text-white transition-colors">
              Filter ⚙️
            </button>
          </div>

          <table className="w-full">
            <thead>
              <tr className="text-xs text-muted text-left">
                <th className="pb-3 font-black">No</th>
                <th className="pb-3 font-black">Id Customer</th>
                <th className="pb-3 font-black">Order Date</th>
                <th className="pb-3 font-black">Status</th>
                <th className="pb-3 font-black text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {TRANSACTIONS.map((t) => (
                <tr key={t.no} className="text-sm border-t border-bg">
                  <td className="py-3.5 text-dark">{t.no}.</td>
                  <td className="py-3.5 text-dark font-black">{t.id}</td>
                  <td className="py-3.5 text-muted">{t.date}</td>
                  <td className="py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 ${t.status === "Paid" ? "text-primary" : "text-warning"}`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current"></span>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-dark font-black text-right">
                    {t.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mt-4">
            <button className="border-2 border-primary text-primary text-xs font-black px-6 py-2 rounded-full hover:bg-bg cursor-pointer transition-colors">
              Details
            </button>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <p className="font-black text-dark text-base">Top Products</p>
            <button className="text-primary text-xs font-black bg-transparent border-0 cursor-pointer hover:underline">
              All product
            </button>
          </div>

          {/* Search */}
          <div className="bg-bg rounded-full px-4 py-2 flex items-center gap-2 mb-4">
            <span className="text-muted text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none text-xs flex-1 font-lato"
            />
          </div>

          {/* List */}
          <div className="space-y-4">
            {TOP_PRODUCTS.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-11 h-11 bg-bg rounded-xl flex items-center justify-center text-2xl">
                  {p.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-dark text-sm truncate">
                    {p.name}
                  </p>
                  <p className="text-xs text-muted">Item: {p.id}</p>
                </div>
                <span className="font-black text-dark text-sm">{p.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ROW 4: Best selling (2 cols) + Add New Product (1 col) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Best selling */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <p className="font-black text-dark text-base">
              Best selling product
            </p>
            <button className="bg-light text-dark text-xs font-black px-4 py-2 rounded-full border-0 cursor-pointer flex items-center gap-1.5 hover:bg-primary hover:text-white transition-colors">
              Filter ⚙️
            </button>
          </div>

          {/* Header row */}
          <div className="grid grid-cols-4 gap-3 bg-light/40 rounded-xl px-4 py-3 text-xs text-dark font-black mb-3">
            <div>PRODUCT</div>
            <div>TOTAL ORDER</div>
            <div>STATUS</div>
            <div className="text-right">PRICE</div>
          </div>

          {/* Rows */}
          {BEST_SELLING.map((p, i) => (
            <div
              key={i}
              className="grid grid-cols-4 gap-3 px-4 py-3 border-b border-bg items-center"
            >
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-bg rounded-lg flex items-center justify-center text-lg">
                  {p.emoji}
                </div>
                <span className="font-black text-dark text-sm">{p.name}</span>
              </div>
              <div className="text-dark text-sm">{p.total}</div>
              <div
                className={`flex items-center gap-1.5 text-sm ${p.inStock ? "text-primary" : "text-danger"}`}
              >
                <span className="w-2 h-2 rounded-full bg-current"></span>
                {p.status}
              </div>
              <div className="text-dark font-black text-sm text-right">
                {p.price}
              </div>
            </div>
          ))}

          <div className="flex justify-end mt-4">
            <button className="border-2 border-primary text-primary text-xs font-black px-6 py-2 rounded-full hover:bg-bg cursor-pointer transition-colors">
              Details
            </button>
          </div>
        </div>

        {/* Add New Product */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <p className="font-black text-dark text-base">Add New Product</p>
            <button className="text-primary text-xs font-black bg-transparent border-0 cursor-pointer flex items-center gap-1 hover:underline">
              ⊕ Add New
            </button>
          </div>

          <p className="text-xs text-muted font-black mb-3">Categories</p>

          {/* Categories */}
          <div className="space-y-2 mb-3">
            {[
              { name: "Electronic", emoji: "📱" },
              { name: "Fashion", emoji: "👕" },
              { name: "Home", emoji: "🛋️" },
            ].map((c) => (
              <button
                key={c.name}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-bg hover:border-primary transition-colors bg-transparent cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-bg rounded-lg flex items-center justify-center text-lg">
                    {c.emoji}
                  </div>
                  <span className="font-black text-dark text-sm">{c.name}</span>
                </div>
                <span className="text-muted text-lg">›</span>
              </button>
            ))}
          </div>

          <button className="w-full text-primary text-xs font-black mb-4 bg-transparent border-0 cursor-pointer hover:underline">
            See more
          </button>

          <p className="text-xs text-muted font-black mb-3">Product</p>

          {/* Products */}
          <div className="space-y-3">
            {NEW_PRODUCTS.map((p, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-bg rounded-lg flex items-center justify-center text-xl">
                  {p.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-dark text-xs truncate">
                    {p.name}
                  </p>
                  <p className="text-xs text-muted">{p.price}</p>
                </div>
                <button className="bg-primary hover:bg-green-600 text-white text-xs font-black px-3 py-1.5 rounded-lg border-0 cursor-pointer flex items-center gap-1 transition-colors">
                  ⊕ Add
                </button>
              </div>
            ))}
          </div>

          <button className="w-full text-primary text-xs font-black mt-4 bg-transparent border-0 cursor-pointer hover:underline">
            See more
          </button>
        </div>
      </div>
    </div>
  );
}
