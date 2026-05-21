/* Warranties routes - CRUD per garancite */
import express from "express";
import prisma from "../lib/prisma.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = express.Router();

/* GET /api/warranties - Listo */
router.get("/", authenticate, async (req, res) => {
  try {
    const { status, search } = req.query;
    const isAdmin = req.user.roles.includes("Admin");
    const where = {};

    if (status && status !== "all") where.statusi = status;

    /* Klienti sheh vetem te vetat */
    if (!isAdmin) {
      const customer = await prisma.customers.findFirst({
        where: { user_id: req.user.id },
      });
      if (!customer) return res.json([]);
      where.klienti_id = customer.id;
    }

    if (search) {
      where.OR = [
        { products: { emertimi: { contains: search } } },
        { customers: { emri: { contains: search } } },
        { customers: { mbiemri: { contains: search } } },
      ];
    }

    const warranties = await prisma.warranties.findMany({
      where,
      include: {
        customers: true,
        products: { include: { categories: true } },
        orders: true,
      },
      orderBy: { data_fillimit: "desc" },
    });

    /* Llogarit ditet e mbetura per cdo garanci */
    const enriched = warranties.map((w) => {
      const today = new Date();
      const skadimi = new Date(w.data_skadimit);
      const daysLeft = Math.floor((skadimi - today) / (1000 * 60 * 60 * 24));
      return {
        ...w,
        daysLeft,
        expired: daysLeft < 0,
      };
    });

    res.json(enriched);
  } catch (err) {
    console.error("Get warranties error:", err);
    res.status(500).json({ error: "Gabim" });
  }
});

/* GET /api/warranties/:id */
router.get("/:id", authenticate, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const warranty = await prisma.warranties.findUnique({
      where: { id },
      include: {
        customers: true,
        products: { include: { categories: true } },
        orders: true,
        service_requests: true,
      },
    });

    if (!warranty)
      return res.status(404).json({ error: "Garancia nuk u gjet" });
    res.json(warranty);
  } catch (err) {
    console.error("Get warranty error:", err);
    res.status(500).json({ error: "Gabim" });
  }
});

/* POST /api/warranties - Krijo (Admin) */
router.post("/", authenticate, requireRole("Admin"), async (req, res) => {
  try {
    const {
      produkti_id,
      klienti_id,
      porosia_id,
      data_fillimit,
      data_skadimit,
      lloji,
    } = req.body;

    if (!produkti_id || !klienti_id || !data_fillimit || !data_skadimit) {
      return res
        .status(400)
        .json({ error: "Produkti, klienti dhe datat jane te detyrueshme" });
    }

    const warranty = await prisma.warranties.create({
      data: {
        produkti_id: parseInt(produkti_id),
        klienti_id: parseInt(klienti_id),
        porosia_id: porosia_id ? parseInt(porosia_id) : null,
        data_fillimit: new Date(data_fillimit),
        data_skadimit: new Date(data_skadimit),
        lloji: lloji || "Standard",
        statusi: "Aktive",
      },
    });

    res.status(201).json({ message: "Garancia u krijua", warranty });
  } catch (err) {
    console.error("Create warranty error:", err);
    res.status(500).json({ error: "Gabim" });
  }
});

/* PUT /api/warranties/:id */
router.put("/:id", authenticate, requireRole("Admin"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = { ...req.body };

    if (data.data_fillimit) data.data_fillimit = new Date(data.data_fillimit);
    if (data.data_skadimit) data.data_skadimit = new Date(data.data_skadimit);
    if (data.produkti_id) data.produkti_id = parseInt(data.produkti_id);
    if (data.klienti_id) data.klienti_id = parseInt(data.klienti_id);
    if (data.porosia_id) data.porosia_id = parseInt(data.porosia_id);

    const warranty = await prisma.warranties.update({
      where: { id },
      data,
    });

    res.json({ message: "Garancia u perditesua", warranty });
  } catch (err) {
    console.error("Update warranty error:", err);
    res.status(500).json({ error: "Gabim" });
  }
});

/* DELETE /api/warranties/:id */
router.delete("/:id", authenticate, requireRole("Admin"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.warranties.delete({ where: { id } });
    res.json({ message: "Garancia u fshi" });
  } catch (err) {
    console.error("Delete warranty error:", err);
    res.status(500).json({ error: "Gabim" });
  }
});

export default router;
