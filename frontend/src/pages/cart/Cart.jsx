/* Cart page — faqja e shportes me liste produktesh dhe sasi */
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import Header from "../landing/Header";
import Footer from "../landing/sections/Footer";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } =
    useCart();

  /* Nese shporta eshte bosh */
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col font-lato">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-20 px-4">
          <span className="text-7xl mb-4">🛒</span>
          <h2 className="text-2xl font-black text-dark mb-2">
            Shporta jote eshte bosh
          </h2>
          <p className="text-muted mb-6">Shto produkte per te vazhduar</p>
          <Link
            to="/"
            className="bg-primary hover:bg-green-600 text-white px-6 py-3 rounded-xl font-black transition-colors"
          >
            ← Kthehu te produktet
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
        {/* Title bar */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-black text-dark">
            Shporta ({cartItems.length}{" "}
            {cartItems.length === 1 ? "produkt" : "produkte"})
          </h1>
          <button
            onClick={clearCart}
            className="text-danger hover:underline text-sm font-black bg-transparent border-0 cursor-pointer"
          >
            🗑️ Pastro Shporten
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Lista e produkteve */}
          <div className="flex-1 space-y-3">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-bg p-4 flex flex-col sm:flex-row gap-4"
              >
                {/* Foto placeholder me emoji */}
                <div className="w-full sm:w-28 h-28 bg-bg rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-5xl">{item.emoji}</span>
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-black text-muted">
                      {item.brand}
                    </p>
                    <h3 className="font-black text-dark">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg font-black text-primary">
                        €{item.price.toLocaleString()}
                      </span>
                      {item.old && (
                        <span className="text-xs text-gray-400 line-through">
                          €{item.old.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Kontrolli i sasise */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-9 h-9 border border-bg rounded-lg hover:bg-bg text-dark font-black bg-white cursor-pointer transition-colors"
                      >
                        −
                      </button>
                      <span className="w-12 h-9 border border-bg rounded-lg flex items-center justify-center font-black text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-9 h-9 border border-bg rounded-lg hover:bg-bg text-dark font-black bg-white cursor-pointer transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal + remove */}
                    <div className="flex items-center gap-3">
                      <span className="font-black text-dark">
                        €{(item.price * item.quantity).toLocaleString()}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-danger hover:underline text-xl bg-transparent border-0 cursor-pointer"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:w-80">
            <div className="bg-white rounded-xl border border-bg p-6 sticky top-24">
              <h2 className="text-lg font-black text-dark mb-4">
                Pasqyra e Porosise
              </h2>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between text-muted">
                  <span>Nentotal</span>
                  <span>€{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Dorezimi</span>
                  <span className="text-primary font-black">Falas</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>TVSH (8%)</span>
                  <span>€{(cartTotal * 0.08).toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-bg pt-3 mb-5">
                <div className="flex justify-between text-lg font-black text-dark">
                  <span>Totali</span>
                  <span>€{(cartTotal + cartTotal * 0.08).toFixed(2)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block w-full bg-primary hover:bg-green-600 text-white font-black py-3 rounded-xl transition-colors mb-3 text-center"
              >
                Vazhdo me Pagesen
              </Link>

              <Link
                to="/"
                className="block text-center w-full border border-bg text-dark font-black py-3 rounded-xl hover:bg-bg transition-colors"
              >
                ← Vazhdo Blerjet
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
