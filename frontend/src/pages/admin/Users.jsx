/* Users admin — CRUD per perdoruesit e sistemit + rolet */
import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import { useToast } from "../../context/ToastContext";

const EMPTY = {
  user_name: "",
  email: "",
  password: "",
  emri_plote: "",
  telefoni: "",
  roles: [],
  aktiv: true,
};

export default function Users() {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = search ? `?search=${encodeURIComponent(search)}` : "";
      setUsers(await api.get(`/users${params}`));
    } catch {
      showToast("Nuk mund të ngarkohen përdoruesit", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api
      .get("/users/roles/all")
      .then(setAllRoles)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(fetchUsers, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [search]);

  const openModal = (u = null) => {
    if (u) {
      setEditingId(u.id);
      setForm({
        user_name: u.user_name,
        email: u.email,
        password: "",
        emri_plote: u.emri_plote || "",
        telefoni: u.telefoni || "",
        roles: u.roles || [],
        aktiv: u.aktiv,
      });
    } else {
      setEditingId(null);
      setForm(EMPTY);
    }
    setModalOpen(true);
  };

  const toggleRole = (name) => {
    setForm((p) => ({
      ...p,
      roles: p.roles.includes(name)
        ? p.roles.filter((r) => r !== name)
        : [...p.roles, name],
    }));
  };

  const save = async () => {
    if (!form.user_name || !form.email || (!editingId && !form.password)) {
      showToast("Username, email dhe password janë të detyrueshëm", "error");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        const payload = {
          emri_plote: form.emri_plote,
          telefoni: form.telefoni,
          aktiv: form.aktiv,
          roles: form.roles,
        };
        if (form.password) payload.password = form.password;
        await api.put(`/users/${editingId}`, payload);
        showToast("Përdoruesi u përditësua", "success");
      } else {
        await api.post("/users", form);
        showToast("Përdoruesi u krijua", "success");
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      showToast(`Gabim: ${err.data?.error || err.message}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Fshi këtë përdorues?")) return;
    try {
      await api.delete(`/users/${id}`);
      showToast("Përdoruesi u fshi", "success");
      fetchUsers();
    } catch (err) {
      showToast(`Gabim: ${err.data?.error || err.message}`, "error");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-dark">
            Përdoruesit e Sistemit
          </h1>
          <p className="text-sm text-muted">
            {users.length} përdorues gjithsej
          </p>
        </div>
        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kërko..."
            className="px-4 py-2 border border-bg rounded-full text-sm outline-none focus:border-primary"
          />
          <button
            onClick={() => openModal()}
            className="bg-primary text-white font-black px-4 py-2 rounded-full cursor-pointer hover:bg-green-600 transition-colors border-0"
          >
            + Shto përdorues
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-x-auto">
        {loading ? (
          <p className="p-6 text-muted">Duke ngarkuar...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted border-b border-bg">
                <th className="p-4">#ID</th>
                <th className="p-4">Username</th>
                <th className="p-4">Email</th>
                <th className="p-4">Emri</th>
                <th className="p-4">Rolet</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Veprime</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-bg last:border-0">
                  <td className="p-4 font-black text-dark">#{u.id}</td>
                  <td className="p-4 font-black text-dark">{u.user_name}</td>
                  <td className="p-4 text-muted">{u.email}</td>
                  <td className="p-4 text-muted">{u.emri_plote || "—"}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {u.roles.length ? (
                        u.roles.map((r) => (
                          <span
                            key={r}
                            className="bg-bg text-dark text-xs font-black px-2 py-0.5 rounded-full"
                          >
                            {r}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted text-xs">—</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs font-black ${u.aktiv ? "text-primary" : "text-danger"}`}
                    >
                      {u.aktiv ? "✓ Aktiv" : "✗ Joaktiv"}
                    </span>
                  </td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => openModal(u)}
                      className="text-primary font-black mr-3 bg-transparent border-0 cursor-pointer"
                    >
                      ✎ Edito
                    </button>
                    <button
                      onClick={() => remove(u.id)}
                      className="text-danger font-black bg-transparent border-0 cursor-pointer"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-muted">
                    S'ka përdorues.
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
            className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-black text-dark mb-4">
              {editingId ? "Edito Përdoruesin" : "Shto Përdorues"}
            </h3>

            <div className="space-y-3">
              <Field label="Username *">
                <input
                  value={form.user_name}
                  onChange={(e) =>
                    setForm({ ...form, user_name: e.target.value })
                  }
                  disabled={!!editingId}
                  className="inp disabled:bg-bg"
                />
              </Field>
              <Field label="Email *">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={!!editingId}
                  className="inp disabled:bg-bg"
                />
              </Field>
              <Field
                label={
                  editingId
                    ? "Password (lëre bosh që të mos ndryshohet)"
                    : "Password *"
                }
              >
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="inp"
                />
              </Field>
              <Field label="Emri i plotë">
                <input
                  value={form.emri_plote}
                  onChange={(e) =>
                    setForm({ ...form, emri_plote: e.target.value })
                  }
                  className="inp"
                />
              </Field>
              <Field label="Telefoni">
                <input
                  value={form.telefoni}
                  onChange={(e) =>
                    setForm({ ...form, telefoni: e.target.value })
                  }
                  className="inp"
                />
              </Field>

              <div>
                <p className="text-sm font-black text-dark mb-2">Rolet</p>
                <div className="flex flex-wrap gap-2">
                  {allRoles.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => toggleRole(r.name)}
                      className={`text-xs font-black px-3 py-1.5 rounded-full border-2 cursor-pointer transition-colors ${
                        form.roles.includes(r.name)
                          ? "border-primary bg-primary text-white"
                          : "border-bg text-muted"
                      }`}
                    >
                      {r.name}
                    </button>
                  ))}
                </div>
              </div>

              {editingId && (
                <label className="flex items-center gap-2 text-sm font-black text-dark cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.aktiv}
                    onChange={(e) =>
                      setForm({ ...form, aktiv: e.target.checked })
                    }
                  />
                  Aktiv
                </label>
              )}
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

      <style>{`.inp{width:100%;padding:0.55rem 0.9rem;border:1px solid var(--color-bg,#e5e7eb);border-radius:0.75rem;font-size:0.875rem;outline:none}.inp:focus{border-color:#4ea674}`}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-black text-dark mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
