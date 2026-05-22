/* ProductDetail — layout profesional si CLICON me ngjyra Paradox */
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProduct, getProducts, api } from "../../lib/api";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import Header from "../landing/Header";
import Footer from "../landing/sections/Footer";

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

const Stars = ({
  value,
  size = "text-base",
  interactive = false,
  onChange,
}) => (
  <span className={size}>
    {[1, 2, 3, 4, 5].map((i) => (
      <span
        key={i}
        onClick={() => interactive && onChange?.(i)}
        className={`${i <= value ? "text-yellow-400" : "text-gray-200"} ${
          interactive
            ? "cursor-pointer hover:scale-110 inline-block transition-transform"
            : ""
        }`}
      >
        ★
      </span>
    ))}
  </span>
);

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviewsData, setReviewsData] = useState({
    reviews: [],
    stats: { total: 0, averageRating: 0 },
  });
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [appleProducts, setAppleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [activeThumb, setActiveThumb] = useState(0);

  /* Review form */
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productData = await getProduct(id);
        setProduct(productData);

        /* Reviews */
        try {
          const reviewsRes = await api.get(`/reviews/product/${id}`);
          setReviewsData(reviewsRes);
        } catch {
          setReviewsData({
            reviews: [],
            stats: { total: 0, averageRating: 0 },
          });
        }

        /* Related products nga e njejta kategori */
        try {
          const related = await getProducts({
            category: productData.kategoria_id,
            limit: 4,
          });
          setRelatedProducts(
            related.filter((p) => p.id !== productData.id).slice(0, 3),
          );
        } catch {}

        /* Aksesore */
        try {
          const allCategories = await api.get("/categories");
          const accessoriesCategory = allCategories.find(
            (c) => c.emertimi === "Accessories",
          );
          if (accessoriesCategory) {
            const acc = await getProducts({
              category: accessoriesCategory.id,
              limit: 3,
            });
            setAccessories(
              acc.filter((p) => p.id !== productData.id).slice(0, 3),
            );
          }

          /* Apple products */
          const allProducts = await getProducts({ limit: 50 });
          const apple = allProducts
            .filter((p) => p.marka === "Apple" && p.id !== productData.id)
            .slice(0, 3);
          setAppleProducts(apple);

          /* Featured products (te tjeret) */
          const featured = allProducts
            .filter((p) => p.id !== productData.id)
            .slice(0, 3);
          setFeaturedProducts(featured);
        } catch {}
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-bg">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
          <div className="bg-white rounded-2xl p-10 text-center text-muted shadow-card animate-pulse h-96" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-bg">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-20">
          <p className="text-5xl mb-3">⚠️</p>
          <p className="font-black text-dark mb-4">Produkti nuk u gjet</p>
          <Link
            to="/shop"
            className="bg-primary text-white px-6 py-3 rounded-xl font-black no-underline"
          >
            ← Kthehu te dyqani
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const emoji =
    product.categories?.ikona ||
    CATEGORY_EMOJI[product.categories?.emertimi] ||
    "📦";
  const price = parseFloat(product.cmimi);
  const oldPrice = product.cmimi_zbritjes
    ? parseFloat(product.cmimi_zbritjes)
    : null;
  const hasDiscount = oldPrice && oldPrice > price;
  const disc = hasDiscount
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : null;
  const inWishlist = isInWishlist(product.id);

  const cartProduct = {
    id: product.id,
    name: product.emertimi,
    brand: product.marka,
    price,
    old: oldPrice,
    emoji,
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(cartProduct);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) addToCart(cartProduct);
    navigate("/checkout");
  };

  const handleSubmitReview = async () => {
    if (!user) {
      alert("Duhet të kyçesh për të lënë review!");
      navigate("/login");
      return;
    }
    if (!reviewComment.trim()) {
      alert("Shkruaj një koment!");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/reviews", {
        produkti_id: product.id,
        vleresimi: reviewRating,
        komenti: reviewComment,
      });
      alert("✅ Review u dërgua! Do publikohet pas aprovimit nga admin.");
      setShowReviewForm(false);
      setReviewComment("");
      setReviewRating(5);
    } catch (err) {
      alert(`Gabim: ${err.data?.error || err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  /* Reusable mini product card per related sections */
  const MiniProductCard = ({ product: p }) => {
    const cardEmoji =
      p.categories?.ikona || CATEGORY_EMOJI[p.categories?.emertimi] || "📦";
    return (
      <Link
        to={`/product/${p.id}`}
        className="flex items-center gap-3 hover:bg-bg p-2 rounded-xl transition-colors no-underline"
      >
        <div className="w-16 h-16 bg-bg rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
          {cardEmoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-dark text-xs leading-tight truncate">
            {p.emertimi}
          </p>
          <p className="text-primary font-black text-sm mt-1">
            €{parseFloat(p.cmimi).toLocaleString()}
          </p>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg font-lato">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {/* Breadcrumb */}
        <div className="text-xs text-muted mb-4 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-primary no-underline">
            🏠 Ballina
          </Link>
          <span>›</span>
          <Link to="/shop" className="hover:text-primary no-underline">
            Dyqani
          </Link>
          <span>›</span>
          <Link
            to={`/shop?cat=${product.categories?.emertimi}`}
            className="hover:text-primary no-underline"
          >
            {product.categories?.emertimi}
          </Link>
          <span>›</span>
          <span className="text-primary font-black">{product.emertimi}</span>
        </div>

        {/* ═══════ MAIN PRODUCT SECTION ═══════ */}
        <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT: Image gallery */}
            <div>
              {/* Main image with arrows */}
              <div className="bg-bg rounded-2xl p-10 flex items-center justify-center min-h-[400px] relative mb-4">
                <button
                  onClick={() => setActiveThumb((activeThumb - 1 + 4) % 4)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer border-0 hover:bg-green-600 shadow"
                >
                  ‹
                </button>

                <span className="text-[180px] select-none">{emoji}</span>

                <button
                  onClick={() => setActiveThumb((activeThumb + 1) % 4)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer border-0 hover:bg-green-600 shadow"
                >
                  ›
                </button>

                {disc && (
                  <span className="absolute top-5 left-5 bg-danger text-white text-sm font-black px-3 py-1.5 rounded-xl">
                    -{disc}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <button
                    key={i}
                    onClick={() => setActiveThumb(i)}
                    className={`bg-bg rounded-xl p-3 flex items-center justify-center cursor-pointer transition-all border-2 ${
                      activeThumb === i
                        ? "border-primary"
                        : "border-transparent hover:border-primary/50"
                    }`}
                  >
                    <span className="text-3xl">{emoji}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: Product info */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Stars
                  value={reviewsData.stats.averageRating || 5}
                  size="text-sm"
                />
                <span className="text-xs text-primary font-black">
                  {reviewsData.stats.averageRating > 0
                    ? reviewsData.stats.averageRating.toFixed(1)
                    : "5.0"}{" "}
                  Star Rating
                </span>
                <span className="text-xs text-muted">
                  ({reviewsData.stats.total} reviews)
                </span>
              </div>

              <h1 className="text-2xl font-black text-dark mb-4 leading-tight">
                {product.emertimi}
              </h1>

              {/* Product meta */}
              <div className="grid grid-cols-2 gap-y-2 mb-4 text-sm">
                {product.sku && (
                  <>
                    <span className="text-muted">Sku:</span>
                    <span className="text-dark">{product.sku}</span>
                  </>
                )}
                <span className="text-muted">Availability:</span>
                <span
                  className={`font-black ${product.sasia_stokut > 0 ? "text-primary" : "text-danger"}`}
                >
                  {product.sasia_stokut > 0 ? "In Stock" : "Out of Stock"}
                </span>
                {product.marka && (
                  <>
                    <span className="text-muted">Brand:</span>
                    <span className="text-dark">{product.marka}</span>
                  </>
                )}
                <span className="text-muted">Category:</span>
                <span className="text-dark">
                  {product.categories?.emertimi}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-5 pb-5 border-b border-bg">
                <span className="text-3xl font-black text-primary">
                  €{price.toLocaleString()}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      €{oldPrice.toLocaleString()}
                    </span>
                    <span className="bg-warning/20 text-warning text-xs font-black px-2 py-1 rounded">
                      {disc}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Color/Memory mock (sa per dukje) */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs font-black text-dark mb-2">Color</p>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-200 ring-2 ring-primary cursor-pointer"></div>
                    <div className="w-8 h-8 rounded-full bg-gray-300 cursor-pointer hover:ring-2 hover:ring-primary"></div>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-black text-dark mb-2">Size</p>
                  <select className="w-full px-3 py-2 border border-bg rounded-lg text-sm outline-none focus:border-primary bg-white cursor-pointer">
                    <option>Standard Size</option>
                  </select>
                </div>
                <div>
                  <p className="text-xs font-black text-dark mb-2">Memory</p>
                  <select className="w-full px-3 py-2 border border-bg rounded-lg text-sm outline-none focus:border-primary bg-white cursor-pointer">
                    <option>16GB unified memory</option>
                  </select>
                </div>
                <div>
                  <p className="text-xs font-black text-dark mb-2">Storage</p>
                  <select className="w-full px-3 py-2 border border-bg rounded-lg text-sm outline-none focus:border-primary bg-white cursor-pointer">
                    <option>1TB SSD Storage</option>
                  </select>
                </div>
              </div>

              {/* Quantity + Buttons */}
              {product.sasia_stokut > 0 ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center bg-bg rounded-xl border border-bg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 bg-transparent border-0 cursor-pointer font-black text-lg hover:text-primary"
                      >
                        −
                      </button>
                      <span className="w-12 text-center font-black text-dark">
                        {quantity.toString().padStart(2, "0")}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity(
                            Math.min(product.sasia_stokut, quantity + 1),
                          )
                        }
                        className="w-10 h-10 bg-transparent border-0 cursor-pointer font-black text-lg hover:text-primary"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className={`flex-1 text-white font-black py-3 rounded-xl border-0 cursor-pointer transition-all ${
                        added
                          ? "bg-green-700 scale-95"
                          : "bg-primary hover:bg-green-600"
                      }`}
                    >
                      {added ? "✓ U SHTUA!" : "🛒 ADD TO CART"}
                    </button>

                    <button
                      onClick={handleBuyNow}
                      className="bg-dark hover:bg-emerald-900 text-white font-black px-6 py-3 rounded-xl border-0 cursor-pointer transition-colors"
                    >
                      BUY NOW
                    </button>
                  </div>
                </>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center mb-4">
                  <p className="text-danger font-black">
                    ⚠️ Produkti është jashtë stokut
                  </p>
                </div>
              )}

              {/* Quick actions */}
              <div className="flex items-center gap-4 mb-4 text-sm pb-4 border-b border-bg">
                <button
                  onClick={() => toggleWishlist(cartProduct)}
                  className="flex items-center gap-1 text-muted hover:text-primary bg-transparent border-0 cursor-pointer"
                >
                  {inWishlist ? "❤️" : "🤍"} Add to Wishlist
                </button>
                <button className="flex items-center gap-1 text-muted hover:text-primary bg-transparent border-0 cursor-pointer">
                  🔄 Add to Compare
                </button>
                <span className="flex items-center gap-1 text-muted ml-auto">
                  Share product 🔗
                </span>
              </div>

              {/* Guarantee */}
              <div className="bg-bg rounded-xl p-3 flex items-center gap-3">
                <span className="text-2xl">🛡️</span>
                <div>
                  <p className="font-black text-dark text-sm">
                    100% Guarantee Safe Checkout
                  </p>
                  <p className="text-xs text-muted">
                    Visa · Mastercard · PayPal · Bank Transfer
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════ TABS ═══════ */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden mb-6">
          <div className="flex border-b border-bg">
            {[
              { key: "description", label: "DESCRIPTION" },
              { key: "additional", label: "ADDITIONAL INFORMATION" },
              { key: "specs", label: "SPECIFICATION" },
              { key: "reviews", label: `REVIEW (${reviewsData.stats.total})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-4 font-black text-sm border-0 cursor-pointer transition-colors flex-1 ${
                  activeTab === tab.key
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted hover:text-dark bg-transparent border-b-2 border-transparent"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === "description" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Description */}
                <div>
                  <h3 className="font-black text-dark text-lg mb-3">
                    Description
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {product.pershkrimi ||
                      `Ky produkt premium ${product.emertimi} nga ${product.marka || "Paradox"} ofron cilësinë më të lartë dhe performance të jashtëzakonshme. I dizajnuar për përdoruesit më kërkues, kombinon teknologjinë e fundit me materiale premium për një përvojë të paharrueshme.`}
                  </p>
                </div>

                {/* Feature */}
                <div>
                  <h3 className="font-black text-dark text-lg mb-3">Feature</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2 text-dark">
                      <span className="text-primary">✓</span> Free 1 Year
                      Warranty
                    </li>
                    <li className="flex items-center gap-2 text-dark">
                      <span className="text-primary">✓</span> Free Shipping &
                      Fastest Delivery
                    </li>
                    <li className="flex items-center gap-2 text-dark">
                      <span className="text-primary">✓</span> 100% Money-back
                      guarantee
                    </li>
                    <li className="flex items-center gap-2 text-dark">
                      <span className="text-primary">✓</span> 24/7 Customer
                      support
                    </li>
                    <li className="flex items-center gap-2 text-dark">
                      <span className="text-primary">✓</span> Secure payment
                      method
                    </li>
                  </ul>
                </div>

                {/* Shipping Information */}
                <div>
                  <h3 className="font-black text-dark text-lg mb-3">
                    Shipping Information
                  </h3>
                  <ul className="space-y-2 text-sm text-muted">
                    <li>
                      <span className="font-black text-dark">Courier:</span> 2-4
                      days, free shipping
                    </li>
                    <li>
                      <span className="font-black text-dark">
                        Local Shipping:
                      </span>{" "}
                      up to 1 week, €19.00
                    </li>
                    <li>
                      <span className="font-black text-dark">
                        Standard Shipping:
                      </span>{" "}
                      4-6 days, €29.00
                    </li>
                    <li>
                      <span className="font-black text-dark">
                        Unishop Global Export:
                      </span>{" "}
                      3-4 days, €39.00
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "additional" && (
              <div>
                <h3 className="font-black text-dark text-lg mb-4">
                  Additional Information
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-4">
                  Ky produkt vjen me garanci zyrtare 12-24 muaj. Të gjitha
                  aksesorët origjinalë përfshihen në kuti. Mbështetje teknike
                  24/7 nga ekipi i Paradox Tech.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-bg rounded-xl p-3">
                    <p className="text-xs text-muted">Garancia</p>
                    <p className="font-black text-dark">
                      {product.garancia_muaj || 12} muaj
                    </p>
                  </div>
                  <div className="bg-bg rounded-xl p-3">
                    <p className="text-xs text-muted">Stoku</p>
                    <p className="font-black text-dark">
                      {product.sasia_stokut} njësi
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "specs" && (
              <div>
                <h3 className="font-black text-dark text-lg mb-4">
                  Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { label: "Emri", value: product.emertimi },
                    { label: "Marka", value: product.marka },
                    { label: "Modeli", value: product.modeli },
                    { label: "SKU", value: product.sku },
                    { label: "Kategoria", value: product.categories?.emertimi },
                    { label: "Çmimi", value: `€${price.toLocaleString()}` },
                    { label: "Sasia në Stok", value: product.sasia_stokut },
                    {
                      label: "Garancia",
                      value:
                        product.garancia_muaj > 0
                          ? `${product.garancia_muaj} muaj`
                          : "—",
                    },
                  ].map((spec) =>
                    spec.value ? (
                      <div
                        key={spec.label}
                        className="flex justify-between bg-bg rounded-xl p-3"
                      >
                        <span className="text-muted text-sm">
                          {spec.label}:
                        </span>
                        <span className="font-black text-dark text-sm">
                          {spec.value}
                        </span>
                      </div>
                    ) : null,
                  )}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-4xl font-black text-dark">
                        {reviewsData.stats.averageRating > 0
                          ? reviewsData.stats.averageRating.toFixed(1)
                          : "—"}
                      </p>
                      <Stars value={reviewsData.stats.averageRating} />
                      <p className="text-xs text-muted mt-1">
                        {reviewsData.stats.total} reviews
                      </p>
                    </div>
                  </div>
                  {user && (
                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="bg-primary hover:bg-green-600 text-white font-black text-sm px-4 py-2 rounded-full border-0 cursor-pointer"
                    >
                      {showReviewForm ? "Anulo" : "⊕ Shkruaj Review"}
                    </button>
                  )}
                </div>

                {!user && (
                  <div className="bg-bg rounded-xl p-4 mb-5 text-center">
                    <p className="text-sm text-muted mb-2">
                      Duhet të kyçesh për të lënë review
                    </p>
                    <Link
                      to="/login"
                      className="text-primary font-black text-sm hover:underline no-underline"
                    >
                      Kyçu →
                    </Link>
                  </div>
                )}

                {showReviewForm && user && (
                  <div className="bg-bg rounded-xl p-5 mb-5">
                    <label className="block text-sm font-black text-dark mb-2">
                      Vlerësimi yt
                    </label>
                    <Stars
                      value={reviewRating}
                      size="text-3xl"
                      interactive
                      onChange={setReviewRating}
                    />
                    <label className="block text-sm font-black text-dark mb-2 mt-4">
                      Komenti
                    </label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={4}
                      placeholder="Shkruaj përshtypjet e tua..."
                      className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary resize-none bg-white"
                    />
                    <button
                      onClick={handleSubmitReview}
                      disabled={submitting}
                      className="mt-3 bg-primary hover:bg-green-600 text-white font-black px-5 py-2 rounded-xl border-0 cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? "Duke dërguar..." : "✓ Dërgo Review"}
                    </button>
                  </div>
                )}

                {reviewsData.reviews.length === 0 ? (
                  <div className="text-center py-10 text-muted">
                    <p className="text-5xl mb-2">💭</p>
                    <p className="font-black">Asnjë review ende</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reviewsData.reviews.map((r) => (
                      <div
                        key={r.id}
                        className="border-l-4 border-primary bg-bg rounded-xl p-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-black text-sm">
                              {r.customers?.emri?.[0]?.toUpperCase()}
                              {r.customers?.mbiemri?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p className="font-black text-dark text-sm">
                                {r.customers?.emri} {r.customers?.mbiemri}
                              </p>
                              <Stars value={r.vleresimi} size="text-xs" />
                            </div>
                          </div>
                          <span className="text-xs text-muted">
                            {new Date(r.data_vleresimit).toLocaleDateString(
                              "sq-AL",
                            )}
                          </span>
                        </div>
                        {r.komenti && (
                          <p className="text-sm text-dark mt-2">
                            "{r.komenti}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ═══════ 4 KOLONA: Related / Accessories / Apple / Featured ═══════ */}
        <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* RELATED PRODUCTS */}
            <div>
              <h3 className="font-black text-dark text-sm mb-4 pb-2 border-b border-bg">
                RELATED PRODUCTS
              </h3>
              <div className="space-y-2">
                {relatedProducts.length === 0 ? (
                  <p className="text-xs text-muted">No related products</p>
                ) : (
                  relatedProducts.map((p) => (
                    <MiniProductCard key={p.id} product={p} />
                  ))
                )}
              </div>
            </div>

            {/* ACCESSORIES */}
            <div>
              <h3 className="font-black text-dark text-sm mb-4 pb-2 border-b border-bg">
                PRODUCT ACCESSORIES
              </h3>
              <div className="space-y-2">
                {accessories.length === 0 ? (
                  <p className="text-xs text-muted">No accessories</p>
                ) : (
                  accessories.map((p) => (
                    <MiniProductCard key={p.id} product={p} />
                  ))
                )}
              </div>
            </div>

            {/* APPLE */}
            <div>
              <h3 className="font-black text-dark text-sm mb-4 pb-2 border-b border-bg">
                APPLE PRODUCTS
              </h3>
              <div className="space-y-2">
                {appleProducts.length === 0 ? (
                  <p className="text-xs text-muted">No Apple products</p>
                ) : (
                  appleProducts.map((p) => (
                    <MiniProductCard key={p.id} product={p} />
                  ))
                )}
              </div>
            </div>

            {/* FEATURED */}
            <div>
              <h3 className="font-black text-dark text-sm mb-4 pb-2 border-b border-bg">
                FEATURED PRODUCTS
              </h3>
              <div className="space-y-2">
                {featuredProducts.length === 0 ? (
                  <p className="text-xs text-muted">No featured</p>
                ) : (
                  featuredProducts.map((p) => (
                    <MiniProductCard key={p.id} product={p} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
