/* Upload route - ruan foto te produkteve nga kompjuteri dhe kthen URL-ne */
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/* backend/uploads/products */
const uploadDir = path.join(__dirname, "..", "..", "uploads", "products");
fs.mkdirSync(uploadDir, { recursive: true });

/* Ku dhe me cfare emri ruhet foto */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = `prod_${Date.now()}_${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, unique);
  },
});

/* Lejo vetem foto */
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Lejohen vetem foto (jpg, png, webp, gif)"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/* POST /api/upload - ngarko nje foto (vetem Admin) */
router.post("/", authenticate, requireRole("Admin"), (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: "Asnje foto nuk u ngarkua" });
    }

    /* URL absolute qe te shfaqet edhe nga frontend-i (port tjeter) */
    const url = `${req.protocol}://${req.get("host")}/uploads/products/${req.file.filename}`;
    res.status(201).json({ url, filename: req.file.filename });
  });
});

export default router;
