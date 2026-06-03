/* Suppliers routes - CRUD per furnitoret */
import express from "express";
import prisma from "../lib/prisma.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = express.Router();

/* GET /api/suppliers - Listo te gjithe (Admin) */
router.get(
  "/",
  authenticate,
  requireRole("Admin", "Manager"),
  async (req, res) => {
    try {
      const { search } = req.query;
      const where = {};

      if (search) {
        where.OR = [
          { emertimi: { contains: search } },
          { kontakti: { contains: search } },
          { email: { contains: search } },
        ];
      }

      const suppliers = await prisma.suppliers.findMany({
        where,
        include: {
          _count: { select: { purchase_orders: true } },
        },
        orderBy: { emertimi: "asc" },
      });

      res.json(suppliers);
    } catch (err) {
      console.error("Get suppliers error:", err);
      res.status(500).json({ error: "Gabim ne marrjen e furnitoreve" });
    }
  },
);

/* GET /api/suppliers/:id - Nje furnitor */
router.get(
  "/:id",
  authenticate,
  requireRole("Admin", "Manager"),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const supplier = await prisma.suppliers.findUnique({
        where: { id },
        include: {
          purchase_orders: { orderBy: { data_porosis: "desc" }, take: 10 },
        },
      });

      if (!supplier)
        return res.status(404).json({ error: "Furnitori nuk u gjet" });
      res.json(supplier);
    } catch (err) {
      console.error("Get supplier error:", err);
      res.status(500).json({ error: "Gabim" });
    }
  },
);

/* POST /api/suppliers - Krijo (Admin) */
router.post("/", authenticate, requireRole("Admin"), async (req, res) => {
  try {
    const { emertimi, kontakti, email, telefoni, adresa, vendi } = req.body;

    if (!emertimi) {
      return res.status(400).json({ error: "Emri eshte i detyrueshem" });
    }

    const supplier = await prisma.suppliers.create({
      data: {
        emertimi,
        kontakti: kontakti || null,
        email: email || null,
        telefoni: telefoni || null,
        adresa: adresa || null,
        vendi: vendi || null,
        aktiv: true,
      },
    });

    res.status(201).json({ message: "Furnitori u krijua", supplier });
  } catch (err) {
    console.error("Create supplier error:", err);
    res.status(500).json({ error: "Gabim ne krijim" });
  }
});

/* PUT /api/suppliers/:id - Edito (Admin) */
router.put("/:id", authenticate, requireRole("Admin"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const supplier = await prisma.suppliers.update({
      where: { id },
      data: req.body,
    });
    res.json({ message: "Furnitori u perditesua", supplier });
  } catch (err) {
    console.error("Update supplier error:", err);
    res.status(500).json({ error: "Gabim" });
  }
});

/* DELETE /api/suppliers/:id - Fshi (Admin) */
router.delete("/:id", authenticate, requireRole("Admin"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const ordersCount = await prisma.purchase_orders.count({
      where: { furnitori_id: id },
    });

    if (ordersCount > 0) {
      /* Soft delete */
      await prisma.suppliers.update({
        where: { id },
        data: { aktiv: false },
      });
    } else {
      await prisma.suppliers.delete({ where: { id } });
    }

    res.json({ message: "Furnitori u fshi" });
  } catch (err) {
    console.error("Delete supplier error:", err);
    res.status(500).json({ error: "Gabim" });
  }
});

export default router;
