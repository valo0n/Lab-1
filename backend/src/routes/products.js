/* Products routes - GET endpoints per listim */
import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

/* 
   GET /api/products - Listo te gjitha produktet
   Query params: ?category=ID&search=text&limit=10
    */
router.get("/", async (req, res) => {
  try {
    const { category, search, limit } = req.query;

    /* Ndertoj filter dinamik */
    const where = { aktiv: true };

    if (category) {
      where.kategoria_id = parseInt(category);
    }

    if (search) {
      where.OR = [
        { emertimi: { contains: search } },
        { marka: { contains: search } },
        { modeli: { contains: search } },
      ];
    }

    const products = await prisma.products.findMany({
      where,
      include: { categories: true },
      orderBy: { data_krijimit: "desc" },
      take: limit ? parseInt(limit) : undefined,
    });

    res.json(products);
  } catch (err) {
    console.error("Get products error:", err);
    res.status(500).json({ error: "Gabim ne marrjen e produkteve" });
  }
});

/* GET /api/products/:id - Nje produkt me detaje */
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = await prisma.products.findUnique({
      where: { id },
      include: {
        categories: true,
        product_images: true,
        product_reviews: { include: { customers: true } },
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Produkti nuk u gjet" });
    }

    res.json(product);
  } catch (err) {
    console.error("Get product error:", err);
    res.status(500).json({ error: "Gabim ne marrjen e produktit" });
  }
});
import { authenticate, requireRole } from "../middleware/auth.js";

/* ─────────────────────────────────────────────
   POST /api/products - Krijo produkt te ri (vetem Admin)
   ───────────────────────────────────────────── */
router.post("/", authenticate, requireRole("Admin"), async (req, res) => {
  try {
    const {
      emertimi,
      kategoria_id,
      marka,
      modeli,
      sku,
      pershkrimi,
      cmimi,
      cmimi_zbritjes,
      sasia_stokut,
      garancia_muaj,
      foto_kryesore,
    } = req.body;

    if (!emertimi || !kategoria_id || !cmimi) {
      return res
        .status(400)
        .json({ error: "Emri, kategoria dhe cmimi jane te detyrueshme" });
    }

    const product = await prisma.products.create({
      data: {
        emertimi,
        kategoria_id: parseInt(kategoria_id),
        marka: marka || null,
        modeli: modeli || null,
        sku: sku || null,
        pershkrimi: pershkrimi || null,
        cmimi: parseFloat(cmimi),
        cmimi_zbritjes: cmimi_zbritjes ? parseFloat(cmimi_zbritjes) : null,
        sasia_stokut: sasia_stokut ? parseInt(sasia_stokut) : 0,
        garancia_muaj: garancia_muaj ? parseInt(garancia_muaj) : 0,
        foto_kryesore: foto_kryesore || null,
        aktiv: true,
      },
    });

    res.status(201).json({ message: "Produkti u krijua", product });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "SKU ekziston tashme" });
    }
    console.error("Create product error:", err);
    res.status(500).json({ error: "Gabim ne krijimin e produktit" });
  }
});

/* PUT /api/products/:id - Edito produkt (vetem Admin) */
router.put("/:id", authenticate, requireRole("Admin"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = { ...req.body };

    /* Parse fushat numerike */
    if (data.cmimi) data.cmimi = parseFloat(data.cmimi);
    if (data.cmimi_zbritjes)
      data.cmimi_zbritjes = parseFloat(data.cmimi_zbritjes);
    if (data.kategoria_id) data.kategoria_id = parseInt(data.kategoria_id);
    if (data.sasia_stokut !== undefined)
      data.sasia_stokut = parseInt(data.sasia_stokut);

    const product = await prisma.products.update({
      where: { id },
      data,
    });

    res.json({ message: "Produkti u perditesua", product });
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ error: "Gabim ne perditesimin e produktit" });
  }
});

/* DELETE /api/products/:id - Fshi produkt (soft delete, vetem Admin) */
router.delete("/:id", authenticate, requireRole("Admin"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.products.update({
      where: { id },
      data: { aktiv: false },
    });
    res.json({ message: "Produkti u fshi" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ error: "Gabim ne fshirjen e produktit" });
  }
});
export default router;
