import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* Health check */
app.get("/", (req, res) => {
  res.json({ message: "Paradox Tech Backend is running!", status: "OK" });
});

/* API Routes */
app.use("/api/auth", authRoutes);

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
