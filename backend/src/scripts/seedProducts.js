/* Seed script - krijon kategori dhe 26 produkte test */
import prisma from "../lib/prisma.js";

const CATEGORIES = [
  { emertimi: "Smartphones", ikona: "📱", pershkrimi: "Telefonat e fundit" },
  { emertimi: "Laptops", ikona: "💻", pershkrimi: "Laptopa premium" },
  { emertimi: "Audio", ikona: "🎧", pershkrimi: "Kufje dhe altoparlante" },
  {
    emertimi: "Gaming",
    ikona: "🎮",
    pershkrimi: "Konzola dhe aksesore gaming",
  },
  { emertimi: "TV & Monitor", ikona: "📺", pershkrimi: "Ekrane dhe monitore" },
  { emertimi: "Cameras", ikona: "📷", pershkrimi: "Kamera profesionale" },
  { emertimi: "Wearables", ikona: "⌚", pershkrimi: "Ora te zgjuara" },
  { emertimi: "Accessories", ikona: "🔌", pershkrimi: "Aksesore te ndryshme" },
];

const PRODUCTS = [
  /* Smartphones */
  {
    emertimi: "iPhone 15 Pro Max",
    marka: "Apple",
    modeli: "A2849",
    sku: "IPH15PM",
    pershkrimi: "Telefoni i fundit i Apple me chip A17 Pro",
    cmimi: 1299,
    cmimi_zbritjes: null,
    sasia_stokut: 50,
    garancia_muaj: 24,
    cat: "Smartphones",
  },
  {
    emertimi: "Samsung Galaxy S24 Ultra",
    marka: "Samsung",
    modeli: "S928B",
    sku: "SGS24U",
    pershkrimi: "Telefoni premium Android me kamere 200MP",
    cmimi: 1099,
    cmimi_zbritjes: 1199,
    sasia_stokut: 30,
    garancia_muaj: 24,
    cat: "Smartphones",
  },
  {
    emertimi: "iPhone 15",
    marka: "Apple",
    modeli: "A3092",
    sku: "IPH15",
    pershkrimi: "iPhone 15 me USB-C dhe ekran Dynamic Island",
    cmimi: 799,
    cmimi_zbritjes: null,
    sasia_stokut: 45,
    garancia_muaj: 24,
    cat: "Smartphones",
  },
  {
    emertimi: "iPad Pro 12.9",
    marka: "Apple",
    modeli: "M2-13",
    sku: "IPADPRO13",
    pershkrimi: "Tableti profesional me chip M2",
    cmimi: 1099,
    cmimi_zbritjes: null,
    sasia_stokut: 25,
    garancia_muaj: 12,
    cat: "Smartphones",
  },

  /* Laptops */
  {
    emertimi: "MacBook Pro 14 M3 Pro",
    marka: "Apple",
    modeli: "M3PRO-14",
    sku: "MBP14M3",
    pershkrimi: "Laptop profesional me chip M3 Pro",
    cmimi: 1999,
    cmimi_zbritjes: null,
    sasia_stokut: 20,
    garancia_muaj: 12,
    cat: "Laptops",
  },
  {
    emertimi: "Dell XPS 15",
    marka: "Dell",
    modeli: "XPS9530",
    sku: "DELLXPS15",
    pershkrimi: "Laptop premium me ekran OLED",
    cmimi: 1799,
    cmimi_zbritjes: 1999,
    sasia_stokut: 15,
    garancia_muaj: 24,
    cat: "Laptops",
  },
  {
    emertimi: "Asus ROG Strix G16",
    marka: "Asus",
    modeli: "G614JV",
    sku: "ROGG16",
    pershkrimi: "Laptop gaming me RTX 4070",
    cmimi: 2299,
    cmimi_zbritjes: null,
    sasia_stokut: 12,
    garancia_muaj: 24,
    cat: "Laptops",
  },

  /* Audio */
  {
    emertimi: "Sony WH-1000XM5",
    marka: "Sony",
    modeli: "WH1000XM5",
    sku: "SONYWH5",
    pershkrimi: "Kufje me reduktim zhurmash premium",
    cmimi: 279,
    cmimi_zbritjes: 349,
    sasia_stokut: 80,
    garancia_muaj: 12,
    cat: "Audio",
  },
  {
    emertimi: "AirPods Pro 2nd Gen",
    marka: "Apple",
    modeli: "MQD83",
    sku: "AIRPODSPRO2",
    pershkrimi: "Kufje wireless me ANC",
    cmimi: 219,
    cmimi_zbritjes: 249,
    sasia_stokut: 100,
    garancia_muaj: 12,
    cat: "Audio",
  },
  {
    emertimi: "Bose QuietComfort 45",
    marka: "Bose",
    modeli: "QC45",
    sku: "BOSEQC45",
    pershkrimi: "Kufje komode me ANC",
    cmimi: 329,
    cmimi_zbritjes: null,
    sasia_stokut: 40,
    garancia_muaj: 24,
    cat: "Audio",
  },
  {
    emertimi: "JBL Flip 6 Speaker",
    marka: "JBL",
    modeli: "FLIP6",
    sku: "JBLFLIP6",
    pershkrimi: "Altoparlant portativ Bluetooth",
    cmimi: 119,
    cmimi_zbritjes: null,
    sasia_stokut: 70,
    garancia_muaj: 12,
    cat: "Audio",
  },

  /* Gaming */
  {
    emertimi: "PS5 Slim Digital",
    marka: "Sony",
    modeli: "CFI-2000",
    sku: "PS5SLIM",
    pershkrimi: "Konzola e re Slim PlayStation 5",
    cmimi: 399,
    cmimi_zbritjes: 449,
    sasia_stokut: 30,
    garancia_muaj: 24,
    cat: "Gaming",
  },
  {
    emertimi: "Xbox Series X",
    marka: "Microsoft",
    modeli: "RRT-00009",
    sku: "XBOXSX",
    pershkrimi: "Konzola me 1TB SSD dhe 4K gaming",
    cmimi: 499,
    cmimi_zbritjes: null,
    sasia_stokut: 25,
    garancia_muaj: 12,
    cat: "Gaming",
  },
  {
    emertimi: "Nintendo Switch OLED",
    marka: "Nintendo",
    modeli: "HEG-001",
    sku: "NSWOLED",
    pershkrimi: "Konzola hibride me ekran OLED",
    cmimi: 349,
    cmimi_zbritjes: null,
    sasia_stokut: 35,
    garancia_muaj: 12,
    cat: "Gaming",
  },

  /* TV & Monitor */
  {
    emertimi: "LG UltraGear 27 4K",
    marka: "LG",
    modeli: "27GP950",
    sku: "LG27GP950",
    pershkrimi: "Monitor 4K 144Hz per gaming",
    cmimi: 449,
    cmimi_zbritjes: 549,
    sasia_stokut: 18,
    garancia_muaj: 36,
    cat: "TV & Monitor",
  },
  {
    emertimi: "Samsung 65 QLED TV",
    marka: "Samsung",
    modeli: "QN65Q80C",
    sku: "SAMQ80",
    pershkrimi: "TV 65 inch QLED 4K",
    cmimi: 1499,
    cmimi_zbritjes: 1799,
    sasia_stokut: 10,
    garancia_muaj: 24,
    cat: "TV & Monitor",
  },

  /* Cameras */
  {
    emertimi: "Canon EOS R6",
    marka: "Canon",
    modeli: "EOSR6",
    sku: "CANONR6",
    pershkrimi: "Kamera profesionale mirrorless",
    cmimi: 2499,
    cmimi_zbritjes: null,
    sasia_stokut: 8,
    garancia_muaj: 24,
    cat: "Cameras",
  },
  {
    emertimi: "GoPro Hero 12",
    marka: "GoPro",
    modeli: "HERO12",
    sku: "GOPRO12",
    pershkrimi: "Kamera aksioni 5.3K",
    cmimi: 399,
    cmimi_zbritjes: 449,
    sasia_stokut: 22,
    garancia_muaj: 12,
    cat: "Cameras",
  },
  {
    emertimi: "Sony A7 IV Camera",
    marka: "Sony",
    modeli: "ILCE-7M4",
    sku: "SONYA7IV",
    pershkrimi: "Mirrorless full-frame 33MP",
    cmimi: 2498,
    cmimi_zbritjes: null,
    sasia_stokut: 6,
    garancia_muaj: 24,
    cat: "Cameras",
  },

  /* Wearables */
  {
    emertimi: "Apple Watch Series 9",
    marka: "Apple",
    modeli: "AW9-45",
    sku: "AW9",
    pershkrimi: "Ora e zgjuar me chip S9",
    cmimi: 399,
    cmimi_zbritjes: null,
    sasia_stokut: 55,
    garancia_muaj: 12,
    cat: "Wearables",
  },
  {
    emertimi: "Samsung Galaxy Watch 6",
    marka: "Samsung",
    modeli: "SM-R940",
    sku: "SGW6",
    pershkrimi: "Ora e zgjuar Android",
    cmimi: 299,
    cmimi_zbritjes: 349,
    sasia_stokut: 40,
    garancia_muaj: 24,
    cat: "Wearables",
  },
  {
    emertimi: "Garmin Fenix 7",
    marka: "Garmin",
    modeli: "FENIX7",
    sku: "GARMINFEN7",
    pershkrimi: "Ora multisport premium",
    cmimi: 699,
    cmimi_zbritjes: null,
    sasia_stokut: 20,
    garancia_muaj: 24,
    cat: "Wearables",
  },

  /* Accessories */
  {
    emertimi: "Logitech MX Master 3S",
    marka: "Logitech",
    modeli: "MX3S",
    sku: "LOGIMX3S",
    pershkrimi: "Mouse profesional wireless",
    cmimi: 99,
    cmimi_zbritjes: null,
    sasia_stokut: 90,
    garancia_muaj: 24,
    cat: "Accessories",
  },
  {
    emertimi: "Razer DeathAdder V3",
    marka: "Razer",
    modeli: "DAV3",
    sku: "RAZDA3",
    pershkrimi: "Mouse gaming ergonomik",
    cmimi: 69,
    cmimi_zbritjes: null,
    sasia_stokut: 75,
    garancia_muaj: 24,
    cat: "Accessories",
  },
  {
    emertimi: "Logitech G915 TKL",
    marka: "Logitech",
    modeli: "G915TKL",
    sku: "LOGIG915",
    pershkrimi: "Tastature mekanike wireless",
    cmimi: 229,
    cmimi_zbritjes: null,
    sasia_stokut: 30,
    garancia_muaj: 24,
    cat: "Accessories",
  },
  {
    emertimi: "Anker PowerBank 20K",
    marka: "Anker",
    modeli: "A1281",
    sku: "ANK20K",
    pershkrimi: "Power bank 20000mAh",
    cmimi: 49,
    cmimi_zbritjes: null,
    sasia_stokut: 120,
    garancia_muaj: 18,
    cat: "Accessories",
  },
];

