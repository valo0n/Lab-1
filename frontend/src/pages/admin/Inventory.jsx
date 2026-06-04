/* Inventory admin — CRUD per levizjet e inventarit */
import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import { useToast } from "../../context/ToastContext";

const EMPTY = {
  produkti_id: "",
  lloji_levizjes: "hyrje",
  sasia: 1,
  referenca: "",
};

export default function Inventory() {
  const { showToast } = useToast();
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setMovements(await api.get("/inventory"));
    } catch {
      showToast("Nuk mund të ngarkohet inventari", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    api
      .get("/products")
      .then((d) => setProducts(d.products || d))
      .catch(() => {});
    // eslint-disable-next-line
  }, []);

  const openModal = (m = null) => {
    if (m) {
      setEditingId(m.id);
      setForm({
        produkti_id: m.produkti_id,
        lloji_levizjes: m.lloji_levizjes,
        sasia: m.sasia_hyrje || m.sasia_dalje || 1,
        referenca: m.referenca || "",
      });
    } else {
      setEditingId(null);
      setForm(EMPTY);
    }
    setModalOpen(true);
  };

  const save = async () => {
    if (!form.produkti_id || !form.sasia || form.sasia <= 0) {
      showToast("Zgjidh produktin dhe sasinë (>0)", "error");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/inventory/${editingId}`, form);
        showToast("Lëvizja u përditësua", "success");
      } else {
        await api.post("/inventory", form);
        showToast("Lëvizja u regjistrua", "success");
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(`Gabim: ${err.data?.error || err.message}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Fshi këtë lëvizje? Stoku do të rikthehet.")) return;
    try {
      await api.delete(`/inventory/${id}`);
      showToast("U fshi", "success");
      fetchData();
    } catch (err) {
      showToast(`Gabim: ${err.data?.error || err.message}`, "error");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-dark">
            Lëvizjet e Inventarit
          </h1>
          <p className="text-sm text-muted">
            {movements.length} lëvizje gjithsej
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-primary text-white font-black px-4 py-2 rounded-full cursor-pointer hover:bg-green-600 transition-colors border-0"
        >
          + Lëvizje e re
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-x-auto">
        {loading ? (
          <p className="p-6 text-muted">Duke ngarkuar...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted border-b border-bg">
                <th className="p-4">#ID</th>
                <th className="p-4">Produkti</th>
                <th className="p-4">Lloji</th>
                <th className="p-4">Sasia</th>
                <th className="p-4">Stoku tani</th>
                <th className="p-4">Referenca</th>
                <th className="p-4">Data</th>
                <th className="p-4 text-right">Veprime</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((m) => {
                const hyrje = m.lloji_levizjes === "hyrje";
                return (
                  <tr key={m.id} className="border-b border-bg last:border-0">
                    <td className="p-4 font-black text-dark">#{m.id}</td>
                    <td className="p-4 text-dark font-black">
                      {m.products?.emertimi || "—"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs font-black px-2 py-0.5 rounded-full ${hyrje ? "bg-primary/10 text-primary" : "bg-danger/10 text-danger"}`}
                      >
                        {hyrje ? "↑ Hyrje" : "↓ Dalje"}
                      </span>
                    </td>
                    <td className="p-4 font-black text-dark">
                      {hyrje ? m.sasia_hyrje : m.sasia_dalje}
                    </td>
                    <td className="p-4 text-muted">
                      {m.products?.sasia_stokut ?? "—"}
                    </td>
                    <td className="p-4 text-muted">{m.referenca || "—"}</td>
                    <td className="p-4 text-muted">
                      {new Date(m.data_levizjes).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => openModal(m)}
                        className="text-primary font-black mr-3 bg-transparent border-0 cursor-pointer"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => remove(m.id)}
                        className="text-danger font-black bg-transparent border-0 cursor-pointer"
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                );
              })}
              {movements.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-muted">
                    S'ka lëvizje inventari.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9998] p-4"
          onClick={() => !saving && setModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-black text-dark mb-4">
              {editingId ? "Edito Lëvizjen" : "Lëvizje e re"}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-black text-dark mb-1.5">
                  Produkti *
                </label>
                <select
                  value={form.produkti_id}
                  onChange={(e) =>
                    setForm({ ...form, produkti_id: e.target.value })
                  }
                  disabled={!!editingId}
                  className="w-full px-3 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary disabled:bg-bg"
                >
                  <option value="">Zgjidh produktin...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.emertimi}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-black text-dark mb-1.5">
                  Lloji i lëvizjes *
                </label>
                <select
                  value={form.lloji_levizjes}
                  onChange={(e) =>
                    setForm({ ...form, lloji_levizjes: e.target.value })
                  }
                  className="w-full px-3 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                >
                  <option value="hyrje">Hyrje (+ stok)</option>
                  <option value="dalje">Dalje (− stok)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-black text-dark mb-1.5">
                  Sasia *
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.sasia}
                  onChange={(e) => setForm({ ...form, sasia: e.target.value })}
                  className="w-full px-3 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-dark mb-1.5">
                  Referenca
                </label>
                <input
                  value={form.referenca}
                  onChange={(e) =>
                    setForm({ ...form, referenca: e.target.value })
                  }
                  placeholder="p.sh. Fatura #123, kthim, etj."
                  className="w-full px-3 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setModalOpen(false)}
                disabled={saving}
                className="flex-1 border-2 border-bg text-muted font-black py-2.5 rounded-full cursor-pointer hover:bg-bg transition-colors"
              >
                Anulo
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="flex-1 bg-primary text-white font-black py-2.5 rounded-full cursor-pointer hover:bg-green-600 transition-colors disabled:opacity-60"
              >
                {saving ? "Duke ruajtur..." : "Ruaj"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
