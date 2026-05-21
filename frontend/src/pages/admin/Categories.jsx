/* Categories admin — CRUD i plote me modal */
import { useState, useEffect } from "react";
import { api } from "../../lib/api";

const EMOJI_OPTIONS = [
  "📱",
  "💻",
  "🎧",
  "🎮",
  "📺",
  "📷",
  "⌚",
  "🔌",
  "🖥️",
  "⌨️",
  "🖱️",
  "🔋",
  "📦",
];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    emertimi: "",
    pershkrimi: "",
    ikona: "📦",
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await api.get("/categories");
      setCategories(data);
    } catch (err) {
      setError("Nuk mund të ngarkohen kategorit");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((c) =>
    c.emertimi.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  /* Hap modal për krijim ose edit */
  const openModal = (category = null) => {
    if (category) {
      setEditingId(category.id);
      setForm({
        emertimi: category.emertimi || "",
        pershkrimi: category.pershkrimi || "",
        ikona: category.ikona || "📦",
      });
    } else {
      setEditingId(null);
      setForm({ emertimi: "", pershkrimi: "", ikona: "📦" });
    }
    setModalOpen(true);
  };

  /* Ruaj (krijoj ose edit) */
  const handleSave = async () => {
    if (!form.emertimi.trim()) {
      alert("Emri i kategorisë është i detyrueshëm!");
      return;
    }

    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, form);
        alert("✅ Kategoria u përditësua!");
      } else {
        await api.post("/categories", form);
        alert("✅ Kategoria u krijua!");
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      alert(`Gabim: ${err.data?.error || err.message}`);
    }
  };

  /* Fshi */
  const handleDelete = async (id) => {
    if (!confirm("A je i sigurt që do të fshish këtë kategori?")) return;
    try {
      await api.delete(`/categories/${id}`);
      alert("✅ Kategoria u fshi");
      fetchCategories();
    } catch (err) {
      alert(`Gabim: ${err.data?.error || err.message}`);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-black text-dark">Categories</h2>
          <p className="text-sm text-muted mt-1">
            {loading
              ? "Duke ngarkuar..."
              : `${categories.length} kategori gjithsej`}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-white border border-bg rounded-full px-4 py-2.5 flex items-center gap-2 w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Kërko kategori..."
              className="bg-transparent outline-none text-sm flex-1 font-lato"
            />
            <span className="text-muted text-sm">🔍</span>
          </div>

          <button
            onClick={() => openModal()}
            className="bg-primary hover:bg-green-600 text-white font-black text-sm px-5 py-2.5 rounded-full border-0 cursor-pointer transition-colors flex items-center gap-2"
          >
            ⊕ Shto Kategori
          </button>
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="bg-white rounded-2xl p-10 text-center text-muted shadow-card">
          Duke ngarkuar...
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl p-10 text-center shadow-card">
          <p className="text-5xl mb-3">⚠️</p>
          <p className="font-black text-danger">{error}</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center shadow-card">
          <p className="text-5xl mb-3">📂</p>
          <p className="font-black text-dark mb-2">Asnjë kategori</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl p-5 shadow-card hover:shadow-hover transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-14 h-14 bg-bg rounded-2xl flex items-center justify-center text-3xl">
                  {cat.ikona || "📦"}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openModal(cat)}
                    className="text-primary hover:bg-bg p-2 rounded-lg cursor-pointer bg-transparent border-0 transition-colors"
                    title="Edito"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-danger hover:bg-red-50 p-2 rounded-lg cursor-pointer bg-transparent border-0 transition-colors"
                    title="Fshi"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <h3 className="font-black text-dark text-lg mb-1">
                {cat.emertimi}
              </h3>
              {cat.pershkrimi && (
                <p className="text-xs text-muted line-clamp-2 mb-3">
                  {cat.pershkrimi}
                </p>
              )}

              <div className="flex items-center gap-2 text-xs">
                <span className="bg-primary/10 text-primary font-black px-2 py-1 rounded-full">
                  📦 {cat._count?.products || 0} produkte
                </span>
                {cat.aktiv && (
                  <span className="bg-bg text-dark font-black px-2 py-1 rounded-full">
                    ✓ Aktive
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Krijo/Edito */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-black text-dark">
                {editingId ? "Edito Kategorinë" : "Shto Kategori të Re"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-2xl bg-transparent border-0 cursor-pointer text-muted hover:text-dark"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-black text-dark mb-2">
                  Emri *
                </label>
                <input
                  type="text"
                  value={form.emertimi}
                  onChange={(e) =>
                    setForm({ ...form, emertimi: e.target.value })
                  }
                  placeholder="Smartphones"
                  className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-dark mb-2">
                  Përshkrimi
                </label>
                <textarea
                  value={form.pershkrimi}
                  onChange={(e) =>
                    setForm({ ...form, pershkrimi: e.target.value })
                  }
                  rows={3}
                  placeholder="Përshkrim i shkurtër..."
                  className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-dark mb-2">
                  Zgjidh Ikonën
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setForm({ ...form, ikona: emoji })}
                      className={`text-2xl p-2 rounded-xl border-2 cursor-pointer transition-all ${
                        form.ikona === emoji
                          ? "border-primary bg-bg scale-110"
                          : "border-transparent hover:border-bg"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setModalOpen(false)}
                  className="flex-1 bg-bg text-dark font-black py-2.5 rounded-xl border-0 cursor-pointer hover:bg-bg/70 transition-colors"
                >
                  Anulo
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-primary hover:bg-green-600 text-white font-black py-2.5 rounded-xl border-0 cursor-pointer transition-colors"
                >
                  {editingId ? "💾 Ruaj" : "⊕ Krijo"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
