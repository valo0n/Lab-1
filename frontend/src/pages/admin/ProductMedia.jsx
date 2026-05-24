/* ProductMedia — galeri me imazhe te produkteve nga DB */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts, getCategories } from "../../lib/api";

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

export default function ProductMedia() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid ose list
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error("Error loading media:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* Filtro produktet */
  const filteredProducts = products.filter((p) => {
    if (
      searchQuery &&
      !p.emertimi.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (categoryFilter && p.kategoria_id !== parseInt(categoryFilter)) {
      return false;
    }
    return true;
  });

  /* Stats */
  const totalProducts = products.length;
  const withImages = products.filter((p) => p.foto_kryesore).length;
  const withoutImages = totalProducts - withImages;

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-start justify-between mb-2">
            <p className="font-black text-dark text-sm">Total Produkte</p>
            <span className="text-2xl">📦</span>
          </div>
          <p className="text-2xl font-black text-dark">{totalProducts}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-start justify-between mb-2">
            <p className="font-black text-dark text-sm">Me Foto</p>
            <span className="text-2xl">🖼️</span>
          </div>
          <p className="text-2xl font-black text-primary">{withImages}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-start justify-between mb-2">
            <p className="font-black text-dark text-sm">Pa Foto</p>
            <span className="text-2xl">📋</span>
          </div>
          <p className="text-2xl font-black text-warning">{withoutImages}</p>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-black text-dark">Product Media</h2>
          <p className="text-sm text-muted mt-1">
            {loading
              ? "Duke ngarkuar..."
              : `${filteredProducts.length} produkte`}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="bg-white border border-bg rounded-full px-4 py-2.5 flex items-center gap-2 w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Kërko produkt..."
              className="bg-transparent outline-none text-sm flex-1 font-lato"
            />
            <span className="text-muted text-sm">🔍</span>
          </div>

          {/* Filter kategori */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-bg rounded-full px-4 py-2.5 text-sm font-black text-dark cursor-pointer outline-none"
          >
            <option value="">Të gjitha kategoritë</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emertimi}
              </option>
            ))}
          </select>

          {/* View toggle */}
          <div className="bg-white border border-bg rounded-full p-1 flex">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-full text-xs font-black border-0 cursor-pointer transition-colors ${
                viewMode === "grid"
                  ? "bg-primary text-white"
                  : "bg-transparent text-dark"
              }`}
            >
              ▦ Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-full text-xs font-black border-0 cursor-pointer transition-colors ${
                viewMode === "list"
                  ? "bg-primary text-white"
                  : "bg-transparent text-dark"
              }`}
            >
              ☰ List
            </button>
          </div>
        </div>
      </div>

      {/* Lista / Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl p-10 text-center text-muted shadow-card">
          Duke ngarkuar...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center shadow-card">
          <p className="text-5xl mb-3">🖼️</p>
          <p className="font-black text-dark mb-2">Asnjë media</p>
          <p className="text-sm text-muted">Provo me filter tjetër</p>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map((p) => {
            const emoji =
              p.categories?.ikona ||
              CATEGORY_EMOJI[p.categories?.emertimi] ||
              "📦";

            return (
              <div
                key={p.id}
                onClick={() => setSelectedProduct(p)}
                className="bg-white rounded-2xl shadow-card hover:shadow-hover hover:-translate-y-1 transition-all cursor-pointer overflow-hidden"
              >
                <div className="bg-bg h-32 flex items-center justify-center relative">
                  {p.foto_kryesore ? (
                    <img
                      src={p.foto_kryesore}
                      alt={p.emertimi}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-5xl">{emoji}</span>
                  )}
                  <span className="absolute top-2 right-2 text-xs font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {p.foto_kryesore ? "📷" : "🎨"}
                  </span>
                </div>

                <div className="p-3">
                  <p className="text-xs text-muted truncate">
                    {p.marka || "Paradox"}
                  </p>
                  <p className="font-black text-dark text-sm truncate">
                    {p.emertimi}
                  </p>
                  <p className="text-xs text-primary mt-1">
                    €{parseFloat(p.cmimi).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg">
                <tr className="text-left text-xs text-muted">
                  <th className="px-4 py-3 font-black">Media</th>
                  <th className="px-4 py-3 font-black">Produkti</th>
                  <th className="px-4 py-3 font-black">Kategoria</th>
                  <th className="px-4 py-3 font-black">Marka</th>
                  <th className="px-4 py-3 font-black">Çmimi</th>
                  <th className="px-4 py-3 font-black">Lloji</th>
                  <th className="px-4 py-3 font-black">SKU</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const emoji =
                    p.categories?.ikona ||
                    CATEGORY_EMOJI[p.categories?.emertimi] ||
                    "📦";

                  return (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedProduct(p)}
                      className="border-t border-bg hover:bg-bg/30 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="w-12 h-12 bg-bg rounded-xl flex items-center justify-center text-2xl">
                          {p.foto_kryesore ? (
                            <img
                              src={p.foto_kryesore}
                              alt=""
                              className="w-full h-full object-cover rounded-xl"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            emoji
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-black text-dark">
                        {p.emertimi}
                      </td>
                      <td className="px-4 py-3 text-sm text-dark">
                        {p.categories?.emertimi}
                      </td>
                      <td className="px-4 py-3 text-sm text-dark">
                        {p.marka || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm font-black text-primary">
                        €{parseFloat(p.cmimi).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`text-xs font-black px-2 py-1 rounded-full ${
                            p.foto_kryesore
                              ? "bg-primary/10 text-primary"
                              : "bg-warning/10 text-warning"
                          }`}
                        >
                          {p.foto_kryesore ? "📷 Foto" : "🎨 Emoji"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted">
                        {p.sku || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL DETAJET */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Preview i madh */}
            <div className="bg-bg h-64 flex items-center justify-center relative rounded-t-2xl">
              {selectedProduct.foto_kryesore ? (
                <img
                  src={selectedProduct.foto_kryesore}
                  alt={selectedProduct.emertimi}
                  className="w-full h-full object-cover rounded-t-2xl"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <span className="text-[150px]">
                  {selectedProduct.categories?.ikona ||
                    CATEGORY_EMOJI[selectedProduct.categories?.emertimi] ||
                    "📦"}
                </span>
              )}

              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow border-0 cursor-pointer font-black"
              >
                ✕
              </button>
            </div>

            {/* Info */}
            <div className="p-6">
              <p className="text-xs font-black text-primary bg-primary/10 px-3 py-1 rounded-full inline-block mb-3">
                {selectedProduct.marka || "Paradox"}
              </p>

              <h3 className="text-2xl font-black text-dark mb-2">
                {selectedProduct.emertimi}
              </h3>

              {selectedProduct.pershkrimi && (
                <p className="text-sm text-muted mb-4">
                  {selectedProduct.pershkrimi}
                </p>
              )}

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-bg rounded-xl p-3">
                  <p className="text-xs text-muted">SKU</p>
                  <p className="font-black text-dark">
                    {selectedProduct.sku || "—"}
                  </p>
                </div>
                <div className="bg-bg rounded-xl p-3">
                  <p className="text-xs text-muted">Kategoria</p>
                  <p className="font-black text-dark">
                    {selectedProduct.categories?.emertimi}
                  </p>
                </div>
                <div className="bg-bg rounded-xl p-3">
                  <p className="text-xs text-muted">Çmimi</p>
                  <p className="font-black text-primary">
                    €{parseFloat(selectedProduct.cmimi).toLocaleString()}
                  </p>
                </div>
                <div className="bg-bg rounded-xl p-3">
                  <p className="text-xs text-muted">Stoku</p>
                  <p
                    className={`font-black ${
                      selectedProduct.sasia_stokut > 0
                        ? "text-primary"
                        : "text-danger"
                    }`}
                  >
                    {selectedProduct.sasia_stokut} njësi
                  </p>
                </div>
              </div>

              {/* Foto URL */}
              <div className="bg-bg rounded-xl p-3 mb-4">
                <p className="text-xs text-muted mb-1">URL i Imazhit Kryesor</p>
                <p className="text-sm text-dark break-all">
                  {selectedProduct.foto_kryesore ||
                    "Nuk ka URL imazhi (përdoret emoji)"}
                </p>
              </div>

              <div className="flex gap-2">
                <Link
                  to={`/product/${selectedProduct.id}`}
                  className="flex-1 bg-bg text-dark text-center font-black py-2.5 rounded-xl no-underline hover:bg-bg/70 transition-colors"
                  onClick={() => setSelectedProduct(null)}
                >
                  👁️ Shiko në Dyqan
                </Link>
                <Link
                  to="/admin/products"
                  className="flex-1 bg-primary text-white text-center font-black py-2.5 rounded-xl no-underline hover:bg-green-600 transition-colors"
                  onClick={() => setSelectedProduct(null)}
                >
                  ✏️ Edito
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
