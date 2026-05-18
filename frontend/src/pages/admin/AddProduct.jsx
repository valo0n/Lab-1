/* AddProduct — formular per shtimin e produkteve te reja - LIDHUR ME API */
import { useState, useRef, useEffect } from "react";
import { createProduct, getCategories } from "../../lib/api";

const TAGS = [
  "Featured",
  "New Arrival",
  "Best Seller",
  "On Sale",
  "Limited Edition",
];
const COLORS = [
  { hex: "#c1e6ba", label: "Green" },
  { hex: "#fbcfe8", label: "Pink" },
  { hex: "#e5e7eb", label: "Gray" },
  { hex: "#fef3c7", label: "Yellow" },
  { hex: "#1f2937", label: "Black" },
];

export default function AddProduct() {
  /* Form state */
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [taxIncluded, setTaxIncluded] = useState("yes");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [stockQty, setStockQty] = useState("Unlimited");
  const [stockStatus, setStockStatus] = useState("In Stock");
  const [unlimited, setUnlimited] = useState(true);
  const [featured, setFeatured] = useState(true);
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [selectedColors, setSelectedColors] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [thumbnails, setThumbnails] = useState([]);

  /* Te dhena nga DB */
  const [dbCategories, setDbCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const mainFileRef = useRef(null);
  const thumbFileRef = useRef(null);

  /* Ngarko kategorit nga DB ne fillim */
  useEffect(() => {
    getCategories()
      .then(setDbCategories)
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  /* Llogarit cmimin e shitjes */
  const salePrice = (
    parseFloat(price || 0) - parseFloat(discount || 0)
  ).toFixed(2);

  /* Toggle color */
  const toggleColor = (hex) => {
    setSelectedColors((prev) =>
      prev.includes(hex) ? prev.filter((c) => c !== hex) : [...prev, hex],
    );
  };

  /* Upload foto kryesore */
  const handleMainImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setMainImage(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  /* Upload thumbnail */
  const handleThumbnail = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setThumbnails((prev) => [...prev, ev.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  /* Hiq thumbnail */
  const removeThumb = (idx) => {
    setThumbnails((prev) => prev.filter((_, i) => i !== idx));
  };

  /* Reset form pas suksesit */
  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setDiscount("");
    setCategory("");
    setTag("");
    setSelectedColors([]);
    setMainImage(null);
    setThumbnails([]);
    setStockQty("Unlimited");
    setUnlimited(true);
  };

  /* Submit - LIDH ME API */
  const handlePublish = async () => {
    /* Validim */
    if (!name.trim() || !price || !category) {
      alert("Plotëso Emrin, Çmimin dhe Kategorinë!");
      return;
    }

    setSubmitting(true);
    try {
      /* Gjej kategorinë në DB sipas emrit */
      const categoryObj = dbCategories.find((c) => c.emertimi === category);
      if (!categoryObj) {
        alert("Kategoria nuk u gjet ne databazë");
        setSubmitting(false);
        return;
      }

      /* Pergatit te dhenat per backend */
      const data = {
        emertimi: name,
        kategoria_id: categoryObj.id,
        marka: tag || null,
        pershkrimi: description || null,
        cmimi: parseFloat(price),
        cmimi_zbritjes: discount ? parseFloat(discount) : null,
        sasia_stokut: unlimited ? 999 : parseInt(stockQty) || 0,
        garancia_muaj: 12,
        foto_kryesore: mainImage || null,
      };

      /* Therrit API */
      await createProduct(data);
      alert(`✅ Produkti "${name}" u publikua me sukses në databazë!`);
      resetForm();
    } catch (err) {
      console.error("Publish error:", err);
      alert(`❌ Gabim: ${err.data?.error || err.message || "Nuk u publikua"}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    alert(`Produkti "${name}" u ruajt si draft.`);
  };

  return (
    <div className="space-y-5">
      {/* Title + Top actions */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-black text-dark">Add New Product</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-white border border-bg rounded-full px-4 py-2.5 flex items-center gap-2 w-72">
            <input
              type="text"
              placeholder="Search product for add"
              className="bg-transparent outline-none text-sm flex-1 font-lato"
            />
            <span className="text-muted text-sm">🔍</span>
          </div>
          <button
            onClick={handlePublish}
            disabled={submitting}
            className="bg-primary hover:bg-green-600 text-white font-black text-sm px-5 py-2.5 rounded-full border-0 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Duke ruajtur..." : "Publish Product"}
          </button>
          <button
            onClick={handleSaveDraft}
            disabled={submitting}
            className="bg-white border border-bg text-dark font-black text-sm px-5 py-2.5 rounded-full cursor-pointer hover:bg-bg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            💾 Save to draft
          </button>
          <button className="w-11 h-11 bg-white border border-bg rounded-full flex items-center justify-center cursor-pointer hover:bg-bg transition-colors text-primary">
            ⊕
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ── LEFT: Main form (2 cols) ── */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-card space-y-6">
          {/* Basic Details */}
          <div>
            <h3 className="text-lg font-black text-dark mb-4">Basic Details</h3>

            <div className="mb-4">
              <label className="block text-sm font-black text-dark mb-2">
                Product Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="iPhone 15 Pro Max"
                className="w-full px-4 py-3 border border-bg rounded-xl text-sm outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-dark mb-2">
                Product Description
              </label>
              <div className="relative">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Pershkrimi i produktit..."
                  className="w-full px-4 py-3 border border-bg rounded-xl text-sm outline-none focus:border-primary resize-none"
                />
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <button className="text-muted hover:text-primary bg-transparent border-0 cursor-pointer text-lg">
                    ✏️
                  </button>
                  <button className="text-muted hover:text-primary bg-transparent border-0 cursor-pointer text-lg">
                    ✨
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-lg font-black text-dark mb-4">Pricing</h3>

            <div className="mb-4">
              <label className="block text-sm font-black text-dark mb-2">
                Product Price
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={price ? `$${price}` : ""}
                  onChange={(e) =>
                    setPrice(e.target.value.replace(/[^0-9.]/g, ""))
                  }
                  placeholder="$0.00"
                  className="w-full px-4 py-3 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 cursor-pointer">
                  <span className="text-xl">🇺🇸</span>
                  <span className="text-muted text-xs">▼</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-black text-dark mb-2">
                  Discounted Price{" "}
                  <span className="text-muted font-normal">(Optional)</span>
                </label>
                <div className="bg-light/40 rounded-xl px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="bg-primary text-white px-3 py-1 rounded-lg text-xs font-black">
                      $
                    </span>
                    <input
                      type="text"
                      value={discount}
                      onChange={(e) =>
                        setDiscount(e.target.value.replace(/[^0-9.]/g, ""))
                      }
                      placeholder="0"
                      className="bg-transparent outline-none text-sm w-20 font-black text-dark"
                    />
                  </div>
                  {price && discount && (
                    <span className="text-xs text-muted">
                      Sale= ${salePrice}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-dark mb-2">
                  Tax Included
                </label>
                <div className="flex gap-6 py-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tax"
                      checked={taxIncluded === "yes"}
                      onChange={() => setTaxIncluded("yes")}
                      className="accent-primary w-4 h-4"
                    />
                    <span className="text-sm text-dark font-black">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tax"
                      checked={taxIncluded === "no"}
                      onChange={() => setTaxIncluded("no")}
                      className="accent-primary w-4 h-4"
                    />
                    <span className="text-sm text-dark font-black">No</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-black text-dark mb-2">
                Expiration
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div>
            <h3 className="text-lg font-black text-dark mb-4">Inventory</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-black text-dark mb-2">
                  Stock Quantity
                </label>
                <input
                  type="text"
                  value={stockQty}
                  onChange={(e) => setStockQty(e.target.value)}
                  disabled={unlimited}
                  className="w-full px-4 py-3 border border-bg rounded-xl text-sm outline-none focus:border-primary disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-black text-dark mb-2">
                  Stock Status
                </label>
                <select
                  value={stockStatus}
                  onChange={(e) => setStockStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-bg rounded-xl text-sm outline-none focus:border-primary bg-white cursor-pointer"
                >
                  <option>In Stock</option>
                  <option>Out of Stock</option>
                  <option>Low Stock</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => {
                  setUnlimited(!unlimited);
                  if (!unlimited) setStockQty("Unlimited");
                }}
                className={`relative w-12 h-6 rounded-full transition-colors border-0 cursor-pointer ${
                  unlimited ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    unlimited ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
              <span className="text-sm font-black text-dark">Unlimited</span>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="accent-primary w-5 h-5"
              />
              <span className="text-sm text-dark">
                Highlight this product in a featured section.
              </span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={handleSaveDraft}
              disabled={submitting}
              className="bg-white border border-bg text-dark font-black text-sm px-5 py-2.5 rounded-xl cursor-pointer hover:bg-bg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              💾 Save to draft
            </button>
            <button
              onClick={handlePublish}
              disabled={submitting}
              className="bg-primary hover:bg-green-600 text-white font-black text-sm px-5 py-2.5 rounded-xl border-0 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Duke ruajtur..." : "Publish Product"}
            </button>
          </div>
        </div>

        {/* ── RIGHT: Image upload + Categories ── */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-5 shadow-card">
            <h3 className="text-lg font-black text-dark mb-4">
              Upload Product Image
            </h3>

            <p className="text-sm font-black text-dark mb-2">Product Image</p>
            <div className="border-2 border-dashed border-bg rounded-2xl p-4 mb-4 relative">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt="Product"
                  className="w-full h-64 object-contain"
                />
              ) : (
                <div className="h-64 flex items-center justify-center bg-bg/50 rounded-xl">
                  <span className="text-6xl">📱</span>
                </div>
              )}

              <div className="flex items-center justify-between mt-3">
                <button
                  onClick={() => mainFileRef.current?.click()}
                  className="flex items-center gap-2 text-sm font-black text-dark bg-transparent border-0 cursor-pointer"
                >
                  📷 Browse
                </button>
                <button
                  onClick={() => mainFileRef.current?.click()}
                  className="flex items-center gap-2 text-sm font-black text-dark bg-transparent border-0 cursor-pointer"
                >
                  🔄 Replace
                </button>
              </div>
              <input
                ref={mainFileRef}
                type="file"
                accept="image/*"
                onChange={handleMainImage}
                className="hidden"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {thumbnails.map((t, i) => (
                <div
                  key={i}
                  className="relative aspect-square bg-bg rounded-xl overflow-hidden"
                >
                  <img src={t} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeThumb(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-xs cursor-pointer border-0 hover:bg-red-50 text-danger"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                onClick={() => thumbFileRef.current?.click()}
                className="aspect-square border-2 border-dashed border-bg rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary transition-colors bg-transparent text-primary"
              >
                <span className="text-2xl">⊕</span>
                <span className="text-xs font-black">Add Image</span>
              </button>
              <input
                ref={thumbFileRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleThumbnail}
                className="hidden"
              />
            </div>
          </div>

          {/* Categories - tani nga DB */}
          <div className="bg-white rounded-2xl p-5 shadow-card">
            <h3 className="text-lg font-black text-dark mb-4">Categories</h3>

            <div className="mb-4">
              <label className="block text-sm font-black text-dark mb-2">
                Product Categories
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-bg rounded-xl text-sm outline-none focus:border-primary bg-white cursor-pointer"
              >
                <option value="">Select your product</option>
                {dbCategories.map((c) => (
                  <option key={c.id} value={c.emertimi}>
                    {c.emertimi}
                  </option>
                ))}
              </select>
              {dbCategories.length === 0 && (
                <p className="text-xs text-muted mt-1">
                  Duke ngarkuar kategorit...
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-black text-dark mb-2">
                Product Tag
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full px-4 py-3 border border-bg rounded-xl text-sm outline-none focus:border-primary bg-white cursor-pointer"
              >
                <option value="">Select your product</option>
                {TAGS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-black text-dark mb-2">
                Select your color
              </label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => toggleColor(c.hex)}
                    title={c.label}
                    className={`w-11 h-11 rounded-xl cursor-pointer transition-all border-2 ${
                      selectedColors.includes(c.hex)
                        ? "border-primary scale-110"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
