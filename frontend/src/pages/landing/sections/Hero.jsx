/* Hero — auto-playing banner me produkte nga DB */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { getProducts } from "../../../lib/api";

const SLIDES = [
  {
    tag: "Deri në 50% Zbritje",
    title: "Zbulo Ofertat\nMë të Fundit!",
    sub: "Smartphones, Laptops dhe aksesorë premium me çmimet më të mira",
    cta: "Shfleto Tani",
    action: "shop",
    grad: "from-dark to-emerald-800",
  },
  {
    tag: "Produkte të Reja 2025",
    title: "Teknologji\nPremium!",
    sub: "iPhone 15, MacBook M3, PS5 dhe shumë produkte të reja",
    cta: "Shiko Të Reja",
    action: "shop",
    grad: "from-emerald-900 to-primary",
  },
  {
    tag: "Garanci Zyrtare",
    title: "Blej me\nBesim 100%!",
    sub: "Të gjitha produktet origjinale me garanci zyrtare dhe servis",
    cta: "Mëso Më Shumë",
    action: "info",
    grad: "from-dark to-emerald-700",
  },
];

/* Default emoji per kategori */
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

export default function Hero() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [current, setCurrent] = useState(0);
  const [featured, setFeatured] = useState([]);

  /* Ngarko 2 produkte te para nga DB per kart-et promo */
  useEffect(() => {
    getProducts({ limit: 2 })
      .then(setFeatured)
      .catch((err) => console.error("Hero error:", err));
  }, []);

  useEffect(() => {
    const t = setInterval(
      () => setCurrent((c) => (c + 1) % SLIDES.length),
      4500,
    );
    return () => clearInterval(t);
  }, []);

  const s = SLIDES[current];

  const handleSlideAction = () => {
    if (s.action === "shop") {
      navigate("/shop");
    } else {
      alert("Te gjitha produktet kane garanci zyrtare 12-24 muaj!");
    }
  };

  /* Pershtat strukturen e DB per cart */
  const handleProductClick = (product) => {
    const price = parseFloat(product.cmimi);
    const emoji =
      product.categories?.ikona ||
      CATEGORY_EMOJI[product.categories?.emertimi] ||
      "📦";

    addToCart({
      id: product.id,
      name: product.emertimi,
      brand: product.marka,
      price,
      old: product.cmimi_zbritjes ? parseFloat(product.cmimi_zbritjes) : null,
      emoji,
    });
    alert(`${product.emertimi} u shtua ne shporte!`);
  };

  return (
    <section className="bg-white px-4 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-3 gap-4 items-stretch">
          <div
            className={`col-span-2 rounded-2xl overflow-hidden relative bg-linear-to-r ${s.grad} min-h-72 transition-all duration-500`}
          >
            <div className="absolute inset-0 p-10 flex flex-col justify-center">
              <span className="fade-up inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-black px-3 py-1.5 rounded-full mb-4 w-fit">
                🔥 {s.tag}
              </span>

              <h1 className="fade-up delay-100 text-white font-black text-4xl lg:text-5xl font-lato leading-tight mb-3 whitespace-pre-line">
                {s.title}
              </h1>

              <p className="fade-up delay-200 text-white/75 text-sm max-w-sm leading-relaxed mb-6">
                {s.sub}
              </p>

              <button
                onClick={handleSlideAction}
                className="fade-up delay-300 bg-primary hover:bg-green-600 text-white font-black text-sm px-6 py-3 rounded-xl w-fit transition-colors border-0 cursor-pointer"
              >
                {s.cta} →
              </button>
            </div>

            <div className="absolute bottom-5 left-10 flex gap-2">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full border-0 cursor-pointer transition-all duration-300
                    ${i === current ? "bg-white w-6" : "bg-white/35 w-2"}`}
                />
              ))}
            </div>

            <span className="hidden lg:block absolute right-10 top-1/2 -translate-y-1/2 text-9xl opacity-[0.07] select-none">
              ⚡
            </span>
          </div>

          {/* Kart-et e produkteve promo - nga DB */}
          <div className="flex flex-col gap-3">
            {featured.length > 0 ? (
              featured.map((p, i) => {
                const emoji =
                  p.categories?.ikona ||
                  CATEGORY_EMOJI[p.categories?.emertimi] ||
                  "📦";
                return (
                  <div
                    key={p.id}
                    className={`flex-1 rounded-2xl p-4 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-green
                      ${i === 0 ? "bg-bg" : "bg-light"} border border-primary/20`}
                  >
                    <div>
                      <p className="text-xs font-black text-primary">
                        {p.marka || "Paradox"}
                      </p>
                      <p className="font-black text-sm text-dark font-lato leading-tight mt-0.5">
                        {p.emertimi}
                      </p>
                      <p className="font-black text-lg text-primary font-lato mt-1">
                        €{parseFloat(p.cmimi).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2.5">
                      <button
                        onClick={() => handleProductClick(p)}
                        className="bg-primary hover:bg-green-600 text-white text-xs font-black px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-colors"
                      >
                        Bli Tani
                      </button>
                      <span className="text-3xl select-none">{emoji}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <>
                <div className="flex-1 bg-bg rounded-2xl animate-pulse"></div>
                <div className="flex-1 bg-light rounded-2xl animate-pulse"></div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
