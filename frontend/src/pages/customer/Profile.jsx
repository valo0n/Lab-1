/* Profile — faqja e profilit te klienti */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import Header from "../landing/Header";
import Footer from "../landing/sections/Footer";

export default function Profile() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await api.get("/auth/me");
        setProfile(userData);

        /* Provo te marresh customer info */
        try {
          const orders = await api.get("/orders/me");
          if (orders.length > 0 && orders[0].customers) {
            setCustomer(orders[0].customers);
          }
        } catch {}

        setForm({
          emri_plote: userData.emri_plote || "",
          telefoni: userData.telefoni || "",
          user_name: userData.user_name || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProfile();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      alert("✅ Të dhënat u përditësuan!");
      setProfile({ ...profile, ...form });
      setEditMode(false);
    } catch (err) {
      alert(`Gabim: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-bg font-lato">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-20 px-4">
          <span className="text-7xl mb-4">🔒</span>
          <h2 className="text-2xl font-black text-dark mb-2">
            Duhet të kyçesh
          </h2>
          <Link
            to="/login"
            className="bg-primary text-white px-6 py-3 rounded-xl font-black no-underline mt-4"
          >
            Kyçu
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-bg font-lato">
        <Header />
        <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
          <div className="bg-white rounded-2xl p-10 text-center text-muted shadow-card">
            Duke ngarkuar...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg font-lato">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        {/* Profile card */}
        <div className="bg-white rounded-2xl p-6 shadow-card mb-5">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center font-black text-3xl">
              {profile?.emri_plote?.[0]?.toUpperCase() ||
                profile?.user_name?.[0]?.toUpperCase() ||
                "?"}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-black text-dark">
                {profile?.emri_plote || profile?.user_name}
              </h1>
              <p className="text-sm text-muted">{profile?.email}</p>
              {profile?.roles?.length > 0 && (
                <span className="inline-block mt-1 text-xs font-black bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {profile.roles[0]}
                </span>
              )}
            </div>
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="bg-primary hover:bg-green-600 text-white font-black text-sm px-4 py-2 rounded-xl border-0 cursor-pointer"
              >
                ✏️ Edito
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-bg text-dark font-black text-sm px-4 py-2 rounded-xl border-0 cursor-pointer"
                >
                  Anulo
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-primary hover:bg-green-600 text-white font-black text-sm px-4 py-2 rounded-xl border-0 cursor-pointer disabled:opacity-50"
                >
                  {saving ? "..." : "💾 Ruaj"}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: "emri_plote", label: "Emri i Plotë", icon: "👤" },
              { key: "user_name", label: "Username", icon: "🆔" },
              { key: "telefoni", label: "Telefon", icon: "📞" },
            ].map((f) => (
              <div key={f.key} className="bg-bg rounded-xl p-4">
                <p className="text-xs text-muted mb-1">
                  {f.icon} {f.label}
                </p>
                {editMode ? (
                  <input
                    type="text"
                    value={form[f.key] || ""}
                    onChange={(e) =>
                      setForm({ ...form, [f.key]: e.target.value })
                    }
                    className="w-full bg-white px-3 py-1.5 rounded text-sm outline-none border border-bg focus:border-primary font-black text-dark"
                  />
                ) : (
                  <p className="font-black text-dark">
                    {profile?.[f.key] || "—"}
                  </p>
                )}
              </div>
            ))}

            <div className="bg-bg rounded-xl p-4">
              <p className="text-xs text-muted mb-1">📧 Email</p>
              <p className="font-black text-dark text-sm truncate">
                {profile?.email}
              </p>
            </div>
          </div>

          {profile?.data_regjistrimit && (
            <div className="mt-4 pt-4 border-t border-bg text-xs text-muted">
              Anëtar që nga{" "}
              {new Date(profile.data_regjistrimit).toLocaleDateString("sq-AL", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link
            to="/my-orders"
            className="bg-white rounded-2xl p-5 shadow-card hover:shadow-hover transition-shadow no-underline"
          >
            <p className="text-3xl mb-2">📦</p>
            <p className="font-black text-dark">Porositë e Mia</p>
            <p className="text-xs text-muted">Shiko historikun</p>
          </Link>

          <Link
            to="/wishlist"
            className="bg-white rounded-2xl p-5 shadow-card hover:shadow-hover transition-shadow no-underline"
          >
            <p className="text-3xl mb-2">❤️</p>
            <p className="font-black text-dark">Lista e Dëshirave</p>
            <p className="text-xs text-muted">Produktet e ruajtura</p>
          </Link>

          <Link
            to="/cart"
            className="bg-white rounded-2xl p-5 shadow-card hover:shadow-hover transition-shadow no-underline"
          >
            <p className="text-3xl mb-2">🛒</p>
            <p className="font-black text-dark">Shporta</p>
            <p className="text-xs text-muted">Vazhdo blerjet</p>
          </Link>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full mt-5 bg-white text-danger font-black py-3 rounded-2xl shadow-card hover:bg-red-50 transition-colors border-0 cursor-pointer"
        >
          🚪 Dil nga Llogaria
        </button>
      </main>

      <Footer />
    </div>
  );
}