async function seed() {
  console.log("🌱 Duke krijuar kategori dhe produkte...\n");

  /* Krijo kategorit  e nese nuk ekzistojne */
  const catMap = {};
  for (const c of CATEGORIES) {
    const existing = await prisma.categories.findFirst({
      where: { emertimi: c.emertimi },
    });
    if (existing) {
      catMap[c.emertimi] = existing.id;
      console.log(
        `⚠️  Kategoria "${c.emertimi}" ekziston (ID: ${existing.id})`,
      );
    } else {
      const created = await prisma.categories.create({ data: c });
      catMap[c.emertimi] = created.id;
      console.log(`✅ Krijova kategorinë: ${c.emertimi}`);
    }
  }

  console.log("\n📦 Duke shtuar produktet...\n");

  /* Krijo produktet nese nuk ekzistojne */
  let added = 0;
  for (const p of PRODUCTS) {
    const existing = await prisma.products.findFirst({ where: { sku: p.sku } });
    if (existing) {
      console.log(`⚠️  "${p.emertimi}" ekziston`);
      continue;
    }

    await prisma.products.create({
      data: {
        emertimi: p.emertimi,
        kategoria_id: catMap[p.cat],
        marka: p.marka,
        modeli: p.modeli,
        sku: p.sku,
        pershkrimi: p.pershkrimi,
        cmimi: p.cmimi,
        cmimi_zbritjes: p.cmimi_zbritjes,
        sasia_stokut: p.sasia_stokut,
        garancia_muaj: p.garancia_muaj,
        aktiv: true,
      },
    });
    added++;
    console.log(`✅ ${p.emertimi}`);
  }

  console.log(`\n🎉 U shtuan ${added} produkte te reja!`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
