/* Service requests routes - kerkesa per servis/riparim */
import express from "express";
import prisma from "../lib/prisma.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = express.Router();

const includeAll = {
  products: {
    select: { id: true, emertimi: true, marka: true, foto_kryesore: true },
  },
  customers: {
    select: { id: true, emri: true, mbiemri: true, email: true },
  },
  users: { select: { id: true, emri_plote: true } }, // tekniku
};

/* GET /api/service-requests - te gjitha (Admin, Teknik) */
router.get(
  "/",
  authenticate,
  requireRole("Admin", "Teknik"),
  async (req, res) => {
    try {
      const { search, status } = req.query;
      const where = {};
      if (status) where.statusi = status;
      if (search) {
        where.OR = [
          { pershkrimi_problemit: { contains: search } },
          { products: { emertimi: { contains: search } } },
          { customers: { emri: { contains: search } } },
          { customers: { mbiemri: { contains: search } } },
          { customers: { email: { contains: search } } },
        ];
      }

      const requests = await prisma.service_requests.findMany({
        where,
        include: includeAll,
        orderBy: { data_kerkeses: "desc" },
      });
      res.json(requests);
    } catch (err) {
      console.error("Get service requests error:", err);
      res.status(500).json({ error: "Gabim ne marrjen e kerkesave" });
    }
  },
);

/* GET /api/service-requests/me - kerkesat e klientit te kycur */
router.get("/me", authenticate, async (req, res) => {
  try {
    const customer = await prisma.customers.findFirst({
      where: { user_id: req.user.id },
    });
    if (!customer) return res.json([]);

    const requests = await prisma.service_requests.findMany({
      where: { klienti_id: customer.id },
      include: includeAll,
      orderBy: { data_kerkeses: "desc" },
    });
    res.json(requests);
  } catch (err) {
    console.error("Get my service requests error:", err);
    res.status(500).json({ error: "Gabim" });
  }
});

/* POST /api/service-requests - klienti dergon produkt ne servis */
router.post("/", authenticate, async (req, res) => {
  try {
    const { produkti_id, pershkrimi_problemit, garancia_id } = req.body;

    if (!produkti_id || !pershkrimi_problemit) {
      return res.status(400).json({
        error: "Produkti dhe pershkrimi i problemit jane te detyrueshem",
      });
    }

    /* Gjej ose krijo customer-in per kete user */
    let customer = await prisma.customers.findFirst({
      where: { user_id: req.user.id },
    });
    if (!customer) {
      const user = await prisma.users.findUnique({
        where: { id: req.user.id },
      });
      const parts = (user.emri_plote || user.user_name || "Klient").split(" ");
      customer = await prisma.customers.create({
        data: {
          user_id: req.user.id,
          emri: parts[0] || "Klient",
          mbiemri: parts.slice(1).join(" ") || "-",
          email: user.email,
        },
      });
    }

    const request = await prisma.service_requests.create({
      data: {
        klienti_id: customer.id,
        produkti_id: parseInt(produkti_id),
        garancia_id: garancia_id ? parseInt(garancia_id) : null,
        pershkrimi_problemit,
        statusi: "pending",
      },
      include: includeAll,
    });

    res.status(201).json({ message: "Kerkesa per servis u dergua", request });
  } catch (err) {
    console.error("Create service request error:", err);
    res.status(500).json({ error: "Gabim ne krijimin e kerkeses" });
  }
});

/* PUT /api/service-requests/:id - perditeso statusin/kosto (Admin, Teknik) */
router.put(
  "/:id",
  authenticate,
  requireRole("Admin", "Teknik"),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { statusi, kostoja, tekniku_id, data_perfundimit } = req.body;

      const data = {};
      if (statusi !== undefined) data.statusi = statusi;
      if (kostoja !== undefined)
        data.kostoja =
          kostoja === "" || kostoja === null ? null : parseFloat(kostoja);
      if (data_perfundimit !== undefined)
        data.data_perfundimit = data_perfundimit
          ? new Date(data_perfundimit)
          : null;

      /* Cakto teknikun: ai i derguar, ose vete tekniku i kycur */
      if (tekniku_id !== undefined) {
        data.tekniku_id = tekniku_id ? parseInt(tekniku_id) : null;
      } else if (req.user.roles.includes("Teknik")) {
        data.tekniku_id = req.user.id;
      }

      /* Nese behet "completed" dhe s'u dha date, vendose tani */
      if (statusi === "completed" && data.data_perfundimit === undefined) {
        data.data_perfundimit = new Date();
      }

      const request = await prisma.service_requests.update({
        where: { id },
        data,
        include: includeAll,
      });

      res.json({ message: "Kerkesa u perditesua", request });
    } catch (err) {
      console.error("Update service request error:", err);
      res.status(500).json({ error: "Gabim ne perditesim" });
    }
  },
);

/* DELETE /api/service-requests/:id (Admin) */
router.delete("/:id", authenticate, requireRole("Admin"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.service_requests.delete({ where: { id } });
    res.json({ message: "Kerkesa u fshi" });
  } catch (err) {
    console.error("Delete service request error:", err);
    res.status(500).json({ error: "Gabim ne fshirje" });
  }
});

export default router;
