const FOOTER_COLS = [
  {
    title: "KATEGORITE",
    links: [
      "Smartphones",
      "Laptops",
      "TV & Monitor",
      "Audio",
      "Gaming",
      "Wearables",
    ],
  },
  {
    title: "LLOGARIA",
    links: [
      "Kyçu",
      "Regjistrohu",
      "Porositë e Mia",
      "Wishlist",
      "Garancitë",
      "Servisi",
    ],
  },
  {
    title: "INFORMACION",
    links: ["Rreth Nesh", "Kontakt", "Blog", "Karriera", "Politika", "FAQ"],
  },
  {
    title: "KONTAKT",
    links: [
      "+383 44 123 456",
      "info@paradox.com",
      "Rr. Nënë Tereza",
      "Prishtinë, Kosovë",
      "09:00 - 18:00",
      "E Hënë - E Shtunë",
    ],
  },
];

/* Ikonat e mediave sociale */
const SOCIAL = ["f", "in", "ig", "yt"];

/* Metodat e pagesës */
const PAYMENTS = ["💳 Visa", "💳 Mastercard", "🅿️ PayPal", "💵 Cash"];

export default function Footer() {
  return (
    <footer className="bg-dark font-lato">
      {/* ── Newsletter Bar ── */}
      {/* Strip jeshile me input për email */}
      <div className="bg-primary px-4 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-5">
          {/* Teksti i majtë */}
          <div>
            <h3 className="font-black text-white text-2xl">
              Regjistrohu për Oferta!
            </h3>
            <p className="text-sm text-white/80 mt-1">
              Merr lajmet e fundit dhe zbritjet ekskluzive
            </p>
          </div>

          {/* Input + buton — statik, nuk bën subscribe real */}
          <div className="flex flex-grow max-w-md">
            <input
              type="email"
              placeholder="Email-i juaj..."
              className="flex-1 px-4 py-3 rounded-l-xl border-0 text-sm outline-none font-lato"
            />
            <button className="bg-dark text-white font-black text-sm px-5 py-3 rounded-r-xl border-0 cursor-pointer hover:bg-emerald-950 transition-colors">
              Regjistrohu
            </button>
          </div>
        </div>
      </div>

      {/* ── Kolonat e Linkeve ── */}
      <div className="px-4 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Kolona e Brand-it me logo + përshkrim + social */}
          <div>
            {/* Logo */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center font-black text-white text-lg">
                P
              </div>
              <div>
                <p className="font-black text-white">PARADOX</p>
                <p className="font-black text-xs text-primary">TECH</p>
              </div>
            </div>

            {/* Përshkrimi i shkurtër */}
            <p className="text-sm text-light leading-relaxed">
              Dyqani juaj i besuar për elektronikë premium në Kosovë.
            </p>

            {/* Butonat e social media — dekorativë */}
            <div className="flex gap-2 mt-4">
              {SOCIAL.map((s) => (
                <button
                  key={s}
                  className="w-7 h-7 rounded-full bg-primary text-white text-xs font-black border-0 cursor-pointer hover:bg-green-600 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* 4 kolonat e linkeve — të gjeneruara nga FOOTER_COLS */}
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              {/* Titulli i kolonës */}
              <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-3">
                {col.title}
              </h4>

              {/* Lista e linkeve */}
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <span className="text-sm text-light hover:text-white cursor-pointer transition-colors">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      {/* Copyright + metodat e pagesës */}
      <div className="border-t border-white/10 px-4 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-light">
            © 2025 Paradox Tech. Të gjitha të drejtat e rezervuara.
          </p>

          {/* Ikonat e metodave të pagesës */}
          <div className="flex gap-2">
            {PAYMENTS.map((pm) => (
              <span
                key={pm}
                className="text-xs text-light bg-white/10 px-2 py-1 rounded-lg"
              >
                {pm}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
