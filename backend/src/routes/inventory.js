/* Inventory routes - levizjet e inventarit (Admin, Manager) */
import express from "express";
import prisma from "../lib/prisma.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = express.Router();

/* Sa ndryshon stoku nga nje levizje (hyrje +, dalje -) */
const stockDelta = (m) => (m.sasia_hyrje || 0) - (m.sasia_dalje || 0);

/* GET /api/inventory - listo levizjet (Admin, Manager) */
router.get(
  "/",
  authenticate,
  requireRole("Admin", "Manager"),
  async (req, res) => {
    try {
      const { produkti_id, lloji } = req.query;
      const where = {};
      if (produkti_id) where.produkti_id = parseInt(produkti_id);
      if (lloji) where.lloji_levizjes = lloji;

      const movements = await prisma.inventory.findMany({
        where,
        include: {
          products: {
            select: { id: true, emertimi: true, sasia_stokut: true },
          },
        },
        orderBy: { data_levizjes: "desc" },
      });
      res.json(movements);
    } catch (err) {
      console.error("Get inventory error:", err);
      res.status(500).json({ error: "Gabim ne marrjen e inventarit" });
    }
  },
);

/* POST /api/inventory - krijo levizje + sinkronizo stokun (Admin) */
router.post("/", authenticate, requireRole("Admin"), async (req, res) => {
  try {
    const { produkti_id, lloji_levizjes, sasia, referenca } = req.body;
    const qty = parseInt(sasia);

    if (!produkti_id || !lloji_levizjes || !qty || qty <= 0) {
      return res.status(400).json({
        error: "Produkti, lloji dhe sasia (>0) jane te detyrueshem",
      });
    }

    const isHyrje = lloji_levizjes === "hyrje";

    const movement = await prisma.$transaction(async (tx) => {
      const mv = await tx.inventory.create({
        data: {
          produkti_id: parseInt(produkti_id),
          sasia_hyrje: isHyrje ? qty : 0,
          sasia_dalje: isHyrje ? 0 : qty,
          lloji_levizjes,
          referenca: referenca || null,
        },
      });

      await tx.products.update({
        where: { id: parseInt(produkti_id) },
        data: { sasia_stokut: { increment: isHyrje ? qty : -qty } },
      });

      return tx.inventory.findUnique({
        where: { id: mv.id },
        include: {
          products: {
            select: { id: true, emertimi: true, sasia_stokut: true },
          },
        },
      });
    });

    res.status(201).json({ message: "Levizja u regjistrua", movement });
  } catch (err) {
    console.error("Create inventory error:", err);
    res.status(500).json({ error: "Gabim ne krijim" });
  }
});

/* PUT /api/inventory/:id - perditeso (rikthen efektin e vjeter, aplikon te riun) */
router.put("/:id", authenticate, requireRole("Admin"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { lloji_levizjes, sasia, referenca } = req.body;
    const qty = parseInt(sasia);

    const old = await prisma.inventory.findUnique({ where: { id } });
    if (!old) return res.status(404).json({ error: "Levizja nuk u gjet" });

    const isHyrje = lloji_levizjes === "hyrje";

    const movement = await prisma.$transaction(async (tx) => {
      /* Rikthe efektin e vjeter ne stok */
      await tx.products.update({
        where: { id: old.produkti_id },
        data: { sasia_stokut: { decrement: stockDelta(old) } },
      });

      /* Aplikon te riun */
      const newDelta = isHyrje ? qty : -qty;
      await tx.products.update({
        where: { id: old.produkti_id },
        data: { sasia_stokut: { increment: newDelta } },
      });

      await tx.inventory.update({
        where: { id },
        data: {
          sasia_hyrje: isHyrje ? qty : 0,
          sasia_dalje: isHyrje ? 0 : qty,
          lloji_levizjes,
          referenca: referenca ?? old.referenca,
        },
      });

      return tx.inventory.findUnique({
        where: { id },
        include: {
          products: {
            select: { id: true, emertimi: true, sasia_stokut: true },
          },
        },
      });
    });

    res.json({ message: "Levizja u perditesua", movement });
  } catch (err) {
    console.error("Update inventory error:", err);
    res.status(500).json({ error: "Gabim ne perditesim" });
  }
});

/* DELETE /api/inventory/:id - fshi + rikthe stokun (Admin) */
router.delete("/:id", authenticate, requireRole("Admin"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const old = await prisma.inventory.findUnique({ where: { id } });
    if (!old) return res.status(404).json({ error: "Levizja nuk u gjet" });

    await prisma.$transaction(async (tx) => {
      await tx.products.update({
        where: { id: old.produkti_id },
        data: { sasia_stokut: { decrement: stockDelta(old) } },
      });
      await tx.inventory.delete({ where: { id } });
    });

    res.json({ message: "Levizja u fshi" });
  } catch (err) {
    console.error("Delete inventory error:", err);
    res.status(500).json({ error: "Gabim ne fshirje" });
  }
});

export default router;
