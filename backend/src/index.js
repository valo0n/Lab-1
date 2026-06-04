/* Index.js - Server backend Paradox Tech */
/* dotenv ngarkohet i pari, PARA cdo importi tjeter, qe .env te jete gati
   kur te ngarkohen routes/jwt qe varen nga process.env */
import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

/* routes */
import authRoutes from "./routes/auth.js";
import productsRoutes from "./routes/products.js";
import categoriesRoutes from "./routes/categories.js";
import statsRoutes from "./routes/stats.js";
import ordersRoutes from "./routes/orders.js";
import customersRoutes from "./routes/customers.js";
import reviewsRoutes from "./routes/reviews.js";
import suppliersRoutes from "./routes/suppliers.js";
import serviceRequestsRoutes from "./routes/service-requests.js";
import warrantiesRoutes from "./routes/warranties.js";
import uploadRoutes from "./routes/upload.js";
import paymentsRoutes from "./routes/payments.js";
import usersRoutes from "./routes/users.js";
import purchaseOrdersRoutes from "./routes/purchase-orders.js";
import inventoryRoutes from "./routes/inventory.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

/* Servo fotot e ngarkuara nga backend/uploads ne /uploads */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

/* Health check */
app.get("/", (req, res) => {
  res.json({
    message: "Paradox Tech Backend is running!",
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

/* API Routes */
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/suppliers", suppliersRoutes);
app.use("/api/service-requests", serviceRequestsRoutes);
app.use("/api/warranties", warrantiesRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/purchase-orders", purchaseOrdersRoutes);
app.use("/api/inventory", inventoryRoutes);

/* 404 handler */
app.use((req, res) => {
  res.status(404).json({ error: "Rruga nuk u gjet" });
});

/* Error handler */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Gabim i papritur ne server" });
});

app.listen(PORT, () => {
  console.log(`✅ Paradox Tech Backend ne http://localhost:${PORT}`);
});
