/* ProductList admin — listim produktesh nga DB me Edit/Delete */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts, deleteProduct, getCategories } from "../../lib/api";

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

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (categoryFilter) params.category = categoryFilter;

      const data = await getProducts(params);
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError("Nuk mund të ngarkohen produktet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchProducts(), 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, [searchQuery, categoryFilter]);

  const handleDelete = async (id, name) => {
    if (!confirm(`Fshi produktin "${name}"?`)) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      alert("✅ Produkti u fshi");
    } catch (err) {
      alert(`Gabim: ${err.data?.error || err.message}`);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-black text-dark">Product List</h2>
          <p className="text-sm text-muted mt-1">
            {loading ? "Duke ngarkuar..." : `${products.length} produkte`}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
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

          <Link
            to="/admin/products/add"
            className="bg-primary hover:bg-green-600 text-white font-black text-sm px-5 py-2.5 rounded-full transition-colors flex items-center gap-2 no-underline"
          >
            ⊕ Shto Produkt
          </Link>
        </div>
      </div>

      {/* Lista */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-muted">Duke ngarkuar...</div>
        ) : error ? (
          <div className="p-10 text-center">
            <p className="text-5xl mb-3">⚠️</p>
            <p className="font-black text-danger">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-5xl mb-3">📦</p>
            <p className="font-black text-dark mb-2">Asnjë produkt</p>
            <Link
              to="/admin/products/add"
              className="inline-block mt-3 bg-primary text-white px-5 py-2 rounded-xl font-black hover:bg-green-600 no-underline"
            >
              ⊕ Shto produktin e parë
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg">
                <tr className="text-left text-xs text-muted">
                  <th className="px-4 py-3 font-black">Produkti</th>
                  <th className="px-4 py-3 font-black">SKU</th>
                  <th className="px-4 py-3 font-black">Kategoria</th>
                  <th className="px-4 py-3 font-black">Marka</th>
                  <th className="px-4 py-3 font-black">Çmimi</th>
                  <th className="px-4 py-3 font-black">Stoku</th>
                  <th className="px-4 py-3 font-black">Status</th>
                  <th className="px-4 py-3 font-black text-center">Veprime</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const emoji =
                    p.categories?.ikona ||
                    CATEGORY_EMOJI[p.categories?.emertimi] ||
                    "📦";
                  const hasDiscount =
                    p.cmimi_zbritjes &&
                    parseFloat(p.cmimi_zbritjes) > parseFloat(p.cmimi);

                  return (
                    <tr
                      key={p.id}
                      className="border-t border-bg hover:bg-bg/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-bg rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                            {emoji}
                          </div>
                          <div className="min-w-0">
                            <p className="font-black text-dark text-sm truncate">
                              {p.emertimi}
                            </p>
                            <p className="text-xs text-muted truncate">
                              ID: #{p.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted">
                        {p.sku || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-dark">
                        {p.categories?.emertimi}
                      </td>
                      <td className="px-4 py-3 text-sm text-dark">
                        {p.marka || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <p className="font-black text-primary">
                          €{parseFloat(p.cmimi).toLocaleString()}
                        </p>
                        {hasDiscount && (
                          <p className="text-xs text-muted line-through">
                            €{parseFloat(p.cmimi_zbritjes).toLocaleString()}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`font-black px-2 py-1 rounded-lg text-xs ${
                            p.sasia_stokut > 10
                              ? "bg-primary/10 text-primary"
                              : p.sasia_stokut > 0
                                ? "bg-warning/10 text-warning"
                                : "bg-red-100 text-danger"
                          }`}
                        >
                          {p.sasia_stokut}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-black px-2 py-1 rounded-full ${
                            p.aktiv
                              ? "bg-primary/10 text-primary"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {p.aktiv ? "✓ Aktiv" : "✗ Joaktiv"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-center">
                          <button
                            onClick={() =>
                              alert(
                                `Edit funksionon te /admin/products/edit/${p.id} (vjen ne hapin tjeter)`,
                              )
                            }
                            className="text-primary hover:bg-bg p-2 rounded-lg cursor-pointer bg-transparent border-0 transition-colors"
                            title="Edito"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.emertimi)}
                            className="text-danger hover:bg-red-50 p-2 rounded-lg cursor-pointer bg-transparent border-0 transition-colors"
                            title="Fshi"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
