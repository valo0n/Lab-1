/* Wishlist — faqja e produkteve favorite */
import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import Header from "../landing/Header";
import Footer from "../landing/sections/Footer";

export default function Wishlist() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen flex flex-col font-lato">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-20 px-4">
          <span className="text-7xl mb-4">💚</span>
          <h2 className="text-2xl font-black text-dark mb-2">Lista e favoriteve eshte bosh</h2>
          <p className="text-muted mb-6">Shto produkte qe te pelqejne</p>
          <Link
            to="/"
            className="bg-primary hover:bg-green-600 text-white px-6 py-3 rounded-xl font-black transition-colors"
          >
            ← Shfleto produktet
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg font-lato">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-black text-dark">
            Lista e Favoriteve ({wishlist.length})
          </h1>
          <button
            onClick={clearWishlist}
            className="text-danger hover:underline text-sm font-black bg-transparent border-0 cursor-pointer"
          >
            🗑️ Pastro Listen
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlist.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl border border-bg shadow-card overflow-hidden"
            >
              <div className="relative bg-bg h-40 flex items-center justify-center">
                <span className="text-6xl">{p.emoji}</span>
                <button
                  onClick={() => removeFromWishlist(p.id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow text-danger hover:bg-red-50 border-0 cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <div className="p-3">
                <p className="text-xs font-black text-muted">{p.brand}</p>
                <h3 className="font-black text-sm text-dark mb-2 line-clamp-2">{p.name}</h3>
                <p className="text-base font-black text-primary mb-2">€{p.price.toLocaleString()}</p>
                <button
                  onClick={() => addToCart(p)}
                  className="w-full bg-primary hover:bg-green-600 text-white text-sm font-black py-2 rounded-lg transition-colors"
                >
                  + Shto në Shportë
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
