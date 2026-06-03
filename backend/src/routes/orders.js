/* Orders routes - CRUD per porosi */
import express from "express";
import prisma from "../lib/prisma.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = express.Router();

/* ─────────────────────────────────────────────
   POST /api/orders - Krijo porosi te re (klienti pas checkout)
   ───────────────────────────────────────────── */
router.post("/", authenticate, async (req, res) => {
  try {
    const {
      items, // [{ produkti_id, sasia, cmimi }]
      adresa_dorezimit,
      telefoni,
      metoda_pageses,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Shporta eshte bosh" });
    }

    /* Gjej ose krijo customer per userin */
    let customer = await prisma.customers.findFirst({
      where: { user_id: req.user.id },
    });

    if (!customer) {
      const user = await prisma.users.findUnique({
        where: { id: req.user.id },
      });
      const [emri, ...mbiemriParts] = (user.emri_plote || "Klient I Ri").split(
        " ",
      );
      customer = await prisma.customers.create({
        data: {
          user_id: req.user.id,
          emri: emri || "Klient",
          mbiemri: mbiemriParts.join(" ") || "I Ri",
          email: user.email,
          telefoni: telefoni || user.telefoni,
        },
      });
    }

    /* Llogarit totalin */
    const shuma_totale = items.reduce(
      (sum, it) => sum + parseFloat(it.cmimi) * parseInt(it.sasia),
      0,
    );

    /* Krijo porosine ne transaksion */
    const order = await prisma.$transaction(async (tx) => {
      /* Krijo orderin */
      const newOrder = await tx.orders.create({
        data: {
          klienti_id: customer.id,
          shuma_totale,
          statusi_porosis: "pending",
          metoda_pageses: metoda_pageses || "cash",
          adresa_dorezimit: adresa_dorezimit || null,
        },
      });

      /* Krijo order_details per cdo produkt */
      for (const item of items) {
        const sasia = parseInt(item.sasia);
        const cmimi_njesi = parseFloat(item.cmimi);

        await tx.order_details.create({
          data: {
            porosia_id: newOrder.id,
            produkti_id: parseInt(item.produkti_id),
            sasia,
            cmimi_njesi,
            shuma: cmimi_njesi * sasia,
          },
        });

        /* Zbres stokun */
        await tx.products.update({
          where: { id: parseInt(item.produkti_id) },
          data: { sasia_stokut: { decrement: sasia } },
        });
      }

      return newOrder;
    });

    res.status(201).json({
      message: "Porosia u krijua me sukses",
      order: {
        ...order,
        orderId: `#ORD${order.id.toString().padStart(6, "0")}`,
      },
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ error: "Gabim ne krijimin e porosise" });
  }
});

/* ─────────────────────────────────────────────
   GET /api/orders - Listo te gjitha (Admin)
   ───────────────────────────────────────────── */
router.get(
  "/",
  authenticate,
  requireRole("Admin", "Shites", "Manager"),
  async (req, res) => {
    try {
      const { status, search } = req.query;
      const where = {};

      if (status && status !== "all") where.statusi_porosis = status;

      if (search) {
        where.OR = [
          { customers: { emri: { contains: search } } },
          { customers: { mbiemri: { contains: search } } },
          { customers: { email: { contains: search } } },
        ];
      }

      const orders = await prisma.orders.findMany({
        where,
        include: {
          customers: true,
          order_details: { include: { products: true } },
        },
        orderBy: { data_porosis: "desc" },
      });

      res.json(orders);
    } catch (err) {
      console.error("Get orders error:", err);
      res.status(500).json({ error: "Gabim ne marrjen e porosive" });
    }
  },
);

/* ─────────────────────────────────────────────
   GET /api/orders/me - Porosit e mia (klienti)
   ───────────────────────────────────────────── */
router.get("/me", authenticate, async (req, res) => {
  try {
    const customer = await prisma.customers.findFirst({
      where: { user_id: req.user.id },
    });

    if (!customer) return res.json([]);

    const orders = await prisma.orders.findMany({
      where: { klienti_id: customer.id },
      include: { order_details: { include: { products: true } } },
      orderBy: { data_porosis: "desc" },
    });

    res.json(orders);
  } catch (err) {
    console.error("Get my orders error:", err);
    res.status(500).json({ error: "Gabim ne marrjen e porosive" });
  }
});

/* ─────────────────────────────────────────────
   GET /api/orders/:id - Nje porosi me detaje
   ───────────────────────────────────────────── */
router.get("/:id", authenticate, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const order = await prisma.orders.findUnique({
      where: { id },
      include: {
        customers: true,
        order_details: { include: { products: true } },
      },
    });

    if (!order) return res.status(404).json({ error: "Porosia nuk u gjet" });

    /* Klienti shikon vetem te vetat */
    if (!req.user.roles.includes("Admin")) {
      const customer = await prisma.customers.findFirst({
        where: { user_id: req.user.id },
      });
      if (!customer || order.klienti_id !== customer.id) {
        return res.status(403).json({ error: "Nuk ke leje" });
      }
    }

    res.json(order);
  } catch (err) {
    console.error("Get order error:", err);
    res.status(500).json({ error: "Gabim ne marrjen e porosise" });
  }
});

/* ─────────────────────────────────────────────
   PUT /api/orders/:id/status - Ndrysho status (Admin)
   ───────────────────────────────────────────── */
router.put(
  "/:id/status",
  authenticate,
  requireRole("Admin", "Shites"),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { statusi_porosis } = req.body;

      const validStatuses = [
        "pending",
        "processing",
        "shipped",
        "completed",
        "canceled",
      ];
      if (!validStatuses.includes(statusi_porosis)) {
        return res.status(400).json({ error: "Status i pavlefshem" });
      }

      const order = await prisma.orders.update({
        where: { id },
        data: { statusi_porosis },
      });

      res.json({ message: "Statusi u perditesua", order });
    } catch (err) {
      console.error("Update status error:", err);
      res.status(500).json({ error: "Gabim ne perditesim" });
    }
  },
);

/* ─────────────────────────────────────────────
   DELETE /api/orders/:id - Fshi (Admin)
   ───────────────────────────────────────────── */
router.delete("/:id", authenticate, requireRole("Admin"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.$transaction([
      prisma.order_details.deleteMany({ where: { porosia_id: id } }),
      prisma.orders.delete({ where: { id } }),
    ]);
    res.json({ message: "Porosia u fshi" });
  } catch (err) {
    console.error("Delete order error:", err);
    res.status(500).json({ error: "Gabim ne fshirje" });
  }
});

export default router;
