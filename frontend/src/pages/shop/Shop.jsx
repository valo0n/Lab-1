/* Shop — lista e plote e produkteve nga DB */
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSearch } from "../../context/SearchContext";
import { getProducts, getCategories } from "../../lib/api";
import ProductCard from "../../components/shop/ProductCard";
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

export default function Shop() {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    clearFilters,
  } = useSearch();
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  /* Lexo URL params */
  useEffect(() => {
    const cat = searchParams.get("cat");
    const q = searchParams.get("q");
    if (cat) setSelectedCategory(cat);
    if (q) setSearchQuery(q);
  }, [searchParams, setSelectedCategory, setSearchQuery]);

  /* Ngarko kategorit  e nje here */
  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  /* Ngarko produktet sa here ndryshojne filtrat */
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        const cat = categories.find((c) => c.emertimi === selectedCategory);
        if (cat) params.category = cat.id;
        if (searchQuery) params.search = searchQuery;

        const data = await getProducts(params);
        setProducts(data);
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery, categories]);

  return (
    <div className="min-h-screen flex flex-col bg-bg font-lato">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-black text-dark mb-2">
            {selectedCategory || "Te gjitha produktet"}
          </h1>
          <p className="text-sm text-muted">
            {loading
              ? "Duke ngarkuar..."
              : `${products.length} ${products.length === 1 ? "produkt" : "produkte"}`}
            {searchQuery && !loading && (
              <span>
                {" "}
                per "
                <span className="text-primary font-black">{searchQuery}</span>"
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-bg p-4 sticky top-24">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-black text-dark">Kategoritë</h2>
                {(selectedCategory || searchQuery) && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-primary font-black bg-transparent border-0 cursor-pointer hover:underline"
                  >
                    Pastro
                  </button>
                )}
              </div>

              <button
                onClick={() => setSelectedCategory("")}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-black transition-colors mb-1 bg-transparent border-0 cursor-pointer ${
                  !selectedCategory
                    ? "bg-primary text-white"
                    : "text-dark hover:bg-bg"
                }`}
              >
                Te gjitha
              </button>

              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.emertimi)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-black transition-colors mb-1 bg-transparent border-0 cursor-pointer ${
                    selectedCategory === c.emertimi
                      ? "bg-primary text-white"
                      : "text-dark hover:bg-bg"
                  }`}
                >
                  <span className="mr-2">
                    {c.ikona || CATEGORY_EMOJI[c.emertimi] || "📦"}
                  </span>
                  {c.emertimi}
                </button>
              ))}
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl h-72 animate-pulse"
                  ></div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-xl border border-bg p-10 text-center">
                <p className="text-5xl mb-3">🔍</p>
                <p className="font-black text-dark mb-2">
                  Asnje produkt nuk u gjet
                </p>
                <p className="text-sm text-muted mb-4">
                  Provo me fjale tjeter ose pastro filtrat
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-primary text-white px-5 py-2 rounded-lg font-black hover:bg-green-600 border-0 cursor-pointer"
                >
                  Pastro Filtrat
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
