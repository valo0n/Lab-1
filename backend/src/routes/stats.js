/* Stats routes — agreon te dhena per dashboard admin */
import express from "express";
import prisma from "../lib/prisma.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = express.Router();

/* GET /api/stats/dashboard - Statistikat e dashboard-it admin */
router.get(
  "/dashboard",
  authenticate,
  requireRole("Admin"),
  async (req, res) => {
    try {
      /* Numerimet baze nga tabelat */
      const totalProducts = await prisma.products.count({
        where: { aktiv: true },
      });
      const stockProducts = await prisma.products.count({
        where: { aktiv: true, sasia_stokut: { gt: 0 } },
      });
      const outOfStock = await prisma.products.count({
        where: { aktiv: true, sasia_stokut: 0 },
      });
      const totalCustomers = await prisma.customers.count();
      const totalUsers = await prisma.users.count();

      /* Porosit  - nese tabela eshte bosh, do dale 0 */
      const totalOrders = await prisma.orders.count();
      const completedOrders = await prisma.orders.count({
        where: { statusi: "completed" },
      });
      const pendingOrders = await prisma.orders.count({
        where: { statusi: "pending" },
      });
      const canceledOrders = await prisma.orders.count({
        where: { statusi: "canceled" },
      });

      /* Total revenue nga porosit e perfunduara */
      const revenueResult = await prisma.orders.aggregate({
        where: { statusi: "completed" },
        _sum: { totali: true },
      });
      const totalRevenue = revenueResult._sum.totali || 0;

      /* Porosit e fundit (5) */
      const recentOrders = await prisma.orders.findMany({
        take: 5,
        orderBy: { data_porosise: "desc" },
        include: { customers: true },
      });

      /* Top 4 produkte me te shitura - nga order_details */
      const topProductsRaw = await prisma.order_details.groupBy({
        by: ["produkti_id"],
        _sum: { sasia: true },
        orderBy: { _sum: { sasia: "desc" } },
        take: 4,
      });

      const topProductIds = topProductsRaw.map((p) => p.produkti_id);
      const topProductsData = await prisma.products.findMany({
        where: { id: { in: topProductIds } },
        include: { categories: true },
      });

      const topProducts = topProductsRaw.map((tp) => {
        const product = topProductsData.find((p) => p.id === tp.produkti_id);
        return {
          ...product,
          total_sold: tp._sum.sasia,
        };
      });

      /* Te dhena per chart javore - porosit e fundit 7 ditesh */
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const weeklyOrders = await prisma.orders.findMany({
        where: { data_porosise: { gte: sevenDaysAgo } },
        select: { data_porosise: true, totali: true },
      });

      /* Grupo sipas dites */
      const weekData = Array(7).fill(0);
      const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      weeklyOrders.forEach((order) => {
        const dayIndex = new Date(order.data_porosise).getDay();
        weekData[dayIndex] += parseFloat(order.totali);
      });

      /* Produkte me stok te ulet (best selling alternative kur s'ka porosi) */
      const recentProducts = await prisma.products.findMany({
        take: 4,
        where: { aktiv: true },
        orderBy: { data_krijimit: "desc" },
        include: { categories: true },
      });

      res.json({
        /* Stat cards */
        totalSales: parseFloat(totalRevenue),
        totalOrders,
        pendingOrders,
        canceledOrders,
        completedOrders,

        /* Detaje */
        totalCustomers,
        totalUsers,
        totalProducts,
        stockProducts,
        outOfStock,
        revenue: parseFloat(totalRevenue),

        /* Chart javore */
        weekData,
        dayLabels,

        /* Lista */
        recentOrders,
        topProducts,
        recentProducts,
      });
    } catch (err) {
      console.error("Stats error:", err);
      res.status(500).json({ error: "Gabim ne marrjen e statistikave" });
    }
  },
);

export default router;
