/* Categories routes - CRUD i plote */
import express from "express";
import prisma from "../lib/prisma.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = express.Router();

/* GET /api/categories - Listo te gjitha (publik) */
router.get("/", async (req, res) => {
  try {
    const categories = await prisma.categories.findMany({
      where: { aktiv: true },
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { emertimi: "asc" },
    });
    res.json(categories);
  } catch (err) {
    console.error("Get categories error:", err);
    res.status(500).json({ error: "Gabim ne marrjen e kategorive" });
  }
});

/* GET /api/categories/:id - Nje kategori */
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const category = await prisma.categories.findUnique({
      where: { id },
      include: {
        products: { where: { aktiv: true } },
        _count: { select: { products: true } },
      },
    });

    if (!category)
      return res.status(404).json({ error: "Kategoria nuk u gjet" });
    res.json(category);
  } catch (err) {
    console.error("Get category error:", err);
    res.status(500).json({ error: "Gabim" });
  }
});

/* POST /api/categories - Krijo (Admin) */
router.post("/", authenticate, requireRole("Admin"), async (req, res) => {
  try {
    const { emertimi, pershkrimi, ikona, foto } = req.body;

    if (!emertimi) {
      return res
        .status(400)
        .json({ error: "Emri i kategorise eshte i detyrueshem" });
    }

    /* Kontrollo nese ekziston */
    const existing = await prisma.categories.findFirst({
      where: { emertimi },
    });
    if (existing) {
      return res.status(409).json({ error: "Kategoria me kete emer ekziston" });
    }

    const category = await prisma.categories.create({
      data: {
        emertimi,
        pershkrimi: pershkrimi || null,
        ikona: ikona || null,
        foto: foto || null,
        aktiv: true,
      },
    });

    res.status(201).json({ message: "Kategoria u krijua", category });
  } catch (err) {
    console.error("Create category error:", err);
    res.status(500).json({ error: "Gabim ne krijim" });
  }
});

/* PUT /api/categories/:id - Edito (Admin) */
router.put("/:id", authenticate, requireRole("Admin"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { emertimi, pershkrimi, ikona, foto, aktiv } = req.body;

    const category = await prisma.categories.update({
      where: { id },
      data: {
        ...(emertimi !== undefined && { emertimi }),
        ...(pershkrimi !== undefined && { pershkrimi }),
        ...(ikona !== undefined && { ikona }),
        ...(foto !== undefined && { foto }),
        ...(aktiv !== undefined && { aktiv: Boolean(aktiv) }),
      },
    });

    res.json({ message: "Kategoria u perditesua", category });
  } catch (err) {
    console.error("Update category error:", err);
    res.status(500).json({ error: "Gabim ne perditesim" });
  }
});

/* DELETE /api/categories/:id - Fshi (Admin, soft delete) */
router.delete("/:id", authenticate, requireRole("Admin"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    /* Kontrollo nese ka produkte */
    const productsCount = await prisma.products.count({
      where: { kategoria_id: id, aktiv: true },
    });

    if (productsCount > 0) {
      return res.status(400).json({
        error: `Kategoria ka ${productsCount} produkte. Fshi produktet me pare ose caktivizoje.`,
      });
    }

    /* Soft delete - vetem caktivizo */
    await prisma.categories.update({
      where: { id },
      data: { aktiv: false },
    });

    res.json({ message: "Kategoria u fshi" });
  } catch (err) {
    console.error("Delete category error:", err);
    res.status(500).json({ error: "Gabim ne fshirje" });
  }
});

export default router;
