/* Customers routes - CRUD per klientet */
import express from "express";
import prisma from "../lib/prisma.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = express.Router();

/* ─────────────────────────────────────────────
   GET /api/customers - Listo te gjithe klientet (Admin)
   ───────────────────────────────────────────── */
router.get("/", authenticate, requireRole("Admin"), async (req, res) => {
  try {
    const { search } = req.query;
    const where = {};

    if (search) {
      where.OR = [
        { emri: { contains: search } },
        { mbiemri: { contains: search } },
        { email: { contains: search } },
        { telefoni: { contains: search } },
      ];
    }

    const customers = await prisma.customers.findMany({
      where,
      include: {
        orders: {
          select: { id: true, shuma_totale: true, statusi_porosis: true },
        },
        users: {
          select: { id: true, user_name: true, last_login: true, aktiv: true },
        },
      },
      orderBy: { data_regjistrimit: "desc" },
    });

    /* Llogarit total spent per cdo customer */
    const enriched = customers.map((c) => {
      const totalSpent = c.orders
        .filter((o) => o.statusi_porosis === "completed")
        .reduce((sum, o) => sum + parseFloat(o.shuma_totale), 0);

      return {
        ...c,
        ordersCount: c.orders.length,
        totalSpent,
      };
    });

    res.json(enriched);
  } catch (err) {
    console.error("Get customers error:", err);
    res.status(500).json({ error: "Gabim ne marrjen e klienteve" });
  }
});

/* ─────────────────────────────────────────────
   GET /api/customers/:id - Detajet e nje klienti
   ───────────────────────────────────────────── */
router.get("/:id", authenticate, requireRole("Admin"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const customer = await prisma.customers.findUnique({
      where: { id },
      include: {
        orders: {
          include: { order_details: { include: { products: true } } },
          orderBy: { data_porosis: "desc" },
        },
        users: true,
      },
    });

    if (!customer) return res.status(404).json({ error: "Klienti nuk u gjet" });

    res.json(customer);
  } catch (err) {
    console.error("Get customer error:", err);
    res.status(500).json({ error: "Gabim ne marrjen e klientit" });
  }
});

/* ─────────────────────────────────────────────
   PUT /api/customers/:id - Modifiko klient (Admin)
   ───────────────────────────────────────────── */
router.put("/:id", authenticate, requireRole("Admin"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const {
      emri,
      mbiemri,
      email,
      telefoni,
      adresa,
      qyteti,
      kodi_postar,
      shteti,
    } = req.body;

    const customer = await prisma.customers.update({
      where: { id },
      data: {
        emri,
        mbiemri,
        email,
        telefoni,
        adresa,
        qyteti,
        kodi_postar,
        shteti,
      },
    });

    res.json({ message: "Klienti u perditesua", customer });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Email ekziston tashme" });
    }
    console.error("Update customer error:", err);
    res.status(500).json({ error: "Gabim ne perditesim" });
  }
});

/* ─────────────────────────────────────────────
   DELETE /api/customers/:id - Fshi klient (Admin)
   ───────────────────────────────────────────── */
router.delete("/:id", authenticate, requireRole("Admin"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    /* Kontrollo nese ka porosi */
    const ordersCount = await prisma.orders.count({
      where: { klienti_id: id },
    });
    if (ordersCount > 0) {
      return res.status(400).json({
        error: `Klienti ka ${ordersCount} porosi. Fshi porosit me pare.`,
      });
    }

    await prisma.customers.delete({ where: { id } });
    res.json({ message: "Klienti u fshi" });
  } catch (err) {
    console.error("Delete customer error:", err);
    res.status(500).json({ error: "Gabim ne fshirje" });
  }
});

export default router;
