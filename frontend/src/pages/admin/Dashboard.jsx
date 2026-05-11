/* Dashboard — faqja kryesore e admin-it */

/* Mock data per stats */
const STATS = [
  { label: "Total Sales", value: "$350K", sub: "Sales", change: "+10.4%", subDesc: "Previous 7days ($235)", color: "text-primary" },
  { label: "Total Orders", value: "10.7K", sub: "order", change: "+14.4%", subDesc: "Previous 7days (7.6k)", color: "text-primary" },
];

const TRANSACTIONS = [
  { no: 1, id: "#6545", date: "01 Oct | 11:29 am", status: "Paid", amount: "$64" },
  { no: 2, id: "#5412", date: "01 Oct | 11:29 am", status: "Pending", amount: "$557" },
  { no: 3, id: "#6622", date: "01 Oct | 11:29 am", status: "Paid", amount: "$156" },
  { no: 4, id: "#6462", date: "01 Oct | 11:29 am", status: "Paid", amount: "$265" },
  { no: 5, id: "#6462", date: "01 Oct | 11:29 am", status: "Paid", amount: "$265" },
];

const TOP_PRODUCTS = [
  { name: "Apple iPhone 13", id: "#FXZ-4567", price: "$999.00", emoji: "📱" },
  { name: "Nike Air Jordan", id: "#FXZ-4567", price: "$72.40", emoji: "👟" },
  { name: "T-shirt", id: "#FXZ-4567", price: "$35.40", emoji: "👕" },
  { name: "Assorted Cross Bag", id: "#FXZ-4567", price: "$80.00", emoji: "👜" },
];

const BEST_SELLING = [
  { name: "Apple iPhone 13", total: 104, status: "Stock", price: "$999.00", emoji: "📱", inStock: true },
  { name: "Nike Air Jordan", total: 56, status: "Stock out", price: "$999.00", emoji: "👟", inStock: false },
  { name: "T-shirt", total: 266, status: "Stock", price: "$999.00", emoji: "👕", inStock: true },
  { name: "Cross Bag", total: 506, status: "Stock", price: "$999.00", emoji: "👜", inStock: true },
];

