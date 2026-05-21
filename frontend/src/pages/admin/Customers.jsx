/* Customers admin — Block + Delete me 2 butona */
import { useState, useEffect } from "react";
import { api } from "../../lib/api";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = searchQuery
        ? `?search=${encodeURIComponent(searchQuery)}`
        : "";
      const data = await api.get(`/customers${params}`);
      setCustomers(data);
    } catch (err) {
      console.error("Fetch customers error:", err);
      setError("Nuk mund të ngarkohen klientët");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchCustomers(), 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, [searchQuery]);

  const handleViewDetails = async (customer) => {
    try {
      const fullData = await api.get(`/customers/${customer.id}`);
      setSelectedCustomer(fullData);
      setEditForm({
        emri: fullData.emri || "",
        mbiemri: fullData.mbiemri || "",
        email: fullData.email || "",
        telefoni: fullData.telefoni || "",
        adresa: fullData.adresa || "",
        qyteti: fullData.qyteti || "",
        kodi_postar: fullData.kodi_postar || "",
        shteti: fullData.shteti || "",
      });
      setEditMode(false);
    } catch (err) {
      alert("Gabim në marrjen e detajeve");
    }
  };

  const handleSave = async () => {
    try {
      await api.put(`/customers/${selectedCustomer.id}`, editForm);
      alert("✅ Klienti u përditësua me sukses!");
      setEditMode(false);
      fetchCustomers();
      const updated = await api.get(`/customers/${selectedCustomer.id}`);
      setSelectedCustomer(updated);
    } catch (err) {
      alert(`Gabim: ${err.data?.error || err.message}`);
    }
  };

  /* BLLOKOJ - caktivizo userin (mund te aktivizohet prap) */
  const handleBlock = async (id, isCurrentlyActive, name) => {
    const action = isCurrentlyActive ? "BLLOKOSH" : "AKTIVIZOSH";
    if (
      !confirm(
        `A je i sigurt që do të ${action} klientin "${name}"?\n\n${isCurrentlyActive ? "Useri NUK do mund të logohet por të dhënat ruhen." : "Useri do mund të logohet prap."}`,
      )
    )
      return;

    try {
      await api.put(`/customers/${id}/block`, { block: isCurrentlyActive });
      alert(`✅ Klienti ${isCurrentlyActive ? "u bllokua" : "u aktivizua"}!`);
      fetchCustomers();
    } catch (err) {
      alert(`Gabim: ${err.data?.error || err.message}`);
    }
  };

  /* FSHI PERGJITHMONE - me 2 konfirmime */
  const handleDelete = async (id, name) => {
    if (
      !confirm(
        `⚠️ KUJDES!\n\nDo të fshish PËRGJITHMONË klientin "${name}".\n\nKjo do të fshijë:\n- Llogarinë e user-it\n- Wishlist\n- Cart\n- Reviews\n- Service requests\n- Warranties\n\nA je i sigurt?`,
      )
    )
      return;
    if (
      !confirm(
        `🚨 KONFIRMIM I FUNDIT\n\nKy veprim NUK MUND TË KTHEHET MBRAPSHT!\n\nKlikoni OK për të fshirë "${name}" përgjithmonë.`,
      )
    )
      return;

    try {
      await api.delete(`/customers/${id}`);
      alert("✅ Klienti u fshi përgjithmonë");
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      setSelectedCustomer(null);
    } catch (err) {
      alert(`Gabim: ${err.data?.error || err.message}`);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-black text-dark">Customers</h2>
          <p className="text-sm text-muted mt-1">
            {loading
              ? "Duke ngarkuar..."
              : `${customers.length} klientë gjithsej`}
          </p>
        </div>

        <div className="bg-white border border-bg rounded-full px-4 py-2.5 flex items-center gap-2 w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Kërko sipas emrit, emailit..."
            className="bg-transparent outline-none text-sm flex-1 font-lato"
          />
          <span className="text-muted text-sm">🔍</span>
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
        ) : customers.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-5xl mb-3">👥</p>
            <p className="font-black text-dark">Asnjë klient ende</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg">
                <tr className="text-left text-xs text-muted">
                  <th className="px-4 py-3 font-black">#ID</th>
                  <th className="px-4 py-3 font-black">Klienti</th>
                  <th className="px-4 py-3 font-black">Email</th>
                  <th className="px-4 py-3 font-black">Telefon</th>
                  <th className="px-4 py-3 font-black">Qyteti</th>
                  <th className="px-4 py-3 font-black">Porosi</th>
                  <th className="px-4 py-3 font-black">Total Spent</th>
                  <th className="px-4 py-3 font-black">Status</th>
                  <th className="px-4 py-3 font-black text-center">Veprime</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr
                    key={c.id}
                    className="border-t border-bg hover:bg-bg/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-black text-dark">
                      #{c.id}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 ${c.userActive ? "bg-primary" : "bg-gray-400"} text-white rounded-full flex items-center justify-center font-black text-xs`}
                        >
                          {c.emri?.[0]?.toUpperCase()}
                          {c.mbiemri?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-black text-dark">
                          {c.emri} {c.mbiemri}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted">{c.email}</td>
                    <td className="px-4 py-3 text-sm text-dark">
                      {c.telefoni || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-dark">
                      {c.qyteti || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="bg-bg px-2 py-1 rounded-lg font-black text-dark">
                        {c.ordersCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-black text-primary">
                      €{c.totalSpent.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      {c.userActive ? (
                        <span className="text-xs font-black bg-primary/10 text-primary px-2 py-1 rounded-full">
                          ✓ Aktiv
                        </span>
                      ) : (
                        <span className="text-xs font-black bg-red-100 text-danger px-2 py-1 rounded-full">
                          🚫 Bllokuar
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-center">
                        <button
                          onClick={() => handleViewDetails(c)}
                          className="text-primary hover:bg-bg p-2 rounded-lg cursor-pointer bg-transparent border-0 transition-colors"
                          title="Shiko detajet"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() =>
                            handleBlock(
                              c.id,
                              c.userActive,
                              `${c.emri} ${c.mbiemri}`,
                            )
                          }
                          className={`p-2 rounded-lg cursor-pointer bg-transparent border-0 transition-colors ${
                            c.userActive
                              ? "text-warning hover:bg-yellow-50"
                              : "text-primary hover:bg-bg"
                          }`}
                          title={c.userActive ? "Bllokoj" : "Aktivizoj"}
                        >
                          {c.userActive ? "🚫" : "✓"}
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(c.id, `${c.emri} ${c.mbiemri}`)
                          }
                          className="text-danger hover:bg-red-50 p-2 rounded-lg cursor-pointer bg-transparent border-0 transition-colors"
                          title="Fshi përgjithmonë"
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

      {/* Info card */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-sm">
        <p className="font-black text-dark mb-1">
          💡 Si funksionojnë veprimet:
        </p>
        <ul className="text-muted space-y-1 ml-4">
          <li>
            <span className="font-black">👁️ Detajet</span> — hap modal me të
            dhëna komplete
          </li>
          <li>
            <span className="font-black">🚫 Bllokoj</span> — userin nuk hyn dot,
            por mbet në DB (rekomandohet)
          </li>
          <li>
            <span className="font-black">🗑️ Fshi</span> — fshin përgjithmonë
            (vetëm nëse s'ka porosi)
          </li>
        </ul>
      </div>

      {/* Modal me detajet */}
      {selectedCustomer && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-black text-dark">
                {selectedCustomer.emri} {selectedCustomer.mbiemri}
              </h3>
              <div className="flex gap-2">
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="bg-primary text-white font-black text-sm px-4 py-2 rounded-xl border-0 cursor-pointer hover:bg-green-600"
                  >
                    ✏️ Edito
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setEditMode(false)}
                      className="bg-bg text-dark font-black text-sm px-4 py-2 rounded-xl border-0 cursor-pointer"
                    >
                      Anulo
                    </button>
                    <button
                      onClick={handleSave}
                      className="bg-primary text-white font-black text-sm px-4 py-2 rounded-xl border-0 cursor-pointer hover:bg-green-600"
                    >
                      💾 Ruaj
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-2xl bg-transparent border-0 cursor-pointer text-muted hover:text-dark px-2"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: "Emri", key: "emri" },
                { label: "Mbiemri", key: "mbiemri" },
                { label: "Email", key: "email" },
                { label: "Telefon", key: "telefoni" },
                { label: "Adresa", key: "adresa" },
                { label: "Qyteti", key: "qyteti" },
                { label: "Kodi Postar", key: "kodi_postar" },
                { label: "Shteti", key: "shteti" },
              ].map((field) => (
                <div key={field.key} className="bg-bg rounded-xl p-3">
                  <p className="text-xs text-muted mb-1">{field.label}</p>
                  {editMode ? (
                    <input
                      type="text"
                      value={editForm[field.key] || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          [field.key]: e.target.value,
                        })
                      }
                      className="w-full bg-white px-2 py-1 rounded text-sm outline-none border border-bg focus:border-primary font-black text-dark"
                    />
                  ) : (
                    <p className="font-black text-dark text-sm">
                      {selectedCustomer[field.key] || "—"}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <h4 className="font-black text-dark mb-3">
              Porosit ({selectedCustomer.orders?.length || 0})
            </h4>
            {selectedCustomer.orders?.length === 0 ? (
              <p className="text-muted text-sm text-center py-5">
                Asnjë porosi
              </p>
            ) : (
              <div className="space-y-2">
                {selectedCustomer.orders?.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between bg-bg rounded-xl p-3"
                  >
                    <div>
                      <p className="font-black text-dark text-sm">
                        #ORD{order.id.toString().padStart(6, "0")}
                      </p>
                      <p className="text-xs text-muted">
                        {new Date(order.data_porosis).toLocaleDateString(
                          "sq-AL",
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-primary text-sm">
                        €{parseFloat(order.shuma_totale).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted capitalize">
                        {order.statusi_porosis}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
