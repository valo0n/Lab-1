/* Shop — lista e plote e produkteve me search dhe filter */
import { Link, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useSearch } from "../../context/SearchContext";
import { PRODUCTS, CATEGORIES } from "../../data/products";
import ProductCard from "../../components/shop/ProductCard";
import Header from "../landing/Header";
import Footer from "../landing/sections/Footer";

export default function Shop() {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    clearFilters,
  } = useSearch();
  const [searchParams] = useSearchParams();

  /* Lexo URL params (p.sh /shop?cat=Smartphones ose /shop?q=iphone) */
  useEffect(() => {
    const cat = searchParams.get("cat");
    const q = searchParams.get("q");
    if (cat) setSelectedCategory(cat);
    if (q) setSearchQuery(q);
  }, [searchParams, setSelectedCategory, setSearchQuery]);

  /* Filtro produktet sipas search dhe kategorise */
  let filtered = PRODUCTS;

  if (selectedCategory) {
    filtered = filtered.filter((p) => p.cat === selectedCategory);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.cat.toLowerCase().includes(q),
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg font-lato">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {/* Title + active filters */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-black text-dark mb-2">
            {selectedCategory || "Te gjitha produktet"}
          </h1>
          <p className="text-sm text-muted">
            {filtered.length} {filtered.length === 1 ? "produkt" : "produkte"} u
            gjeten
            {searchQuery && (
              <span>
                {" "}
                per "
                <span className="text-primary font-black">{searchQuery}</span>"
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar — kategori */}
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

              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.name)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-black transition-colors mb-1 bg-transparent border-0 cursor-pointer ${
                    selectedCategory === c.name
                      ? "bg-primary text-white"
                      : "text-dark hover:bg-bg"
                  }`}
                >
                  <span className="mr-2">{c.icon}</span>
                  {c.name}
                </button>
              ))}
            </div>
          </aside>

          {/* Grid produktet */}
          <div className="flex-1">
            {filtered.length === 0 ? (
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
                {filtered.map((p) => (
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
