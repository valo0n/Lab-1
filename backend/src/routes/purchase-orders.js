/* Purchase Orders routes - porosite e furnizimit (Admin, Manager) */
import express from "express";
import prisma from "../lib/prisma.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = express.Router();

const includeAll = {
  suppliers: { select: { id: true, emertimi: true } },
  purchase_order_details: {
    include: { products: { select: { id: true, emertimi: true } } },
  },
};

/* GET /api/purchase-orders - listo (Admin, Manager) */
router.get(
  "/",
  authenticate,
  requireRole("Admin", "Manager"),
  async (req, res) => {
    try {
      const { status } = req.query;
      const where = {};
      if (status) where.statusi = status;

      const orders = await prisma.purchase_orders.findMany({
        where,
        include: includeAll,
        orderBy: { data_porosis: "desc" },
      });
      res.json(orders);
    } catch (err) {
      console.error("Get purchase orders error:", err);
      res.status(500).json({ error: "Gabim ne marrjen e porosive" });
    }
  },
);

/* GET /api/purchase-orders/:id */
router.get(
  "/:id",
  authenticate,
  requireRole("Admin", "Manager"),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await prisma.purchase_orders.findUnique({
        where: { id },
        include: includeAll,
      });
      if (!order) return res.status(404).json({ error: "Porosia nuk u gjet" });
      res.json(order);
    } catch (err) {
      console.error("Get purchase order error:", err);
      res.status(500).json({ error: "Gabim" });
    }
  },
);

/* POST /api/purchase-orders - krijo me detaje (Admin) */
router.post("/", authenticate, requireRole("Admin"), async (req, res) => {
  try {
    const { furnitori_id, statusi, items } = req.body; // items: [{produkti_id, sasia, cmimi_njesi}]

    if (!furnitori_id || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({
          error: "Furnitori dhe te pakten nje produkt jane te detyrueshem",
        });
    }

    const shuma_totale = items.reduce(
      (s, it) => s + parseFloat(it.cmimi_njesi) * parseInt(it.sasia),
      0,
    );

    const order = await prisma.$transaction(async (tx) => {
      const po = await tx.purchase_orders.create({
        data: {
          furnitori_id: parseInt(furnitori_id),
          shuma_totale,
          statusi: statusi || "ne pritje",
        },
      });

      for (const it of items) {
        const sasia = parseInt(it.sasia);
        const cmimi_njesi = parseFloat(it.cmimi_njesi);
        await tx.purchase_order_details.create({
          data: {
            purchase_order_id: po.id,
            produkti_id: parseInt(it.produkti_id),
            sasia,
            cmimi_njesi,
            shuma: sasia * cmimi_njesi,
          },
        });
      }

      return tx.purchase_orders.findUnique({
        where: { id: po.id },
        include: includeAll,
      });
    });

    res.status(201).json({ message: "Porosia e furnizimit u krijua", order });
  } catch (err) {
    console.error("Create purchase order error:", err);
    res.status(500).json({ error: "Gabim ne krijim" });
  }
});

/* PUT /api/purchase-orders/:id - perditeso statusin (Admin)
   Kur behet "pranuar", produktet i shtohen stokut + krijohet levizje inventari */
router.put("/:id", authenticate, requireRole("Admin"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { statusi } = req.body;

    const existing = await prisma.purchase_orders.findUnique({
      where: { id },
      include: { purchase_order_details: true },
    });
    if (!existing) return res.status(404).json({ error: "Porosia nuk u gjet" });

    const order = await prisma.$transaction(async (tx) => {
      /* Nese kalon ne "pranuar" dhe s'ishte me pare, shto ne stok + inventar */
      if (statusi === "pranuar" && existing.statusi !== "pranuar") {
        for (const d of existing.purchase_order_details) {
          await tx.products.update({
            where: { id: d.produkti_id },
            data: { sasia_stokut: { increment: d.sasia } },
          });
          await tx.inventory.create({
            data: {
              produkti_id: d.produkti_id,
              sasia_hyrje: d.sasia,
              sasia_dalje: 0,
              lloji_levizjes: "hyrje",
              referenca: `PO#${id}`,
            },
          });
        }
      }

      await tx.purchase_orders.update({
        where: { id },
        data: { statusi: statusi || existing.statusi },
      });

      return tx.purchase_orders.findUnique({
        where: { id },
        include: includeAll,
      });
    });

    res.json({ message: "Porosia u perditesua", order });
  } catch (err) {
    console.error("Update purchase order error:", err);
    res.status(500).json({ error: "Gabim ne perditesim" });
  }
});

/* DELETE /api/purchase-orders/:id (Admin) */
router.delete("/:id", authenticate, requireRole("Admin"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.$transaction(async (tx) => {
      await tx.purchase_order_details.deleteMany({
        where: { purchase_order_id: id },
      });
      await tx.purchase_orders.delete({ where: { id } });
    });
    res.json({ message: "Porosia u fshi" });
  } catch (err) {
    console.error("Delete purchase order error:", err);
    res.status(500).json({ error: "Gabim ne fshirje" });
  }
});

export default router;
