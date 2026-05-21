/* Stats routes — agreon te dhena per dashboard admin */
import express from "express";
import prisma from "../lib/prisma.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get(
  "/dashboard",
  authenticate,
  requireRole("Admin"),
  async (req, res) => {
    try {
      /* Produktet */
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

      /* Porositë */
      const totalOrders = await prisma.orders.count();
      const completedOrders = await prisma.orders.count({
        where: { statusi_porosis: "completed" },
      });
      const pendingOrders = await prisma.orders.count({
        where: { statusi_porosis: "pending" },
      });
      const canceledOrders = await prisma.orders.count({
        where: { statusi_porosis: "canceled" },
      });

      /* Revenue */
      const revenueResult = await prisma.orders.aggregate({
        where: { statusi_porosis: "completed" },
        _sum: { shuma_totale: true },
      });
      const totalRevenue = revenueResult._sum.shuma_totale || 0;

      /* Porosit e fundit (5) */
      const recentOrders = await prisma.orders.findMany({
        take: 5,
        orderBy: { data_porosis: "desc" },
        include: { customers: true },
      });

      /* Top 4 produkte me te shitura */
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

      /* Te dhena per chart javore */
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const weeklyOrders = await prisma.orders.findMany({
        where: { data_porosis: { gte: sevenDaysAgo } },
        select: { data_porosis: true, shuma_totale: true },
      });

      const weekData = Array(7).fill(0);
      const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      weeklyOrders.forEach((order) => {
        const dayIndex = new Date(order.data_porosis).getDay();
        weekData[dayIndex] += parseFloat(order.shuma_totale);
      });

      /* Produkte te reja */
      const recentProducts = await prisma.products.findMany({
        take: 4,
        where: { aktiv: true },
        orderBy: { data_krijimit: "desc" },
        include: { categories: true },
      });

      res.json({
        totalSales: parseFloat(totalRevenue),
        totalOrders,
        pendingOrders,
        canceledOrders,
        completedOrders,
        totalCustomers,
        totalUsers,
        totalProducts,
        stockProducts,
        outOfStock,
        revenue: parseFloat(totalRevenue),
        weekData,
        dayLabels,
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
