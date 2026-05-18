/* Ticker, CategoriesStrip, SectionHeader — krejt nga API */
import { useState, useEffect } from "react";
import { getCategories } from "../../../lib/api";

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

/* Default emoji per kategori nese DB nuk ka ikone */
const DEFAULT_EMOJI = {
  Smartphones: "📱",
  Laptops: "💻",
  Audio: "🎧",
  Gaming: "🎮",
  "TV & Monitor": "📺",
  Cameras: "📷",
  Wearables: "⌚",
  Accessories: "🔌",
};

/* ── Ticker ── */
export function Ticker() {
  return (
    <div className="bg-primary overflow-hidden py-2.5">
      <div className="ticker-anim">
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
export function SectionHeader({ title, sub, onMore }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <div className="w-1 h-7 bg-primary rounded-full shrink-0" />
        <div>
          <h2 className="font-black text-xl text-dark font-lato">{title}</h2>
          {sub && <p className="text-xs text-muted mt-0.5">{sub}</p>}
        </div>
      </div>
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

/* ── CategoriesStrip — tani nga DB ── */
export function CategoriesStrip({ selectedCat, onSelect }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading categories:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="bg-white px-4 py-7">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4">
            <h2 className="font-black text-xl text-dark font-lato">
              Shfleto Kategoritë
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Gjej produktin e dëshiruar
            </p>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-bg rounded-xl h-20 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white px-4 py-7">
      <div className="max-w-7xl mx-auto">
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

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
          {categories.map((cat) => {
            const isActive = selectedCat === cat.id;
            const emoji = cat.ikona || DEFAULT_EMOJI[cat.emertimi] || "📦";

            return (
              <button
                key={cat.id}
                onClick={() => onSelect(isActive ? null : cat.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-0 cursor-pointer transition-all duration-150
                  ${
                    isActive
                      ? "bg-primary shadow-green -translate-y-0.5"
                      : "bg-white shadow-card hover:bg-bg hover:-translate-y-0.5 hover:shadow-hover outline-1 outline-bg"
                  }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl
                  ${isActive ? "bg-white/25" : "bg-bg"}`}
                >
                  {emoji}
                </div>
                <p
                  className={`text-xs font-black text-center leading-tight
                  ${isActive ? "text-white" : "text-dark"}`}
                >
                  {cat.emertimi}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
