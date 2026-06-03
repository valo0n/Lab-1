/* ProductCard — me foto reale nese ka URL, ndryshe emoji */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

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

export default function ProductCard({ product: p }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const price = parseFloat(p.cmimi);
  const showOldPrice =
    p.cmimi_zbritjes && parseFloat(p.cmimi_zbritjes) > parseFloat(p.cmimi);
  const disc = showOldPrice
    ? Math.round(
        ((parseFloat(p.cmimi_zbritjes) - price) /
          parseFloat(p.cmimi_zbritjes)) *
          100,
      )
    : null;
  const emoji =
    p.categories?.ikona || CATEGORY_EMOJI[p.categories?.emertimi] || "📦";
  const hasImage = p.foto_kryesore && !imgError;

  const cartProduct = {
    id: p.id,
    name: p.emertimi,
    brand: p.marka,
    price: price,
    old: showOldPrice ? parseFloat(p.cmimi_zbritjes) : null,
    emoji,
    image: p.foto_kryesore,
  };

  const inWishlist = isInWishlist(p.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(cartProduct);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(cartProduct);
  };

  return (
    <Link to={`/product/${p.id}`} className="block no-underline group">
      <div className="bg-white rounded-xl border border-bg shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-200 overflow-hidden cursor-pointer">
        <div className="relative flex items-center justify-center bg-white h-40 overflow-hidden">
          {hasImage ? (
            <img
              src={p.foto_kryesore}
              alt={p.emertimi}
              className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="text-6xl select-none group-hover:scale-110 transition-transform">
              {emoji}
            </span>
          )}

          {disc && (
            <span className="absolute top-2 left-2 bg-danger text-white text-xs font-black px-2 py-0.5 rounded-lg">
              -{disc}%
            </span>
          )}

          <button
            onClick={handleWishlist}
            className="absolute top-2 right-2 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow hover:bg-red-50 transition-all border-0 cursor-pointer text-lg"
            title={inWishlist ? "Hiq nga wishlist" : "Shto në wishlist"}
          >
            {inWishlist ? "❤️" : "🤍"}
          </button>
        </div>

        <div className="p-3">
          <p className="text-xs font-black text-muted mb-0.5">
            {p.marka || "Paradox"}
          </p>

          <h3 className="font-black text-sm text-dark leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {p.emertimi}
          </h3>

          <div className="flex items-center gap-1.5 mb-2">
            <Stars v={5} />
            <span className="text-xs text-muted">(0)</span>
          </div>

          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black text-primary">
                €{price.toLocaleString()}
              </span>
              {showOldPrice && (
                <span className="text-xs text-gray-300 line-through">
                  €{parseFloat(p.cmimi_zbritjes).toLocaleString()}
                </span>
              )}
            </div>
            {disc && (
              <span className="text-xs font-black text-primary bg-bg px-1.5 py-0.5 rounded-lg">
                -{disc}%
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`w-full text-white text-sm font-black py-2 rounded-lg transition-all border-0 cursor-pointer ${
              added ? "bg-green-700 scale-95" : "bg-primary hover:bg-green-600"
            }`}
          >
            {added ? "✓ U Shtua!" : "+ Shto në Shportë"}
          </button>
        </div>
      </div>
    </Link>
  );
}
