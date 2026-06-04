/* Users routes - menaxhimi i perdoruesve te sistemit + rolet (Admin) */
import express from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = express.Router();

const shapeUser = (u) => ({
  id: u.id,
  user_name: u.user_name,
  email: u.email,
  emri_plote: u.emri_plote,
  telefoni: u.telefoni,
  aktiv: u.aktiv,
  data_regjistrimit: u.data_regjistrimit,
  last_login: u.last_login,
  roles: u.user_roles?.map((ur) => ur.roles.name) || [],
});

/* GET /api/users/roles/all - listo rolet (para /:id) */
router.get(
  "/roles/all",
  authenticate,
  requireRole("Admin"),
  async (req, res) => {
    try {
      const roles = await prisma.roles.findMany({ orderBy: { name: "asc" } });
      res.json(roles);
    } catch (err) {
      console.error("Get roles error:", err);
      res.status(500).json({ error: "Gabim ne marrjen e roleve" });
    }
  },
);

/* GET /api/users - listo perdoruesit */
router.get("/", authenticate, requireRole("Admin"), async (req, res) => {
  try {
    const { search } = req.query;
    const where = {};
    if (search) {
      where.OR = [
        { user_name: { contains: search } },
        { email: { contains: search } },
        { emri_plote: { contains: search } },
      ];
    }
    const users = await prisma.users.findMany({
      where,
      include: { user_roles: { include: { roles: true } } },
      orderBy: { id: "desc" },
    });
    res.json(users.map(shapeUser));
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ error: "Gabim ne marrjen e perdoruesve" });
  }
});

/* GET /api/users/:id */
router.get("/:id", authenticate, requireRole("Admin"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = await prisma.users.findUnique({
      where: { id },
      include: { user_roles: { include: { roles: true } } },
    });
    if (!user) return res.status(404).json({ error: "Perdoruesi nuk u gjet" });
    res.json(shapeUser(user));
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ error: "Gabim" });
  }
});

/* POST /api/users - krijo perdorues te ri me role */
router.post("/", authenticate, requireRole("Admin"), async (req, res) => {
  try {
    const { user_name, email, password, emri_plote, telefoni, roles } =
      req.body;

    if (!user_name || !email || !password) {
      return res
        .status(400)
        .json({ error: "user_name, email dhe password jane te detyrueshem" });
    }

    /* Kontrollo nese ekziston */
    const exists = await prisma.users.findFirst({
      where: { OR: [{ email }, { user_name }] },
    });
    if (exists) {
      return res.status(409).json({ error: "Email ose username eshte i zene" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.users.create({
        data: {
          user_name,
          email,
          password_hash,
          emri_plote: emri_plote || null,
          telefoni: telefoni || null,
          email_confirmed: true,
          aktiv: true,
        },
      });

      /* Cakto rolet */
      if (Array.isArray(roles) && roles.length > 0) {
        const roleRows = await tx.roles.findMany({
          where: { name: { in: roles } },
        });
        for (const r of roleRows) {
          await tx.user_roles.create({
            data: { user_id: newUser.id, role_id: r.id },
          });
        }
      }

      return tx.users.findUnique({
        where: { id: newUser.id },
        include: { user_roles: { include: { roles: true } } },
      });
    });

    res
      .status(201)
      .json({ message: "Perdoruesi u krijua", user: shapeUser(user) });
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ error: "Gabim ne krijimin e perdoruesit" });
  }
});

/* PUT /api/users/:id - perditeso (te dhena, aktiv, role, password opsional) */
router.put("/:id", authenticate, requireRole("Admin"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { emri_plote, telefoni, aktiv, password, roles } = req.body;

    const data = {};
    if (emri_plote !== undefined) data.emri_plote = emri_plote || null;
    if (telefoni !== undefined) data.telefoni = telefoni || null;
    if (aktiv !== undefined) data.aktiv = Boolean(aktiv);
    if (password) data.password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.$transaction(async (tx) => {
      await tx.users.update({ where: { id }, data });

      /* Rivendos rolet nese u derguan */
      if (Array.isArray(roles)) {
        await tx.user_roles.deleteMany({ where: { user_id: id } });
        const roleRows = await tx.roles.findMany({
          where: { name: { in: roles } },
        });
        for (const r of roleRows) {
          await tx.user_roles.create({ data: { user_id: id, role_id: r.id } });
        }
      }

      return tx.users.findUnique({
        where: { id },
        include: { user_roles: { include: { roles: true } } },
      });
    });

    res.json({ message: "Perdoruesi u perditesua", user: shapeUser(user) });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ error: "Gabim ne perditesim" });
  }
});

/* DELETE /api/users/:id */
router.delete("/:id", authenticate, requireRole("Admin"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (id === req.user.id) {
      return res.status(400).json({ error: "Nuk mund te fshish veten" });
    }

    await prisma.user_roles.deleteMany({ where: { user_id: id } });
    await prisma.users.delete({ where: { id } });
    res.json({ message: "Perdoruesi u fshi" });
  } catch (err) {
    console.error("Delete user error:", err);
    res
      .status(500)
      .json({ error: "Gabim ne fshirje (mund te kete te dhena te lidhura)" });
  }
});

export default router;
