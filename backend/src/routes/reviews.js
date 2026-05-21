/* Reviews routes - CRUD per komentet e produkteve */
import express from "express";
import prisma from "../lib/prisma.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = express.Router();

/* ─────────────────────────────────────────────
   GET /api/reviews - Listo te gjitha (Admin)
   Mund te filtrojme me ?status=approved/pending
   ───────────────────────────────────────────── */
router.get("/", authenticate, requireRole("Admin"), async (req, res) => {
  try {
    const { status, search } = req.query;
    const where = {};

    if (status === "approved") where.aprovuar = true;
    if (status === "pending") where.aprovuar = false;

    if (search) {
      where.OR = [
        { komenti: { contains: search } },
        { customers: { emri: { contains: search } } },
        { customers: { mbiemri: { contains: search } } },
        { products: { emertimi: { contains: search } } },
      ];
    }

    const reviews = await prisma.product_reviews.findMany({
      where,
      include: {
        customers: true,
        products: { include: { categories: true } },
      },
      orderBy: { data_vleresimit: "desc" },
    });

    res.json(reviews);
  } catch (err) {
    console.error("Get reviews error:", err);
    res.status(500).json({ error: "Gabim ne marrjen e reviews" });
  }
});

/* ─────────────────────────────────────────────
   GET /api/reviews/product/:productId - Reviews per nje produkt (publik)
   ───────────────────────────────────────────── */
router.get("/product/:productId", async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const reviews = await prisma.product_reviews.findMany({
      where: { produkti_id: productId, aprovuar: true },
      include: { customers: true },
      orderBy: { data_vleresimit: "desc" },
    });

    /* Llogarit rating mesatar */
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.vleresimi, 0) / reviews.length
        : 0;

    res.json({
      reviews,
      stats: {
        total: reviews.length,
        averageRating: parseFloat(avgRating.toFixed(2)),
      },
    });
  } catch (err) {
    console.error("Get product reviews error:", err);
    res.status(500).json({ error: "Gabim ne marrjen e reviews" });
  }
});

/* ─────────────────────────────────────────────
   POST /api/reviews - Klienti shton review
   ───────────────────────────────────────────── */
router.post("/", authenticate, async (req, res) => {
  try {
    const { produkti_id, vleresimi, komenti } = req.body;

    if (!produkti_id || !vleresimi) {
      return res
        .status(400)
        .json({ error: "Produkti dhe vleresimi jane te detyrueshme" });
    }

    if (vleresimi < 1 || vleresimi > 5) {
      return res.status(400).json({ error: "Vleresimi duhet te jete 1-5" });
    }

    /* Gjej customer per userin */
    const customer = await prisma.customers.findFirst({
      where: { user_id: req.user.id },
    });

    if (!customer) {
      return res.status(400).json({
        error: "Duhet te besh nje porosi para se te lesh nje review",
      });
    }

    /* Kontrollo nese ka tashme review per kete produkt */
    const existing = await prisma.product_reviews.findFirst({
      where: { produkti_id: parseInt(produkti_id), klienti_id: customer.id },
    });

    if (existing) {
      return res
        .status(409)
        .json({ error: "Ke vleresuar tashme kete produkt" });
    }

    const review = await prisma.product_reviews.create({
      data: {
        produkti_id: parseInt(produkti_id),
        klienti_id: customer.id,
        vleresimi: parseInt(vleresimi),
        komenti: komenti || null,
        aprovuar: false,
      },
    });

    res.status(201).json({ message: "Review u shtua, pret aprovim", review });
  } catch (err) {
    console.error("Create review error:", err);
    res.status(500).json({ error: "Gabim ne shtimin e review" });
  }
});

/* ─────────────────────────────────────────────
   PUT /api/reviews/:id/approve - Aprovo/refuzo (Admin)
   ───────────────────────────────────────────── */
router.put(
  "/:id/approve",
  authenticate,
  requireRole("Admin"),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { aprovuar } = req.body;

      const review = await prisma.product_reviews.update({
        where: { id },
        data: { aprovuar: Boolean(aprovuar) },
      });

      res.json({
        message: aprovuar ? "Review u aprovua" : "Review u refuzua",
        review,
      });
    } catch (err) {
      console.error("Approve review error:", err);
      res.status(500).json({ error: "Gabim ne aprovim" });
    }
  },
);

/* ─────────────────────────────────────────────
   DELETE /api/reviews/:id - Fshi review (Admin)
   ───────────────────────────────────────────── */
router.delete("/:id", authenticate, requireRole("Admin"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.product_reviews.delete({ where: { id } });
    res.json({ message: "Review u fshi" });
  } catch (err) {
    console.error("Delete review error:", err);
    res.status(500).json({ error: "Gabim ne fshirje" });
  }
});

export default router;
