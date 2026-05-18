/* Categories routes */
import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

/* GET /api/categories - Listo te gjitha kategorite */
router.get("/", async (req, res) => {
  try {
    const categories = await prisma.categories.findMany({
      where: { aktiv: true },
      orderBy: { emertimi: "asc" },
    });
    res.json(categories);
  } catch (err) {
    console.error("Get categories error:", err);
    res.status(500).json({ error: "Gabim ne marrjen e kategorive" });
  }
});

export default router;
