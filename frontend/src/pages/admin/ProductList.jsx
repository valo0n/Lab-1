/* ProductList admin — listim + Edit modal me URL foto + Delete */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getProducts,
  deleteProduct,
  updateProduct,
  getCategories,
} from "../../lib/api";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

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

  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditForm({
      emertimi: product.emertimi || "",
      marka: product.marka || "",
      modeli: product.modeli || "",
      sku: product.sku || "",
      pershkrimi: product.pershkrimi || "",
      cmimi: product.cmimi || "",
      cmimi_zbritjes: product.cmimi_zbritjes || "",
      sasia_stokut: product.sasia_stokut || 0,
      garancia_muaj: product.garancia_muaj || 12,
      kategoria_id: product.kategoria_id || "",
      foto_kryesore: product.foto_kryesore || "",
      aktiv: product.aktiv,
    });
  };

  const handleSave = async () => {
    if (!editForm.emertimi || !editForm.cmimi || !editForm.kategoria_id) {
      alert("Emri, çmimi dhe kategoria janë të detyrueshme!");
      return;
    }
    setSaving(true);
    try {
      await updateProduct(editingProduct.id, editForm);
      alert("✅ Produkti u përditësua!");
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      alert(`Gabim: ${err.data?.error || err.message}`);
    } finally {
      setSaving(false);
    }
  };

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

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-muted">Duke ngarkuar...</div>
        ) : products.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-5xl mb-3">📦</p>
            <p className="font-black text-dark">Asnjë produkt</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg">
                <tr className="text-left text-xs text-muted">
                  <th className="px-4 py-3 font-black">Produkti</th>
                  <th className="px-4 py-3 font-black">SKU</th>
                  <th className="px-4 py-3 font-black">Kategoria</th>
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
                      className="border-t border-bg hover:bg-bg/30"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-bg rounded-xl flex items-center justify-center overflow-hidden">
                            {p.foto_kryesore ? (
                              <img
                                src={p.foto_kryesore}
                                alt={p.emertimi}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.parentElement.innerHTML = `<span class="text-2xl">${emoji}</span>`;
                                }}
                              />
                            ) : (
                              <span className="text-2xl">{emoji}</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-black text-dark text-sm truncate">
                              {p.emertimi}
                            </p>
                            <p className="text-xs text-muted">
                              ID: #{p.id} · {p.marka}
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
                            onClick={() => openEditModal(p)}
                            className="text-primary hover:bg-bg p-2 rounded-lg cursor-pointer bg-transparent border-0"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.emertimi)}
                            className="text-danger hover:bg-red-50 p-2 rounded-lg cursor-pointer bg-transparent border-0"
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

      {/* EDIT MODAL */}
      {editingProduct && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setEditingProduct(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-xl font-black text-dark">
                  Edito Produktin
                </h3>
                <p className="text-xs text-muted mt-1">
                  ID: #{editingProduct.id}
                </p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-2xl bg-transparent border-0 cursor-pointer text-muted"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-black text-dark mb-2">
                  Emri *
                </label>
                <input
                  type="text"
                  value={editForm.emertimi}
                  onChange={(e) =>
                    setEditForm({ ...editForm, emertimi: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                />
              </div>

              {/* URL Foto */}
              <div className="md:col-span-2">
                <label className="block text-sm font-black text-dark mb-2">
                  📷 URL i Fotos
                </label>
                <input
                  type="text"
                  value={editForm.foto_kryesore}
                  onChange={(e) =>
                    setEditForm({ ...editForm, foto_kryesore: e.target.value })
                  }
                  placeholder="https://example.com/foto.jpg"
                  className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                />
                {editForm.foto_kryesore && (
                  <div className="mt-2 bg-bg rounded-xl p-3 flex items-center justify-center">
                    <img
                      src={editForm.foto_kryesore}
                      alt="Preview"
                      className="max-h-32 rounded-lg object-contain"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-black text-dark mb-2">
                  Marka
                </label>
                <input
                  type="text"
                  value={editForm.marka}
                  onChange={(e) =>
                    setEditForm({ ...editForm, marka: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-dark mb-2">
                  Modeli
                </label>
                <input
                  type="text"
                  value={editForm.modeli}
                  onChange={(e) =>
                    setEditForm({ ...editForm, modeli: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-dark mb-2">
                  SKU
                </label>
                <input
                  type="text"
                  value={editForm.sku}
                  onChange={(e) =>
                    setEditForm({ ...editForm, sku: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-dark mb-2">
                  Kategoria *
                </label>
                <select
                  value={editForm.kategoria_id}
                  onChange={(e) =>
                    setEditForm({ ...editForm, kategoria_id: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary bg-white cursor-pointer"
                >
                  <option value="">Zgjidh</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.emertimi}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-black text-dark mb-2">
                  Çmimi *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.cmimi}
                  onChange={(e) =>
                    setEditForm({ ...editForm, cmimi: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-dark mb-2">
                  Çmimi i Vjetër
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.cmimi_zbritjes}
                  onChange={(e) =>
                    setEditForm({ ...editForm, cmimi_zbritjes: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-dark mb-2">
                  Stoku
                </label>
                <input
                  type="number"
                  value={editForm.sasia_stokut}
                  onChange={(e) =>
                    setEditForm({ ...editForm, sasia_stokut: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-dark mb-2">
                  Garancia (muaj)
                </label>
                <input
                  type="number"
                  value={editForm.garancia_muaj}
                  onChange={(e) =>
                    setEditForm({ ...editForm, garancia_muaj: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-black text-dark mb-2">
                  Përshkrimi
                </label>
                <textarea
                  value={editForm.pershkrimi}
                  onChange={(e) =>
                    setEditForm({ ...editForm, pershkrimi: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.aktiv}
                    onChange={(e) =>
                      setEditForm({ ...editForm, aktiv: e.target.checked })
                    }
                    className="accent-primary w-5 h-5"
                  />
                  <span className="text-sm font-black text-dark">
                    Produkti është aktiv
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-2 mt-6 pt-4 border-t border-bg">
              <button
                onClick={() => setEditingProduct(null)}
                disabled={saving}
                className="flex-1 bg-bg text-dark font-black py-3 rounded-xl border-0 cursor-pointer"
              >
                Anulo
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-primary hover:bg-green-600 text-white font-black py-3 rounded-xl border-0 cursor-pointer"
              >
                {saving ? "Duke ruajtur..." : "💾 Ruaj"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
