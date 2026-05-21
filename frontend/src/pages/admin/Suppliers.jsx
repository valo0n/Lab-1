/* Suppliers admin — CRUD per furnitoret */
import { useState, useEffect } from "react";
import { api } from "../../lib/api";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    emertimi: "",
    kontakti: "",
    email: "",
    telefoni: "",
    adresa: "",
    vendi: "",
  });

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const params = searchQuery
        ? `?search=${encodeURIComponent(searchQuery)}`
        : "";
      const data = await api.get(`/suppliers${params}`);
      setSuppliers(data);
    } catch (err) {
      setError("Nuk mund të ngarkohen furnitorët");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchSuppliers(), 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, [searchQuery]);

  const openModal = (supplier = null) => {
    if (supplier) {
      setEditingId(supplier.id);
      setForm({
        emertimi: supplier.emertimi || "",
        kontakti: supplier.kontakti || "",
        email: supplier.email || "",
        telefoni: supplier.telefoni || "",
        adresa: supplier.adresa || "",
        vendi: supplier.vendi || "",
      });
    } else {
      setEditingId(null);
      setForm({
        emertimi: "",
        kontakti: "",
        email: "",
        telefoni: "",
        adresa: "",
        vendi: "",
      });
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.emertimi.trim()) {
      alert("Emri është i detyrueshëm!");
      return;
    }
    try {
      if (editingId) {
        await api.put(`/suppliers/${editingId}`, form);
        alert("✅ Furnitori u përditësua!");
      } else {
        await api.post("/suppliers", form);
        alert("✅ Furnitori u krijua!");
      }
      setModalOpen(false);
      fetchSuppliers();
    } catch (err) {
      alert(`Gabim: ${err.data?.error || err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Fshi këtë furnitor?")) return;
    try {
      await api.delete(`/suppliers/${id}`);
      alert("✅ Furnitori u fshi");
      fetchSuppliers();
    } catch (err) {
      alert(`Gabim: ${err.data?.error || err.message}`);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-black text-dark">Suppliers</h2>
          <p className="text-sm text-muted mt-1">
            {loading ? "Duke ngarkuar..." : `${suppliers.length} furnitorë`}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-white border border-bg rounded-full px-4 py-2.5 flex items-center gap-2 w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Kërko..."
              className="bg-transparent outline-none text-sm flex-1 font-lato"
            />
            <span className="text-muted text-sm">🔍</span>
          </div>

          <button
            onClick={() => openModal()}
            className="bg-primary hover:bg-green-600 text-white font-black text-sm px-5 py-2.5 rounded-full border-0 cursor-pointer transition-colors"
          >
            ⊕ Shto Furnitor
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-10 text-center text-muted shadow-card">
          Duke ngarkuar...
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl p-10 text-center shadow-card">
          <p className="text-5xl mb-3">⚠️</p>
          <p className="font-black text-danger">{error}</p>
        </div>
      ) : suppliers.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center shadow-card">
          <p className="text-5xl mb-3">🏢</p>
          <p className="font-black text-dark mb-2">Asnjë furnitor</p>
          <button
            onClick={() => openModal()}
            className="mt-3 bg-primary text-white px-5 py-2 rounded-xl font-black border-0 cursor-pointer hover:bg-green-600"
          >
            ⊕ Shto Furnitorin e Parë
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suppliers.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl p-5 shadow-card">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center font-black text-lg">
                  {s.emertimi[0]?.toUpperCase()}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openModal(s)}
                    className="text-primary hover:bg-bg p-2 rounded-lg cursor-pointer bg-transparent border-0"
                    title="Edito"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="text-danger hover:bg-red-50 p-2 rounded-lg cursor-pointer bg-transparent border-0"
                    title="Fshi"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <h3 className="font-black text-dark text-lg mb-2">
                {s.emertimi}
              </h3>

              <div className="space-y-1.5 text-xs">
                {s.kontakti && (
                  <p className="text-muted">
                    <span className="font-black text-dark">👤 Kontakti:</span>{" "}
                    {s.kontakti}
                  </p>
                )}
                {s.email && (
                  <p className="text-muted truncate">
                    <span className="font-black text-dark">📧 Email:</span>{" "}
                    {s.email}
                  </p>
                )}
                {s.telefoni && (
                  <p className="text-muted">
                    <span className="font-black text-dark">📞 Tel:</span>{" "}
                    {s.telefoni}
                  </p>
                )}
                {s.vendi && (
                  <p className="text-muted">
                    <span className="font-black text-dark">🌍 Vendi:</span>{" "}
                    {s.vendi}
                  </p>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-bg">
                <span className="text-xs bg-primary/10 text-primary font-black px-2 py-1 rounded-full">
                  📦 {s._count?.purchase_orders || 0} porosi
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-black text-dark">
                {editingId ? "Edito Furnitorin" : "Shto Furnitor"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-2xl bg-transparent border-0 cursor-pointer text-muted"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {[
                { key: "emertimi", label: "Emri *", placeholder: "Apple Inc." },
                {
                  key: "kontakti",
                  label: "Personi i Kontaktit",
                  placeholder: "John Doe",
                },
                {
                  key: "email",
                  label: "Email",
                  placeholder: "contact@apple.com",
                },
                {
                  key: "telefoni",
                  label: "Telefon",
                  placeholder: "+1 234 567 890",
                },
                {
                  key: "adresa",
                  label: "Adresa",
                  placeholder: "1 Apple Park Way",
                },
                { key: "vendi", label: "Vendi", placeholder: "USA" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-black text-dark mb-1">
                    {f.label}
                  </label>
                  <input
                    type="text"
                    value={form[f.key]}
                    onChange={(e) =>
                      setForm({ ...form, [f.key]: e.target.value })
                    }
                    placeholder={f.placeholder}
                    className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 bg-bg text-dark font-black py-2.5 rounded-xl border-0 cursor-pointer"
              >
                Anulo
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-primary hover:bg-green-600 text-white font-black py-2.5 rounded-xl border-0 cursor-pointer"
              >
                {editingId ? "💾 Ruaj" : "⊕ Krijo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
