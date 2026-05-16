/* ProductMedia — galeri me imazhe te produkteve */
import { useState, useMemo } from "react";

const ALL_MEDIA = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    emoji: "📱",
    category: "Smartphones",
    size: "2.4 MB",
    date: "01-01-2025",
    type: "image",
  },
  {
    id: 2,
    name: "Sony WH-1000XM5",
    emoji: "🎧",
    category: "Audio",
    size: "1.8 MB",
    date: "01-01-2025",
    type: "image",
  },
  {
    id: 3,
    name: "MacBook Pro M3",
    emoji: "💻",
    category: "Laptops",
    size: "3.2 MB",
    date: "02-01-2025",
    type: "image",
  },
  {
    id: 4,
    name: "PS5 Slim Digital",
    emoji: "🎮",
    category: "Gaming",
    size: "2.1 MB",
    date: "02-01-2025",
    type: "image",
  },
  {
    id: 5,
    name: "Samsung Galaxy S24",
    emoji: "📱",
    category: "Smartphones",
    size: "2.6 MB",
    date: "03-01-2025",
    type: "image",
  },
  {
    id: 6,
    name: "AirPods Pro 2",
    emoji: "🎧",
    category: "Audio",
    size: "1.5 MB",
    date: "03-01-2025",
    type: "image",
  },
  {
    id: 7,
    name: "Apple Watch Series 9",
    emoji: "⌚",
    category: "Wearables",
    size: "1.9 MB",
    date: "04-01-2025",
    type: "image",
  },
  {
    id: 8,
    name: "Canon EOS R6",
    emoji: "📷",
    category: "Cameras",
    size: "4.1 MB",
    date: "04-01-2025",
    type: "image",
  },
  {
    id: 9,
    name: 'LG UltraGear 27" 4K',
    emoji: "🖥️",
    category: "TV & Monitor",
    size: "2.8 MB",
    date: "05-01-2025",
    type: "image",
  },
  {
    id: 10,
    name: "Logitech MX Master 3S",
    emoji: "🖱️",
    category: "Accessories",
    size: "1.3 MB",
    date: "05-01-2025",
    type: "image",
  },
  {
    id: 11,
    name: 'iPad Pro 12.9"',
    emoji: "📱",
    category: "Smartphones",
    size: "3.5 MB",
    date: "06-01-2025",
    type: "image",
  },
  {
    id: 12,
    name: "Bose QuietComfort 45",
    emoji: "🎧",
    category: "Audio",
    size: "1.7 MB",
    date: "06-01-2025",
    type: "image",
  },
  {
    id: 13,
    name: "Dell XPS 15",
    emoji: "💻",
    category: "Laptops",
    size: "3.0 MB",
    date: "07-01-2025",
    type: "image",
  },
  {
    id: 14,
    name: "Xbox Series X",
    emoji: "🎮",
    category: "Gaming",
    size: "2.3 MB",
    date: "07-01-2025",
    type: "image",
  },
  {
    id: 15,
    name: 'Samsung 65" QLED TV',
    emoji: "📺",
    category: "TV & Monitor",
    size: "5.2 MB",
    date: "08-01-2025",
    type: "image",
  },
  {
    id: 16,
    name: "GoPro Hero 12",
    emoji: "📷",
    category: "Cameras",
    size: "2.9 MB",
    date: "08-01-2025",
    type: "image",
  },
];

const CATEGORIES = [
  "All",
  "Smartphones",
  "Laptops",
  "Audio",
  "Gaming",
  "TV & Monitor",
  "Cameras",
  "Wearables",
  "Accessories",
];

export default function ProductMedia() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);

  const filtered = useMemo(() => {
    let r = [...ALL_MEDIA];
    if (category !== "All") r = r.filter((m) => m.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter((m) => m.name.toLowerCase().includes(q));
    }
    return r;
  }, [category, search]);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleDelete = () => {
    if (selected.length === 0) return alert("Zgjidh imazhet per t'i fshire!");
    if (confirm(`Fshi ${selected.length} imazhe?`)) {
      alert(`${selected.length} imazhe u fshine!`);
      setSelected([]);
    }
  };

  return (
    <div className="space-y-5">
      {/* Title + Actions */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-black text-dark">Product Media</h2>
        <div className="flex items-center gap-2">
          <button className="bg-primary hover:bg-green-600 text-white font-black text-sm px-5 py-2.5 rounded-full flex items-center gap-2 border-0 cursor-pointer transition-colors">
            ⊕ Upload Media
          </button>
          {selected.length > 0 && (
            <button
              onClick={handleDelete}
              className="bg-red-50 border border-red-200 text-danger font-black text-sm px-5 py-2.5 rounded-full cursor-pointer hover:bg-red-100 transition-colors"
            >
              🗑️ Fshi ({selected.length})
            </button>
          )}
        </div>
      </div>

      {/* 4 Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <p className="font-black text-dark mb-2">Total Media</p>
          <p className="text-2xl font-black text-dark">{ALL_MEDIA.length}</p>
          <p className="text-xs text-muted mt-1">Files uploaded</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <p className="font-black text-dark mb-2">Total Size</p>
          <p className="text-2xl font-black text-dark">42.3 MB</p>
          <p className="text-xs text-muted mt-1">Storage used</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <p className="font-black text-dark mb-2">This Month</p>
          <p className="text-2xl font-black text-dark">{ALL_MEDIA.length}</p>
          <p className="text-xs text-primary mt-1 font-black">↑ 12%</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <p className="font-black text-dark mb-2">Categories</p>
          <p className="text-2xl font-black text-dark">
            {CATEGORIES.length - 1}
          </p>
          <p className="text-xs text-muted mt-1">Active</p>
        </div>
      </div>

      {/* Filters + Gallery */}
      <div className="bg-white rounded-2xl p-5 shadow-card">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div className="flex flex-wrap gap-1">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`text-sm font-black px-4 py-2 rounded-full border-0 cursor-pointer transition-colors ${
                  category === c
                    ? "bg-primary text-white"
                    : "bg-bg text-dark hover:bg-light/60"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="bg-bg rounded-full px-4 py-2 flex items-center gap-2 w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search media..."
              className="bg-transparent outline-none text-sm flex-1 font-lato"
            />
            <span className="text-muted text-sm">🔍</span>
          </div>
        </div>

        {/* Gallery grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-6xl mb-3">📂</p>
            <p className="text-muted font-black">Asnje imazh nuk u gjet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filtered.map((m) => (
              <div
                key={m.id}
                onClick={() => toggleSelect(m.id)}
                className={`relative bg-bg rounded-xl p-3 cursor-pointer transition-all border-2 ${
                  selected.includes(m.id)
                    ? "border-primary scale-95"
                    : "border-transparent hover:border-primary/30"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(m.id)}
                  onChange={() => toggleSelect(m.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-2 right-2 accent-primary w-4 h-4 cursor-pointer"
                />
                <div className="aspect-square flex items-center justify-center text-5xl mb-2">
                  {m.emoji}
                </div>
                <p className="font-black text-dark text-xs truncate">
                  {m.name}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted">{m.size}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Fshi ${m.name}?`)) alert("U fshi!");
                    }}
                    className="text-muted hover:text-danger bg-transparent border-0 cursor-pointer text-sm"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
