/* Customers routes - CRUD per klientet me Block + Delete */
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

    /* Llogarit total spent + status i userit */
    const enriched = customers.map((c) => {
      const totalSpent = c.orders
        .filter((o) => o.statusi_porosis === "completed")
        .reduce((sum, o) => sum + parseFloat(o.shuma_totale), 0);

      return {
        ...c,
        ordersCount: c.orders.length,
        totalSpent,
        userActive: c.users?.aktiv ?? true,
      };
    });

    res.json(enriched);
  } catch (err) {
    console.error("Get customers error:", err);
    res.status(500).json({ error: "Gabim ne marrjen e klienteve" });
  }
});

/* GET /api/customers/:id */
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
    res.status(500).json({ error: "Gabim" });
  }
});

/* PUT /api/customers/:id - Modifiko (Admin) */
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
    res.status(500).json({ error: "Gabim" });
  }
});

/* ─────────────────────────────────────────────
   PUT /api/customers/:id/block - Bllokoj useri (Admin)
   Vendos aktiv = false → useri nuk mund te logohet me
   ───────────────────────────────────────────── */
router.put(
  "/:id/block",
  authenticate,
  requireRole("Admin"),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { block } = req.body; // true = bllokoj, false = aktivizoj

      const customer = await prisma.customers.findUnique({
        where: { id },
        include: { users: true },
      });

      if (!customer)
        return res.status(404).json({ error: "Klienti nuk u gjet" });
      if (!customer.user_id) {
        return res.status(400).json({ error: "Ky klient nuk ka llogari user" });
      }

      /* Caktivizo userin + revoko refresh tokens */
      await prisma.$transaction([
        prisma.users.update({
          where: { id: customer.user_id },
          data: { aktiv: !block },
        }),
        /* Revoko krejt sesionet aktive */
        prisma.refresh_tokens.updateMany({
          where: { user_id: customer.user_id, revoked_at: null },
          data: { revoked_at: new Date() },
        }),
      ]);

      res.json({
        message: block ? "Klienti u bllokua" : "Klienti u aktivizua",
      });
    } catch (err) {
      console.error("Block customer error:", err);
      res.status(500).json({ error: "Gabim ne bllokimin e klientit" });
    }
  },
);

/* ─────────────────────────────────────────────
   DELETE /api/customers/:id - Fshi PERGJITHMONE (Admin)
   Fshin customer + user + refresh_tokens + user_roles
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
        error: `Klienti ka ${ordersCount} porosi. Mund ta BLLOKOSH por jo ta fshish (humbisni historikun).`,
      });
    }

    const customer = await prisma.customers.findUnique({
      where: { id },
      include: { users: true },
    });

    if (!customer) return res.status(404).json({ error: "Klienti nuk u gjet" });

    /* Fshi te gjitha lidhjet + customer + user */
    await prisma.$transaction(async (tx) => {
      /* Fshi cart items, wishlists, reviews, service_requests, warranties */
      await tx.cart_items.deleteMany({ where: { klienti_id: id } });
      await tx.wishlists.deleteMany({ where: { klienti_id: id } });
      await tx.product_reviews.deleteMany({ where: { klienti_id: id } });
      await tx.service_requests.deleteMany({ where: { klienti_id: id } });
      await tx.warranties.deleteMany({ where: { klienti_id: id } });

      /* Fshi customer */
      await tx.customers.delete({ where: { id } });

      /* Fshi userin nese ekziston */
      if (customer.user_id) {
        await tx.refresh_tokens.deleteMany({
          where: { user_id: customer.user_id },
        });
        await tx.user_roles.deleteMany({
          where: { user_id: customer.user_id },
        });
        await tx.user_claims.deleteMany({
          where: { user_id: customer.user_id },
        });
        await tx.user_tokens.deleteMany({
          where: { user_id: customer.user_id },
        });
        await tx.notifications.deleteMany({
          where: { user_id: customer.user_id },
        });
        await tx.users.delete({ where: { id: customer.user_id } });
      }
    });

    res.json({ message: "Klienti dhe llogaria u fshin pergjithmone" });
  } catch (err) {
    console.error("Delete customer error:", err);
    res.status(500).json({ error: "Gabim ne fshirje" });
  }
});

export default router;
