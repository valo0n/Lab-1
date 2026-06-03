/* AddProduct — krijim i produktit te ri me foto URL */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct, getCategories, uploadImage } from "../../lib/api";

export default function AddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    emertimi: "",
    pershkrimi: "",
    cmimi: "",
    cmimi_zbritjes: "",
    kategoria_id: "",
    marka: "",
    modeli: "",
    sku: "",
    sasia_stokut: 1,
    garancia_muaj: 12,
    foto_kryesore: "",
  });

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  /* Ngarko foto nga kompjuteri -> merr URL-ne -> vendose te foto_kryesore */
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      setForm((prev) => ({ ...prev, foto_kryesore: url }));
    } catch (err) {
      alert(`Gabim në ngarkim: ${err.data?.error || err.message}`);
    } finally {
      setUploading(false);
      e.target.value = ""; // lejo rizgjedhjen e të njëjtit file
    }
  };

  const handlePublish = async () => {
    if (!form.emertimi.trim() || !form.cmimi || !form.kategoria_id) {
      alert("Plotëso Emrin, Çmimin dhe Kategorinë!");
      return;
    }

    setSaving(true);
    try {
      await createProduct({
        ...form,
        cmimi: parseFloat(form.cmimi),
        cmimi_zbritjes: form.cmimi_zbritjes
          ? parseFloat(form.cmimi_zbritjes)
          : null,
        kategoria_id: parseInt(form.kategoria_id),
        sasia_stokut: parseInt(form.sasia_stokut) || 0,
        garancia_muaj: parseInt(form.garancia_muaj) || 12,
      });
      alert(`✅ Produkti "${form.emertimi}" u publikua me sukses!`);
      navigate("/admin/products");
    } catch (err) {
      alert(`Gabim: ${err.data?.error || err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-black text-dark">Add New Product</h2>
        <button
          onClick={handlePublish}
          disabled={saving}
          className="bg-primary hover:bg-green-600 text-white font-black text-sm px-6 py-2.5 rounded-full border-0 cursor-pointer disabled:opacity-50 transition-colors"
        >
          {saving ? "Duke ruajtur..." : "💾 Publish Product"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* LEFT - Form details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Basic Details */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h3 className="font-black text-dark text-lg mb-4">Basic Details</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-black text-dark mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={form.emertimi}
                  onChange={(e) => handleChange("emertimi", e.target.value)}
                  placeholder="iPhone 17 Pro Max"
                  className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-dark mb-2">
                  Product Description
                </label>
                <textarea
                  value={form.pershkrimi}
                  onChange={(e) => handleChange("pershkrimi", e.target.value)}
                  rows={4}
                  placeholder="Përshkrim i produktit..."
                  className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-black text-dark mb-2">
                    Marka
                  </label>
                  <input
                    type="text"
                    value={form.marka}
                    onChange={(e) => handleChange("marka", e.target.value)}
                    placeholder="Apple"
                    className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-dark mb-2">
                    Modeli
                  </label>
                  <input
                    type="text"
                    value={form.modeli}
                    onChange={(e) => handleChange("modeli", e.target.value)}
                    placeholder="A2849"
                    className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-dark mb-2">
                  SKU
                </label>
                <input
                  type="text"
                  value={form.sku}
                  onChange={(e) => handleChange("sku", e.target.value)}
                  placeholder="IPHONE-17-PRO"
                  className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h3 className="font-black text-dark text-lg mb-4">Pricing</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-black text-dark mb-2">
                  Product Price *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                    €
                  </span>
                  <input
                    type="number"
                    value={form.cmimi}
                    onChange={(e) => handleChange("cmimi", e.target.value)}
                    placeholder="1300"
                    className="w-full pl-7 pr-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-dark mb-2">
                  Çmimi i Vjetër (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                    €
                  </span>
                  <input
                    type="number"
                    value={form.cmimi_zbritjes}
                    onChange={(e) =>
                      handleChange("cmimi_zbritjes", e.target.value)
                    }
                    placeholder="1500"
                    className="w-full pl-7 pr-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h3 className="font-black text-dark text-lg mb-4">Inventory</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-black text-dark mb-2">
                  Sasia në Stok
                </label>
                <input
                  type="number"
                  value={form.sasia_stokut}
                  onChange={(e) => handleChange("sasia_stokut", e.target.value)}
                  className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-black text-dark mb-2">
                  Garancia (muaj)
                </label>
                <input
                  type="number"
                  value={form.garancia_muaj}
                  onChange={(e) =>
                    handleChange("garancia_muaj", e.target.value)
                  }
                  className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT - Image + Category */}
        <div className="space-y-5">
          {/* Product Image - URL */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h3 className="font-black text-dark text-lg mb-4">
              📷 Foto e Produktit
            </h3>

            {/* Ngarko foto nga kompjuteri */}
            <div className="mb-4">
              <label className="block text-sm font-black text-dark mb-2">
                Foto nga kompjuteri
              </label>
              <label
                className={`flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed rounded-xl text-sm font-black transition-colors ${
                  uploading
                    ? "border-bg text-muted cursor-wait"
                    : "border-primary/40 text-primary cursor-pointer hover:bg-bg"
                }`}
              >
                {uploading ? "⏳ Duke ngarkuar..." : "📁 Zgjidh foto"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-muted mt-1">
                JPG, PNG, WEBP ose GIF (max 5MB)
              </p>
            </div>

            <div className="text-center text-xs text-muted mb-3">— ose —</div>

            <div className="mb-4">
              <label className="block text-sm font-black text-dark mb-2">
                URL i Imazhit
              </label>
              <input
                type="text"
                value={form.foto_kryesore}
                onChange={(e) => handleChange("foto_kryesore", e.target.value)}
                placeholder="https://example.com/foto.jpg"
                className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
              />
              <p className="text-xs text-muted mt-1">
                Ngjit URL nga interneti (Unsplash, Google Images)
              </p>
            </div>

            {/* Preview */}
            <div className="bg-bg rounded-xl p-4 min-h-[200px] flex items-center justify-center">
              {form.foto_kryesore ? (
                <img
                  src={form.foto_kryesore}
                  alt="Preview"
                  className="max-w-full max-h-[200px] rounded-lg object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
              ) : null}
              <p
                className="text-muted text-sm text-center"
                style={{ display: form.foto_kryesore ? "none" : "block" }}
              >
                {form.foto_kryesore ? "⚠️ URL e pavlefshme" : "🖼️ Preview këtu"}
              </p>
            </div>

            {/* Suggestions */}
            <div className="mt-3">
              <p className="text-xs font-black text-muted mb-1">
                💡 Burime falas:
              </p>
              <a
                href="https://unsplash.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline block"
              >
                → Unsplash.com (foto profesionale falas)
              </a>
              <a
                href="https://images.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline block"
              >
                → Google Images
              </a>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h3 className="font-black text-dark text-lg mb-4">Categories</h3>

            <label className="block text-sm font-black text-dark mb-2">
              Product Category *
            </label>
            <select
              value={form.kategoria_id}
              onChange={(e) => handleChange("kategoria_id", e.target.value)}
              className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary bg-white cursor-pointer"
            >
              <option value="">Zgjidh kategorinë</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.ikona} {c.emertimi}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
