/* Ticker, CategoriesStrip, SectionHeader — all Tailwind */
import { CATEGORIES } from "../../../data/products";

/* Items shown in the scrolling ticker strip */
const TICKER_ITEMS = [
  "📱 iPhone 15 Pro Max — €1,299",
  "💻 MacBook Pro M3 — €1,999",
  "🎮 PS5 Slim — €399",
  "🎧 AirPods Pro — €219",
  "⌚ Apple Watch Ultra — €749",
  '🖥️ Sony OLED 65" — €2,499',
  "🎧 Sony WH-1000XM5 — €279",
  "🖱️ Logitech MX Master — €89",
];

/* ── Ticker ── */
/* Items are doubled so the CSS animation loops seamlessly */
export function Ticker() {
  return (
    <div className="bg-primary overflow-hidden py-2.5">
      <div className="ticker-anim">
        {" "}
        {/* Animation defined in index.css */}
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span
            key={i}
            className="text-white font-black text-sm pl-10 whitespace-nowrap"
          >
            ⚡ {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── SectionHeader ── */
/* Reusable header for every product section:
   green left bar | title + subtitle | optional "See all" button */
export function SectionHeader({ title, sub, onMore }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        {/* Green left-border accent */}
        <div className="w-1 h-7 bg-primary rounded-full flex-shrink-0" />
        <div>
          <h2 className="font-black text-xl text-dark font-lato">{title}</h2>
          {sub && <p className="text-xs text-muted mt-0.5">{sub}</p>}
        </div>
      </div>
      {/* "See all" link — only rendered when onMore is provided */}
      {onMore && (
        <button
          onClick={onMore}
          className="text-sm font-black text-primary hover:underline bg-transparent border-0 cursor-pointer"
        >
          Shiko të gjitha →
        </button>
      )}
    </div>
  );
}

/* ── CategoriesStrip ── */
/* Grid of 10 category tiles. Clicking one sets the active filter.
   Clicking the same one again deselects (back to "show all"). */
export function CategoriesStrip({ selectedCat, onSelect }) {
  return (
    <section className="bg-white px-4 py-7">
      <div className="max-w-7xl mx-auto">
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-black text-xl text-dark font-lato">
              Shfleto Kategoritë
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Gjej produktin e dëshiruar
            </p>
          </div>
        </div>

        {/* Category grid — 10 columns desktop, 5 on small screens */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5">
          {CATEGORIES.map((cat) => {
            const isActive =
              selectedCat ===
              cat.name; /* Is this category currently selected? */
            return (
              <button
                key={cat.id}
                onClick={() =>
                  onSelect(isActive ? "" : cat.name)
                } /* Toggle on/off */
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-0 cursor-pointer transition-all duration-150
                  ${
                    isActive
                      ? "bg-primary shadow-green -translate-y-0.5" /* Active: green bg */
                      : "bg-white shadow-card hover:bg-bg hover:-translate-y-0.5 hover:shadow-hover outline outline-1 outline-bg" /* Inactive: white */
                  }`}
              >
                {/* Icon circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl
                  ${isActive ? "bg-white/25" : "bg-bg"}`}
                >
                  {cat.icon}
                </div>
                {/* Label */}
                <p
                  className={`text-xs font-black text-center leading-tight
                  ${isActive ? "text-white" : "text-dark"}`}
                >
                  {cat.name}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
