/* Purchase Orders admin — CRUD per porosite e furnizimit */
import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import { useToast } from "../../context/ToastContext";

const STATUSES = ["ne pritje", "pranuar", "anuluar"];
const STATUS_STYLE = {
  "ne pritje": "text-warning",
  pranuar: "text-primary",
  anuluar: "text-danger",
};

export default function PurchaseOrders() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [furnitori_id, setFurnitoriId] = useState("");
  const [items, setItems] = useState([
    { produkti_id: "", sasia: 1, cmimi_njesi: "" },
  ]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setOrders(await api.get("/purchase-orders"));
    } catch {
      showToast("Nuk mund të ngarkohen porositë", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    api
      .get("/suppliers")
      .then(setSuppliers)
      .catch(() => {});
    api
      .get("/products")
      .then((d) => setProducts(d.products || d))
      .catch(() => {});
    // eslint-disable-next-line
  }, []);

  const openModal = () => {
    setFurnitoriId("");
    setItems([{ produkti_id: "", sasia: 1, cmimi_njesi: "" }]);
    setModalOpen(true);
  };

  const updateItem = (i, field, value) => {
    setItems((prev) =>
      prev.map((it, idx) => (idx === i ? { ...it, [field]: value } : it)),
    );
  };
  const addItem = () =>
    setItems((p) => [...p, { produkti_id: "", sasia: 1, cmimi_njesi: "" }]);
  const removeItem = (i) => setItems((p) => p.filter((_, idx) => idx !== i));

  const total = items.reduce(
    (s, it) =>
      s + (parseFloat(it.cmimi_njesi) || 0) * (parseInt(it.sasia) || 0),
    0,
  );

  const save = async () => {
    if (
      !furnitori_id ||
      items.some((it) => !it.produkti_id || !it.cmimi_njesi)
    ) {
      showToast("Zgjidh furnitorin dhe plotëso produktet", "error");
      return;
    }
    setSaving(true);
    try {
      await api.post("/purchase-orders", { furnitori_id, items });
      showToast("Porosia e furnizimit u krijua", "success");
      setModalOpen(false);
      fetchOrders();
    } catch (err) {
      showToast(`Gabim: ${err.data?.error || err.message}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (id, statusi) => {
    try {
      await api.put(`/purchase-orders/${id}`, { statusi });
      showToast(
        statusi === "pranuar"
          ? "U pranua — stoku u përditësua"
          : "Statusi u ndryshua",
        "success",
      );
      fetchOrders();
    } catch (err) {
      showToast(`Gabim: ${err.data?.error || err.message}`, "error");
    }
  };

  const remove = async (id) => {
    if (!confirm("Fshi këtë porosi furnizimi?")) return;
    try {
      await api.delete(`/purchase-orders/${id}`);
      showToast("U fshi", "success");
      fetchOrders();
    } catch (err) {
      showToast(`Gabim: ${err.data?.error || err.message}`, "error");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-dark">
            Porositë e Furnizimit
          </h1>
          <p className="text-sm text-muted">{orders.length} porosi gjithsej</p>
        </div>
        <button
          onClick={openModal}
          className="bg-primary text-white font-black px-4 py-2 rounded-full cursor-pointer hover:bg-green-600 transition-colors border-0"
        >
          + Porosi e re
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
                <th className="p-4">Furnitori</th>
                <th className="p-4">Data</th>
                <th className="p-4">Produkte</th>
                <th className="p-4">Totali</th>
                <th className="p-4">Statusi</th>
                <th className="p-4 text-right">Veprime</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-bg last:border-0">
                  <td className="p-4 font-black text-dark">#{o.id}</td>
                  <td className="p-4 text-dark font-black">
                    {o.suppliers?.emertimi || "—"}
                  </td>
                  <td className="p-4 text-muted">
                    {new Date(o.data_porosis).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-muted">
                    {o.purchase_order_details?.length || 0} artikuj
                  </td>
                  <td className="p-4 font-black text-dark">
                    €{parseFloat(o.shuma_totale).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <select
                      value={o.statusi}
                      onChange={(e) => changeStatus(o.id, e.target.value)}
                      className={`bg-bg rounded-lg px-2 py-1 text-xs font-black border-0 cursor-pointer ${STATUS_STYLE[o.statusi] || "text-dark"}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => remove(o.id)}
                      className="text-danger font-black bg-transparent border-0 cursor-pointer"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-muted">
                    S'ka porosi furnizimi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal krijimi */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9998] p-4"
          onClick={() => !saving && setModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-black text-dark mb-4">
              Porosi e re furnizimi
            </h3>

            <label className="block text-sm font-black text-dark mb-1.5">
              Furnitori *
            </label>
            <select
              value={furnitori_id}
              onChange={(e) => setFurnitoriId(e.target.value)}
              className="w-full px-3 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary mb-4"
            >
              <option value="">Zgjidh furnitorin...</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.emertimi}
                </option>
              ))}
            </select>

            <p className="text-sm font-black text-dark mb-2">Produktet</p>
            <div className="space-y-2 mb-3">
              {items.map((it, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <select
                    value={it.produkti_id}
                    onChange={(e) =>
                      updateItem(i, "produkti_id", e.target.value)
                    }
                    className="flex-1 px-2 py-2 border border-bg rounded-lg text-sm outline-none focus:border-primary"
                  >
                    <option value="">Produkti...</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.emertimi}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={it.sasia}
                    onChange={(e) => updateItem(i, "sasia", e.target.value)}
                    placeholder="Sasia"
                    className="w-20 px-2 py-2 border border-bg rounded-lg text-sm outline-none focus:border-primary"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={it.cmimi_njesi}
                    onChange={(e) =>
                      updateItem(i, "cmimi_njesi", e.target.value)
                    }
                    placeholder="Çmimi"
                    className="w-24 px-2 py-2 border border-bg rounded-lg text-sm outline-none focus:border-primary"
                  />
                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(i)}
                      className="text-danger font-black bg-transparent border-0 cursor-pointer px-2"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={addItem}
              className="text-primary font-black text-sm bg-transparent border-0 cursor-pointer mb-4"
            >
              + Shto produkt
            </button>

            <div className="flex justify-between items-center border-t border-bg pt-3 mb-4">
              <span className="font-black text-dark">Totali</span>
              <span className="font-black text-primary text-lg">
                €{total.toLocaleString()}
              </span>
            </div>

            <div className="flex gap-2">
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
                {saving ? "Duke ruajtur..." : "Krijo porosinë"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