const NEW_PRODUCTS = [
  { name: "Smart Fitness Tracker", price: "$39.99", emoji: "⌚" },
  { name: "Leather Wallet", price: "$19.99", emoji: "👛" },
  { name: "Electric Hair Trimmer", price: "$34.99", emoji: "💈" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* ── ROW 1: Stats cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Sales */}
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="font-black text-dark">Total Sales</p>
              <p className="text-xs text-muted">Last 7 days</p>
            </div>
            <button className="text-muted bg-transparent border-0 cursor-pointer">⋮</button>
          </div>
          <div className="flex items-baseline gap-2 my-3">
            <span className="text-3xl font-black text-dark">$350K</span>
            <span className="text-sm text-muted">Sales</span>
            <span className="text-sm text-primary font-black">↑ 10.4%</span>
          </div>
          <p className="text-xs text-muted mb-3">
            Previous 7days <span className="font-black text-dark">($235)</span>
          </p>
          <button className="w-full border-2 border-primary text-primary font-black py-2 rounded-xl hover:bg-bg cursor-pointer transition-colors">
            Details
          </button>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="font-black text-dark">Total Orders</p>
              <p className="text-xs text-muted">Last 7 days</p>
            </div>
            <button className="text-muted bg-transparent border-0 cursor-pointer">⋮</button>
          </div>
          <div className="flex items-baseline gap-2 my-3">
            <span className="text-3xl font-black text-dark">10.7K</span>
            <span className="text-sm text-muted">order</span>
            <span className="text-sm text-primary font-black">↑ 14.4%</span>
          </div>
          <p className="text-xs text-muted mb-3">
            Previous 7days <span className="font-black text-dark">(7.6k)</span>
          </p>
          <button className="w-full border-2 border-primary text-primary font-black py-2 rounded-xl hover:bg-bg cursor-pointer transition-colors">
            Details
          </button>
        </div>

        {/* Pending & Canceled */}
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="font-black text-dark">Pending & Canceled</p>
              <p className="text-xs text-muted">Last 7 days</p>
            </div>
            <button className="text-muted bg-transparent border-0 cursor-pointer">⋮</button>
          </div>
          <div className="grid grid-cols-2 gap-2 my-3">
            <div>
              <p className="text-xs text-muted">Pending</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-dark">509</span>
                <span className="text-xs text-muted">user 204</span>
              </div>
            </div>
            <div className="border-l border-bg pl-3">
              <p className="text-xs text-muted">Canceled</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-danger">94</span>
                <span className="text-xs text-danger">↓ 14.4%</span>
              </div>
            </div>
          </div>
          <button className="w-full border-2 border-primary text-primary font-black py-2 rounded-xl hover:bg-bg cursor-pointer transition-colors">
            Details
          </button>
        </div>
      </div>

      {/* ── ROW 2: Report + Users ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Report for this week — col-span-2 */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <p className="font-black text-dark">Report for this week</p>
            <div className="flex bg-bg rounded-xl p-1 gap-1">
              <button className="bg-light text-dark text-xs font-black px-3 py-1 rounded-lg border-0 cursor-pointer">This week</button>
              <button className="text-muted text-xs font-black px-3 py-1 rounded-lg bg-transparent border-0 cursor-pointer">Last week</button>
            </div>
          </div>

          {/* Stat numbers row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
            <div className="border-b-2 border-primary pb-1">
              <p className="text-xl font-black text-dark">52k</p>
              <p className="text-xs text-muted">Customers</p>
            </div>
            <div>
              <p className="text-xl font-black text-dark">3.5k</p>
              <p className="text-xs text-muted">Total Products</p>
            </div>
            <div>
              <p className="text-xl font-black text-dark">2.5k</p>
              <p className="text-xs text-muted">Stock Products</p>
            </div>
            <div>
              <p className="text-xl font-black text-dark">0.5k</p>
              <p className="text-xs text-muted">Out of Stock</p>
            </div>
            <div>
              <p className="text-xl font-black text-dark">250k</p>
              <p className="text-xs text-muted">Revenue</p>
            </div>
          </div>

          {/* Chart placeholder me SVG */}
          <div className="relative h-48 bg-gradient-to-b from-light/30 to-transparent rounded-xl p-4">
            <svg className="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
              {/* Y-axis labels */}
              <text x="5" y="20" className="text-xs" fill="#7c7c7c">50k</text>
              <text x="5" y="60" className="text-xs" fill="#7c7c7c">40k</text>
              <text x="5" y="100" className="text-xs" fill="#7c7c7c">30k</text>
              <text x="5" y="140" className="text-xs" fill="#7c7c7c">20k</text>
              <text x="5" y="180" className="text-xs" fill="#7c7c7c">10k</text>

              {/* Area under curve */}
              <path
                d="M 50 140 L 150 140 L 250 100 L 350 130 L 350 80 L 450 80 L 550 130 L 650 100 L 650 200 L 50 200 Z"
                fill="#4ea674"
                opacity="0.2"
              />
              {/* Line */}
              <path
                d="M 50 140 L 150 140 L 250 100 L 350 130 L 350 80 L 450 80 L 550 130 L 650 100"
                stroke="#4ea674"
                strokeWidth="3"
                fill="none"
              />

              {/* Dot marker */}
              <circle cx="350" cy="80" r="6" fill="white" stroke="#4ea674" strokeWidth="3" />
            </svg>

            {/* Days labels */}
            <div className="grid grid-cols-7 text-xs text-muted text-center mt-1">
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
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-start justify-between mb-1">
            <p className="font-black text-dark">Users in last 30 minutes</p>
            <button className="text-muted bg-transparent border-0 cursor-pointer">⋮</button>
          </div>
          <p className="text-2xl font-black text-dark mb-3">21.5K</p>
          <p className="text-xs text-muted mb-2">Users per minute</p>

          {/* Bars chart */}
          <div className="flex items-end gap-1 h-16 mb-4">
            {[40, 60, 80, 50, 70, 90, 60, 75, 85, 70, 65, 80, 70, 90, 60, 75, 85, 70, 80, 90].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-primary rounded-sm"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>

          {/* Sales by country */}
          <div className="border-t border-bg pt-3">
            <div className="flex justify-between items-center mb-2">
              <p className="font-black text-dark text-sm">Sales by Country</p>
              <p className="text-xs text-muted">Sales</p>
            </div>

            {[
              { flag: "🇺🇸", country: "US", value: "30k", percent: "25.8%", up: true },
              { flag: "🇧🇷", country: "Brazil", value: "30k", percent: "15.8%", up: false },
              { flag: "🇦🇺", country: "Australia", value: "25k", percent: "35.8%", up: true },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5">
                <span className="text-lg">{c.flag}</span>
                <div className="flex-1">
                  <p className="text-xs font-black text-dark">{c.value}</p>
                  <p className="text-xs text-muted">{c.country}</p>
                </div>
                <div className="flex-1 h-1.5 bg-bg rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: c.percent }}></div>
                </div>
                <span className={`text-xs font-black ${c.up ? "text-primary" : "text-danger"}`}>
                  {c.up ? "↑" : "↓"} {c.percent}
                </span>
              </div>
            ))}

            <button className="w-full mt-3 border-2 border-primary text-primary font-black py-2 rounded-xl hover:bg-bg cursor-pointer transition-colors text-sm">
              View Insight
            </button>
          </div>
        </div>
      </div>

      {/* ── ROW 3: Transactions + Top Products ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Transaction table */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <p className="font-black text-dark">Transaction</p>
            <button className="bg-light text-dark text-xs font-black px-4 py-2 rounded-xl border-0 cursor-pointer flex items-center gap-1">
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
                  <td className="py-3 text-dark">{t.no}.</td>
                  <td className="py-3 text-dark font-black">{t.id}</td>
                  <td className="py-3 text-muted">{t.date}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1 ${t.status === "Paid" ? "text-primary" : "text-warning"}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 text-dark font-black text-right">{t.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mt-3">
            <button className="border-2 border-primary text-primary text-xs font-black px-5 py-2 rounded-xl hover:bg-bg cursor-pointer transition-colors">
              Details
            </button>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <p className="font-black text-dark">Top Products</p>
            <button className="text-primary text-xs font-black bg-transparent border-0 cursor-pointer">All product</button>
          </div>

          {/* Search */}
          <div className="bg-bg rounded-xl px-3 py-2 flex items-center gap-2 mb-3">
            <span className="text-muted text-sm">🔍</span>
            <input type="text" placeholder="Search" className="bg-transparent outline-none text-xs flex-1 font-lato" />
          </div>

          {/* Products list */}
          <div className="space-y-3">
            {TOP_PRODUCTS.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-bg rounded-xl flex items-center justify-center text-xl">
                  {p.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-dark text-sm truncate">{p.name}</p>
                  <p className="text-xs text-muted">Item: {p.id}</p>
                </div>
                <span className="font-black text-dark text-sm">{p.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ROW 4: Best selling + Add New ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Best selling */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <p className="font-black text-dark">Best selling product</p>
            <button className="bg-light text-dark text-xs font-black px-4 py-2 rounded-xl border-0 cursor-pointer flex items-center gap-1">
              Filter ⚙️
            </button>
          </div>

          {/* Header row */}
          <div className="grid grid-cols-4 gap-3 bg-bg rounded-xl px-4 py-2.5 text-xs text-dark font-black mb-2">
            <div>PRODUCT</div>
            <div>TOTAL ORDER</div>
            <div>STATUS</div>
            <div className="text-right">PRICE</div>
          </div>

          {/* Rows */}
          {BEST_SELLING.map((p, i) => (
            <div key={i} className="grid grid-cols-4 gap-3 px-4 py-3 border-b border-bg items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-bg rounded-lg flex items-center justify-center">{p.emoji}</div>
                <span className="font-black text-dark text-sm">{p.name}</span>
              </div>
              <div className="text-dark text-sm">{p.total}</div>
              <div className={`flex items-center gap-1 text-sm ${p.inStock ? "text-primary" : "text-danger"}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                {p.status}
              </div>
              <div className="text-dark font-black text-sm text-right">{p.price}</div>
            </div>
          ))}

          <div className="flex justify-end mt-3">
            <button className="border-2 border-primary text-primary text-xs font-black px-5 py-2 rounded-xl hover:bg-bg cursor-pointer transition-colors">
              Details
            </button>
          </div>
        </div>

        {/* Add New Product */}
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <p className="font-black text-dark">Add New Product</p>
            <button className="text-primary text-xs font-black bg-transparent border-0 cursor-pointer flex items-center gap-1">
              ⊕ Add New
            </button>
          </div>

          <p className="text-xs text-muted font-black mb-3">Categories</p>

          {/* Category cards */}
          <div className="space-y-2 mb-4">
            {[
              { name: "Electronic", emoji: "📱" },
              { name: "Fashion", emoji: "👕" },
              { name: "Home", emoji: "🛋️" },
            ].map((c) => (
              <button
                key={c.name}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-bg hover:border-primary transition-colors bg-transparent cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-bg rounded-lg flex items-center justify-center">{c.emoji}</div>
                  <span className="font-black text-dark text-sm">{c.name}</span>
                </div>
                <span className="text-muted">›</span>
              </button>
            ))}
          </div>

          <button className="w-full text-primary text-xs font-black mb-3 bg-transparent border-0 cursor-pointer">
            See more
          </button>

          <p className="text-xs text-muted font-black mb-3">Product</p>

          {/* New products list */}
          <div className="space-y-2">
            {NEW_PRODUCTS.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-9 h-9 bg-bg rounded-lg flex items-center justify-center">{p.emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-dark text-xs truncate">{p.name}</p>
                  <p className="text-xs text-muted">{p.price}</p>
                </div>
                <button className="bg-primary text-white text-xs font-black px-3 py-1.5 rounded-lg border-0 cursor-pointer flex items-center gap-1">
                  ⊕ Add
                </button>
              </div>
            ))}
          </div>

          <button className="w-full text-primary text-xs font-black mt-3 bg-transparent border-0 cursor-pointer">
            See more
          </button>
        </div>
      </div>
    </div>
  );
}
