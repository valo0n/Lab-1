/* Dashboard — admin dashboard me te dhena reale nga DB */
import { useState, useEffect } from "react";
import { getDashboardStats } from "../../lib/api";

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

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportTab, setReportTab] = useState("this");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Nuk mund të ngarkohen statistikat");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-card animate-pulse h-40"
            />
          ))}
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-card animate-pulse h-80" />
        <p className="text-center text-muted">Duke ngarkuar të dhënat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <p className="text-danger font-black text-lg mb-2">⚠️ {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-primary text-white font-black px-5 py-2 rounded-xl border-0 cursor-pointer hover:bg-green-600"
        >
          Provo prap
        </button>
      </div>
    );
  }

  /* Llogarit max per chart scaling */
  const maxWeekValue = Math.max(...stats.weekData, 1);

  /* Llogarit perqindjet */
  const completedPercent =
    stats.totalOrders > 0
      ? Math.round((stats.completedOrders / stats.totalOrders) * 100)
      : 0;
  const canceledPercent =
    stats.totalOrders > 0
      ? Math.round((stats.canceledOrders / stats.totalOrders) * 100)
      : 0;

  return (
    <div className="space-y-5">
      {/* ── ROW 1: 3 Stat cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total Sales */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-black text-dark text-base">Total Sales</p>
              <p className="text-xs text-muted mt-1">Te gjitha kohrat</p>
            </div>
            <button className="text-muted bg-transparent border-0 cursor-pointer text-xl">
              ⋮
            </button>
          </div>
          <div className="flex items-baseline gap-2 my-4">
            <span className="text-3xl font-black text-dark">
              ${stats.totalSales.toLocaleString()}
            </span>
            <span className="text-sm text-muted">Sales</span>
          </div>
          <p className="text-xs text-muted mb-4">
            Nga {stats.completedOrders} porosi te perfunduara
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
              <p className="text-xs text-muted mt-1">Te gjitha porosit</p>
            </div>
            <button className="text-muted bg-transparent border-0 cursor-pointer text-xl">
              ⋮
            </button>
          </div>
          <div className="flex items-baseline gap-2 my-4">
            <span className="text-3xl font-black text-dark">
              {stats.totalOrders.toLocaleString()}
            </span>
            <span className="text-sm text-muted">orders</span>
          </div>
          <p className="text-xs text-muted mb-4">
            {stats.completedOrders} te perfunduara
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
              <p className="text-xs text-muted mt-1">Aktuale</p>
            </div>
            <button className="text-muted bg-transparent border-0 cursor-pointer text-xl">
              ⋮
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 my-4">
            <div>
              <p className="text-xs text-muted mb-1">Pending</p>
              <span className="text-2xl font-black text-warning">
                {stats.pendingOrders}
              </span>
            </div>
            <div className="border-l border-bg pl-4">
              <p className="text-xs text-muted mb-1">Canceled</p>
              <span className="text-2xl font-black text-danger">
                {stats.canceledOrders}
              </span>
            </div>
          </div>
          <button className="w-full border-2 border-primary text-primary font-black py-2.5 rounded-full hover:bg-bg cursor-pointer transition-colors text-sm">
            Details
          </button>
        </div>
      </div>

      {/* ── ROW 2: Report + Stats ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Report */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <p className="font-black text-dark text-base">
              Report for this week
            </p>
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
          </div>

          {/* Stat numbers - reale */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <div className="border-b-2 border-primary pb-2">
              <p className="text-xl font-black text-dark">
                {stats.totalCustomers}
              </p>
              <p className="text-xs text-muted">Customers</p>
            </div>
            <div className="pb-2">
              <p className="text-xl font-black text-dark">
                {stats.totalProducts}
              </p>
              <p className="text-xs text-muted">Total Products</p>
            </div>
            <div className="pb-2">
              <p className="text-xl font-black text-dark">
                {stats.stockProducts}
              </p>
              <p className="text-xs text-muted">Stock Products</p>
            </div>
            <div className="pb-2">
              <p className="text-xl font-black text-dark">{stats.outOfStock}</p>
              <p className="text-xs text-muted">Out of Stock</p>
            </div>
            <div className="pb-2">
              <p className="text-xl font-black text-dark">
                ${(stats.revenue / 1000).toFixed(1)}k
              </p>
              <p className="text-xs text-muted">Revenue</p>
            </div>
          </div>

          {/* Chart real */}
          <div className="relative h-56">
            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs text-muted">
              <span>${(maxWeekValue / 1000).toFixed(0)}k</span>
              <span>${((maxWeekValue * 0.75) / 1000).toFixed(0)}k</span>
              <span>${((maxWeekValue * 0.5) / 1000).toFixed(0)}k</span>
              <span>${((maxWeekValue * 0.25) / 1000).toFixed(0)}k</span>
              <span>0</span>
            </div>

            <svg
              className="absolute left-10 right-0 top-0 bottom-6 w-[calc(100%-2.5rem)] h-[calc(100%-1.5rem)]"
              viewBox="0 0 600 200"
              preserveAspectRatio="none"
            >
              {/* Genero path nga weekData */}
              {(() => {
                const points = stats.weekData.map((val, i) => {
                  const x = (i / 6) * 600;
                  const y = 200 - (val / maxWeekValue) * 180;
                  return `${x} ${y}`;
                });

                const linePath = "M " + points.join(" L ");
                const areaPath = linePath + ` L 600 200 L 0 200 Z`;

                return (
                  <>
                    <path d={areaPath} fill="#4ea674" opacity="0.15" />
                    <path
                      d={linePath}
                      stroke="#4ea674"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {stats.weekData.map((val, i) => {
                      const x = (i / 6) * 600;
                      const y = 200 - (val / maxWeekValue) * 180;
                      return val > 0 ? (
                        <circle
                          key={i}
                          cx={x}
                          cy={y}
                          r="4"
                          fill="white"
                          stroke="#4ea674"
                          strokeWidth="3"
                        />
                      ) : null;
                    })}
                  </>
                );
              })()}
            </svg>

            <div className="absolute left-10 right-0 bottom-0 grid grid-cols-7 text-xs text-muted text-center">
              {stats.dayLabels.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right side stats */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-start justify-between mb-4">
            <p className="font-black text-dark text-base">Inventory Overview</p>
            <button className="text-muted bg-transparent border-0 cursor-pointer text-xl">
              ⋮
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-bg rounded-xl p-4">
              <p className="text-xs text-muted mb-1">Total Products</p>
              <p className="text-2xl font-black text-dark">
                {stats.totalProducts}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-bg rounded-xl p-3">
                <p className="text-xs text-primary mb-1">In Stock</p>
                <p className="text-xl font-black text-dark">
                  {stats.stockProducts}
                </p>
              </div>
              <div className="bg-bg rounded-xl p-3">
                <p className="text-xs text-danger mb-1">Out of Stock</p>
                <p className="text-xl font-black text-dark">
                  {stats.outOfStock}
                </p>
              </div>
            </div>

            <div className="border-t border-bg pt-4">
              <p className="text-xs text-muted mb-2">Stock Status</p>
              <div className="h-2 bg-bg rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{
                    width: `${stats.totalProducts > 0 ? (stats.stockProducts / stats.totalProducts) * 100 : 0}%`,
                  }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs">
                <span className="text-primary font-black">
                  {stats.totalProducts > 0
                    ? Math.round(
                        (stats.stockProducts / stats.totalProducts) * 100,
                      )
                    : 0}
                  % available
                </span>
                <span className="text-danger font-black">
                  {stats.totalProducts > 0
                    ? Math.round((stats.outOfStock / stats.totalProducts) * 100)
                    : 0}
                  % sold out
                </span>
              </div>
            </div>

            <button className="w-full border-2 border-primary text-primary font-black py-2.5 rounded-full hover:bg-bg cursor-pointer transition-colors text-sm">
              View Insight
            </button>
          </div>
        </div>
      </div>

      {/* ── ROW 3: Transactions + Top Products ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Transactions */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <p className="font-black text-dark text-base">
              Transaksionet e Fundit
            </p>
          </div>

          {stats.recentOrders.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-5xl mb-3">📦</p>
              <p className="text-muted font-black">Asnje porosi ende</p>
              <p className="text-xs text-muted mt-1">Porosit do shfaqen ketu</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-xs text-muted text-left">
                  <th className="pb-3 font-black">No</th>
                  <th className="pb-3 font-black">Customer</th>
                  <th className="pb-3 font-black">Date</th>
                  <th className="pb-3 font-black">Status</th>
                  <th className="pb-3 font-black text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order, i) => (
                  <tr key={order.id} className="text-sm border-t border-bg">
                    <td className="py-3.5 text-dark">{i + 1}.</td>
                    <td className="py-3.5 text-dark font-black">#{order.id}</td>
                    <td className="py-3.5 text-muted">
                      {new Date(order.data_porosise).toLocaleDateString()}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 ${
                          order.statusi === "completed"
                            ? "text-primary"
                            : order.statusi === "pending"
                              ? "text-warning"
                              : "text-danger"
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-current"></span>
                        {order.statusi}
                      </span>
                    </td>
                    <td className="py-3.5 text-dark font-black text-right">
                      ${parseFloat(order.totali).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <p className="font-black text-dark text-base">Produktet e Reja</p>
          </div>

          <div className="space-y-4">
            {stats.recentProducts.length === 0 ? (
              <p className="text-muted text-sm text-center py-5">
                Asnje produkt
              </p>
            ) : (
              stats.recentProducts.map((p) => {
                const emoji =
                  p.categories?.ikona ||
                  CATEGORY_EMOJI[p.categories?.emertimi] ||
                  "📦";
                return (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-bg rounded-xl flex items-center justify-center text-2xl">
                      {emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-dark text-sm truncate">
                        {p.emertimi}
                      </p>
                      <p className="text-xs text-muted">
                        {p.marka || p.categories?.emertimi}
                      </p>
                    </div>
                    <span className="font-black text-dark text-sm">
                      €{parseFloat(p.cmimi).toLocaleString()}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── ROW 4: Top Products + Stock ── */}
      <div className="bg-white rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-5">
          <p className="font-black text-dark text-base">Top Selling Products</p>
        </div>

        {stats.topProducts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-5xl mb-3">🏆</p>
            <p className="text-muted font-black">Asnje shitje ende</p>
            <p className="text-xs text-muted mt-1">
              Bestseller-at do shfaqen ketu kur te kete porosi
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.topProducts.map((p, i) => {
              const emoji =
                p.categories?.ikona ||
                CATEGORY_EMOJI[p.categories?.emertimi] ||
                "📦";
              return (
                <div key={p.id} className="border border-bg rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl">{emoji}</span>
                    <span className="text-xs font-black bg-primary text-white px-2 py-1 rounded-full">
                      #{i + 1}
                    </span>
                  </div>
                  <p className="font-black text-dark text-sm truncate">
                    {p.emertimi}
                  </p>
                  <p className="text-xs text-muted mb-2">{p.marka}</p>
                  <div className="flex justify-between items-baseline">
                    <span className="font-black text-primary">
                      €{parseFloat(p.cmimi).toLocaleString()}
                    </span>
                    <span className="text-xs text-muted">
                      {p.total_sold} shitur
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
