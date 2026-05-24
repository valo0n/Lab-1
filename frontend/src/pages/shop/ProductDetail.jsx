  import { useState, useEffect } from "react";
  import { useParams, useNavigate, Link } from "react-router-dom";
  import { getProduct, api } from "../../lib/api";
  import { useCart } from "../../context/CartContext";
  import { useWishlist } from "../../context/WishlistContext";
  import { useAuth } from "../../context/AuthContext";
  import Header from "../landing/Header";
  import Footer from "../landing/sections/Footer";

  const CATEGORY_LABEL = {
    Smartphones: "Phone",
    Laptops: "Laptop",
    Audio: "Audio",
    Gaming: "Gaming",
    "TV & Monitor": "TV",
    Cameras: "Camera",
    Wearables: "Watch",
    Accessories: "Acc",
  };

  function Stars({ value, size = "text-base", interactive = false, onChange }) {
    return (
      <span className={size}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            onClick={() => interactive && onChange && onChange(i)}
            className={
              (i <= value ? "text-yellow-400" : "text-gray-200") +
              (interactive ? " cursor-pointer hover:scale-110 inline-block" : "")
            }
          >
            *
          </span>
        ))}
      </span>
    );
  }

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
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

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

          try {
            const reviewsRes = await api.get("/reviews/product/" + id);
            setReviewsData(reviewsRes);
          } catch (e) {
            setReviewsData({
              reviews: [],
              stats: { total: 0, averageRating: 0 },
            });
          }
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
          <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
            <div className="bg-white rounded-2xl p-10 text-center text-muted shadow-card">
              Duke ngarkuar...
            </div>
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
            <p className="text-5xl mb-3">!</p>
            <p className="font-black text-dark mb-4">Produkti nuk u gjet</p>
            <Link
              to="/shop"
              className="bg-primary text-white px-6 py-3 rounded-xl font-black no-underline"
            >
              Kthehu te dyqani
            </Link>
          </main>
          <Footer />
        </div>
      );
    }

    const label = CATEGORY_LABEL[product.categories?.emertimi] || "Item";
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
      emoji: label,
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
        alert("Duhet te kycesh per te lene review!");
        navigate("/login");
        return;
      }
      if (!reviewComment.trim()) {
        alert("Shkruaj nje koment!");
        return;
      }
      setSubmitting(true);
      try {
        await api.post("/reviews", {
          produkti_id: product.id,
          vleresimi: reviewRating,
          komenti: reviewComment,
        });
        alert("Review u dergua! Do publikohet pas aprovimit nga admin.");
        setShowReviewForm(false);
        setReviewComment("");
        setReviewRating(5);
      } catch (err) {
        alert("Gabim: " + (err.data?.error || err.message));
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="min-h-screen flex flex-col bg-bg font-lato">
        <Header />

        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
          <div className="text-xs text-muted mb-4">
            <Link to="/" className="hover:text-primary no-underline">
              Ballina
            </Link>{" "}
            /{" "}
            <Link to="/shop" className="hover:text-primary no-underline">
              Dyqani
            </Link>{" "}
            / <span className="text-dark font-black">{product.emertimi}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl p-10 shadow-card flex items-center justify-center min-h-[400px] relative">
              <span className="text-6xl font-black text-primary select-none">
                {label}
              </span>
              {disc && (
                <span className="absolute top-5 left-5 bg-danger text-white text-sm font-black px-3 py-1.5 rounded-xl">
                  -{disc}%
                </span>
              )}
              <button
                onClick={() => toggleWishlist(cartProduct)}
                className="absolute top-5 right-5 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow border-0 cursor-pointer text-sm font-black"
              >
                {inWishlist ? "FAV" : "+"}
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-card">
              <p className="text-xs font-black text-muted mb-1">
                {product.marka || "Paradox"}
              </p>
              <h1 className="text-2xl font-black text-dark mb-3">
                {product.emertimi}
              </h1>

              <div className="flex items-center gap-2 mb-4">
                <Stars value={reviewsData.stats.averageRating} />
                <span className="text-sm text-muted">
                  {reviewsData.stats.averageRating.toFixed(1)} -{" "}
                  {reviewsData.stats.total} review
                </span>
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-black text-primary">
                  EUR {price.toLocaleString()}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-gray-400 line-through">
                    EUR {oldPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {product.pershkrimi && (
                <div className="mb-5">
                  <p className="text-sm text-muted leading-relaxed">
                    {product.pershkrimi}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
                {product.sku && (
                  <div className="bg-bg rounded-xl p-3">
                    <p className="text-xs text-muted">SKU</p>
                    <p className="font-black text-dark">{product.sku}</p>
                  </div>
                )}
                {product.modeli && (
                  <div className="bg-bg rounded-xl p-3">
                    <p className="text-xs text-muted">Modeli</p>
                    <p className="font-black text-dark">{product.modeli}</p>
                  </div>
                )}
                {product.garancia_muaj > 0 && (
                  <div className="bg-bg rounded-xl p-3">
                    <p className="text-xs text-muted">Garancia</p>
                    <p className="font-black text-dark">
                      {product.garancia_muaj} muaj
                    </p>
                  </div>
                )}
                <div className="bg-bg rounded-xl p-3">
                  <p className="text-xs text-muted">Stoku</p>
                  <p
                    className={
                      "font-black " +
                      (product.sasia_stokut > 0 ? "text-primary" : "text-danger")
                    }
                  >
                    {product.sasia_stokut > 0
                      ? product.sasia_stokut + " ne stok"
                      : "Pa stok"}
                  </p>
                </div>
              </div>

              {product.sasia_stokut > 0 && (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-sm font-black text-dark">Sasia:</span>
                    <div className="flex items-center bg-bg rounded-xl">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 bg-transparent border-0 cursor-pointer font-black text-lg"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-black text-dark">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity(
                            Math.min(product.sasia_stokut, quantity + 1),
                          )
                        }
                        className="w-10 h-10 bg-transparent border-0 cursor-pointer font-black text-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleAddToCart}
                      className={
                        "text-white font-black py-3 rounded-xl border-0 cursor-pointer " +
                        (added
                          ? "bg-green-700 scale-95"
                          : "bg-primary hover:bg-green-600")
                      }
                    >
                      {added ? "U Shtua!" : "Shto ne Shporte"}
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="bg-dark hover:bg-emerald-900 text-white font-black py-3 rounded-xl border-0 cursor-pointer"
                    >
                      Bli Tani
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-black text-dark">
                Reviews ({reviewsData.stats.total})
              </h2>
              {user && (
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-primary hover:bg-green-600 text-white font-black text-sm px-4 py-2 rounded-full border-0 cursor-pointer"
                >
                  {showReviewForm ? "Anulo" : "+ Shto Review"}
                </button>
              )}
            </div>

            {!user && (
              <div className="bg-bg rounded-xl p-4 mb-5 text-center">
                <p className="text-sm text-muted mb-2">
                  Duhet te kycesh per te lene review
                </p>
                <Link
                  to="/login"
                  className="text-primary font-black text-sm hover:underline no-underline"
                >
                  Kycu
                </Link>
              </div>
            )}

            {showReviewForm && user && (
              <div className="bg-bg rounded-xl p-4 mb-5">
                <label className="block text-sm font-black text-dark mb-2">
                  Vleresimi
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
                  placeholder="Shkruaj pershtypjet e tua..."
                  className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary resize-none bg-white"
                />

                <button
                  onClick={handleSubmitReview}
                  disabled={submitting}
                  className="mt-3 bg-primary hover:bg-green-600 text-white font-black px-5 py-2 rounded-xl border-0 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Duke derguar..." : "Dergo Review"}
                </button>
              </div>
            )}

            {reviewsData.reviews.length === 0 ? (
              <div className="text-center py-8 text-muted">
                <p>Asnje review ende. Behu i pari!</p>
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
                        {new Date(r.data_vleresimit).toLocaleDateString("sq-AL")}
                      </span>
                    </div>
                    {r.komenti && (
                      <p className="text-sm text-dark mt-2">{r.komenti}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    );
  }
