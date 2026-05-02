/* ProductCard — kart produkti me funksionin Shto ne Shporte */
import { useState } from "react";
import { useCart } from "../../context/CartContext";

/* Komponent i ndare per yjet — perdoret edhe ne pjese te tjera */
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

export default function ProductCard({ product: p }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  /* Llogarit perqindjen e zbritjes */
  const disc = p.old ? Math.round(((p.old - p.price) / p.old) * 100) : null;

  /* Ngjyra e badge sipas tipit */
  const badgeCls = p.badge
    ? p.badge.startsWith("-")
      ? "bg-danger"
      : p.badge === "TOP"
        ? "bg-warning"
        : "bg-primary"
    : "";

  /* Trajto klikun e Shto ne Shporte */
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(p);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white rounded-xl border border-bg shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-200 overflow-hidden cursor-pointer">
      {/* Foto area */}
      <div className="relative flex items-center justify-center bg-bg h-40">
        <span className="text-6xl select-none">{p.emoji}</span>

        {p.badge && (
          <span
            className={`absolute top-2 left-2 ${badgeCls} text-white text-xs font-black px-2 py-0.5 rounded-lg`}
          >
            {p.badge}
          </span>
        )}
      </div>

      {/* Info area */}
      <div className="p-3">
        <p className="text-xs font-black text-muted mb-0.5">{p.brand}</p>

        <h3 className="font-black text-sm text-dark leading-snug mb-2 line-clamp-2 font-lato">
          {p.name}
        </h3>

        <div className="flex items-center gap-1.5 mb-2">
          <Stars v={p.rating} />
          <span className="text-xs text-muted">({p.reviews})</span>
        </div>

        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-black text-primary font-lato">
              €{p.price.toLocaleString()}
            </span>
            {p.old && (
              <span className="text-xs text-gray-300 line-through">
                €{p.old.toLocaleString()}
              </span>
            )}
          </div>
          {disc && (
            <span className="text-xs font-black text-primary bg-bg px-1.5 py-0.5 rounded-lg">
              -{disc}%
            </span>
          )}
        </div>

        {/* Add to Cart — me funksion te vertete */}
        <button
          onClick={handleAddToCart}
          className={`w-full text-white text-sm font-black py-2 rounded-lg transition-all ${
            added ? "bg-green-700 scale-95" : "bg-primary hover:bg-green-600"
          }`}
        >
          {added ? "✓ U Shtua!" : "+ Shto në Shportë"}
        </button>
      </div>
    </div>
  );
}
