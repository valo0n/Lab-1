/* Warranties admin — listim, krijo, edit, fshi garancite */
import { useState, useEffect } from "react";
import { api } from "../../lib/api";

export default function Warranties() {
  const [warranties, setWarranties] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    produkti_id: "",
    klienti_id: "",
    data_fillimit: "",
    data_skadimit: "",
    lloji: "Standard",
    statusi: "Aktive",
  });

  const fetchWarranties = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (statusFilter !== "all") params.append("status", statusFilter);
      const data = await api.get(`/warranties?${params.toString()}`);
      setWarranties(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarranties();
    /* Ngarko produkte dhe klient per dropdown */
    api.get("/products").then(setProducts).catch(console.error);
    api.get("/customers").then(setCustomers).catch(console.error);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchWarranties(), 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, [searchQuery, statusFilter]);

  const openModal = (warranty = null) => {
    if (warranty) {
      setEditingId(warranty.id);
      setForm({
        produkti_id: warranty.produkti_id,
        klienti_id: warranty.klienti_id,
        data_fillimit: warranty.data_fillimit?.split("T")[0] || "",
        data_skadimit: warranty.data_skadimit?.split("T")[0] || "",
        lloji: warranty.lloji || "Standard",
        statusi: warranty.statusi || "Aktive",
      });
    } else {
      setEditingId(null);
      const today = new Date();
      const inOneYear = new Date();
      inOneYear.setFullYear(inOneYear.getFullYear() + 1);
      setForm({
        produkti_id: "",
        klienti_id: "",
        data_fillimit: today.toISOString().split("T")[0],
        data_skadimit: inOneYear.toISOString().split("T")[0],
        lloji: "Standard",
        statusi: "Aktive",
      });
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (
      !form.produkti_id ||
      !form.klienti_id ||
      !form.data_fillimit ||
      !form.data_skadimit
    ) {
      alert("Të gjitha fushat janë të detyrueshme!");
      return;
    }
    try {
      if (editingId) {
        await api.put(`/warranties/${editingId}`, form);
        alert("✅ Garancia u përditësua!");
      } else {
        await api.post("/warranties", form);
        alert("✅ Garancia u krijua!");
      }
      setModalOpen(false);
      fetchWarranties();
    } catch (err) {
      alert(`Gabim: ${err.data?.error || err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Fshi këtë garanci?")) return;
    try {
      await api.delete(`/warranties/${id}`);
      fetchWarranties();
    } catch (err) {
      alert(`Gabim: ${err.data?.error || err.message}`);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-black text-dark">Warranties</h2>
          <p className="text-sm text-muted mt-1">
            {loading ? "Duke ngarkuar..." : `${warranties.length} garanci`}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-white border border-bg rounded-full px-4 py-2.5 flex items-center gap-2 w-56">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Kërko..."
              className="bg-transparent outline-none text-sm flex-1"
            />
            <span className="text-muted text-sm">🔍</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-bg rounded-full px-4 py-2.5 text-sm font-black text-dark cursor-pointer outline-none"
          >
            <option value="all">Të gjitha</option>
            <option value="Aktive">Aktive</option>
            <option value="Skaduar">Skaduar</option>
            <option value="Anuluar">Anuluar</option>
          </select>

          <button
            onClick={() => openModal()}
            className="bg-primary hover:bg-green-600 text-white font-black text-sm px-5 py-2.5 rounded-full border-0 cursor-pointer transition-colors"
          >
            ⊕ Shto Garanci
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-muted">Duke ngarkuar...</div>
        ) : warranties.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-5xl mb-3">🛡️</p>
            <p className="font-black text-dark">Asnjë garanci</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg">
                <tr className="text-left text-xs text-muted">
                  <th className="px-4 py-3 font-black">#ID</th>
                  <th className="px-4 py-3 font-black">Produkti</th>
                  <th className="px-4 py-3 font-black">Klienti</th>
                  <th className="px-4 py-3 font-black">Lloji</th>
                  <th className="px-4 py-3 font-black">Skadon</th>
                  <th className="px-4 py-3 font-black">Status</th>
                  <th className="px-4 py-3 font-black text-center">Veprime</th>
                </tr>
              </thead>
              <tbody>
                {warranties.map((w) => (
                  <tr key={w.id} className="border-t border-bg hover:bg-bg/30">
                    <td className="px-4 py-3 text-sm font-black text-dark">
                      #{w.id}
                    </td>
                    <td className="px-4 py-3 text-sm font-black text-dark">
                      {w.products?.emertimi}
                    </td>
                    <td className="px-4 py-3 text-sm text-dark">
                      {w.customers?.emri} {w.customers?.mbiemri}
                    </td>
                    <td className="px-4 py-3 text-sm text-dark">{w.lloji}</td>
                    <td className="px-4 py-3 text-sm">
                      <p className="text-dark">
                        {new Date(w.data_skadimit).toLocaleDateString("sq-AL")}
                      </p>
                      <p
                        className={`text-xs ${w.expired ? "text-danger font-black" : "text-muted"}`}
                      >
                        {w.expired
                          ? `Skaduar ${Math.abs(w.daysLeft)} ditë më parë`
                          : `${w.daysLeft} ditë të mbetura`}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-black px-2 py-1 rounded-full ${
                          w.statusi === "Aktive" && !w.expired
                            ? "bg-primary/10 text-primary"
                            : "bg-red-100 text-danger"
                        }`}
                      >
                        {w.expired ? "Skaduar" : w.statusi}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-center">
                        <button
                          onClick={() => openModal(w)}
                          className="text-primary hover:bg-bg p-2 rounded-lg cursor-pointer bg-transparent border-0"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(w.id)}
                          className="text-danger hover:bg-red-50 p-2 rounded-lg cursor-pointer bg-transparent border-0"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
                {editingId ? "Edito Garancinë" : "Shto Garanci"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-2xl bg-transparent border-0 cursor-pointer text-muted"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-black text-dark mb-1">
                  Produkti *
                </label>
                <select
                  value={form.produkti_id}
                  onChange={(e) =>
                    setForm({ ...form, produkti_id: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary bg-white cursor-pointer"
                >
                  <option value="">Zgjidh produkt</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.emertimi}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-black text-dark mb-1">
                  Klienti *
                </label>
                <select
                  value={form.klienti_id}
                  onChange={(e) =>
                    setForm({ ...form, klienti_id: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary bg-white cursor-pointer"
                >
                  <option value="">Zgjidh klient</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.emri} {c.mbiemri}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-black text-dark mb-1">
                    Data Fillimit *
                  </label>
                  <input
                    type="date"
                    value={form.data_fillimit}
                    onChange={(e) =>
                      setForm({ ...form, data_fillimit: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-dark mb-1">
                    Data Skadimit *
                  </label>
                  <input
                    type="date"
                    value={form.data_skadimit}
                    onChange={(e) =>
                      setForm({ ...form, data_skadimit: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-black text-dark mb-1">
                    Lloji
                  </label>
                  <select
                    value={form.lloji}
                    onChange={(e) =>
                      setForm({ ...form, lloji: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary bg-white cursor-pointer"
                  >
                    <option>Standard</option>
                    <option>Extended</option>
                    <option>Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-black text-dark mb-1">
                    Statusi
                  </label>
                  <select
                    value={form.statusi}
                    onChange={(e) =>
                      setForm({ ...form, statusi: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary bg-white cursor-pointer"
                  >
                    <option>Aktive</option>
                    <option>Skaduar</option>
                    <option>Anuluar</option>
                  </select>
                </div>
              </div>
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
