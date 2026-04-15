export function Stars({ v = 0, size = "text-xs" }) {
  return (
    <span className={size}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={i <= Math.round(v) ? "text-yellow-400" : "text-gray-200"}
        >
          ★
        </span>
      ))}
    </span>
  );
}

/* ProductCard: individual product tile used in all grids */
export default function ProductCard({ product: p }) {
  /* Discount % calculated from old vs current price */
  const disc = p.old ? Math.round(((p.old - p.price) / p.old) * 100) : null;

  /* Badge background color — red for discounts, amber for TOP, green for new */
  const badgeCls = p.badge
    ? p.badge.startsWith("-")
      ? "bg-danger"
      : p.badge === "TOP"
        ? "bg-warning"
        : "bg-primary"
    : "";

  return (
    <div className="bg-white rounded-xl border border-bg shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-200 overflow-hidden cursor-pointer">
      {/* ── Image area ── */}
      <div className="relative flex items-center justify-center bg-bg h-40">
        <span className="text-6xl select-none">{p.emoji}</span>

        {/* Badge — only rendered when badge exists */}
        {p.badge && (
          <span
            className={`absolute top-2 left-2 ${badgeCls} text-white text-xs font-black px-2 py-0.5 rounded-lg`}
          >
            {p.badge}
          </span>
        )}
      </div>

      {/* ── Info area ── */}
      <div className="p-3">
        <p className="text-xs font-black text-muted mb-0.5">{p.brand}</p>

        <h3 className="font-black text-sm text-dark leading-snug mb-2 line-clamp-2 font-lato">
          {p.name}
        </h3>

        {/* Stars + review count */}
        <div className="flex items-center gap-1.5 mb-2">
          <Stars v={p.rating} />
          <span className="text-xs text-muted">({p.reviews})</span>
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            {/* Current price in green */}
            <span className="text-base font-black text-primary font-lato">
              €{p.price.toLocaleString()}
            </span>
            {/* Old price with strikethrough — only if discounted */}
            {p.old && (
              <span className="text-xs text-gray-300 line-through">
                €{p.old.toLocaleString()}
              </span>
            )}
          </div>
          {/* Discount pill — only if discounted */}
          {disc && (
            <span className="text-xs font-black text-primary bg-bg px-1.5 py-0.5 rounded-lg">
              -{disc}%
            </span>
          )}
        </div>

        {/* Add to Cart button — static, no real action */}
        <button className="w-full bg-primary hover:bg-green-600 text-white text-sm font-black py-2 rounded-lg transition-colors">
          + Shto në Shportë
        </button>
      </div>
    </div>
  );
}
