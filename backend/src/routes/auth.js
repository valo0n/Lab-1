/* Auth routes - Register, Login, Refresh, Logout */
import express from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getRefreshExpiry,
} from "../utils/jwt.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

/* ─────────────────────────────────────────────
   POST /api/auth/register - Regjistrimi i nje useri te ri
   ───────────────────────────────────────────── */
router.post("/register", async (req, res) => {
  try {
    const { user_name, email, password, emri_plote, telefoni } = req.body;

    /* Validim baze */
    if (!user_name || !email || !password) {
      return res
        .status(400)
        .json({ error: "user_name, email dhe password jane te detyrueshme" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password duhet te jete te pakten 6 karaktere" });
    }

    /* Kontrollo nese ekziston */
    const existing = await prisma.users.findFirst({
      where: { OR: [{ email }, { user_name }] },
    });

    if (existing) {
      return res
        .status(409)
        .json({ error: "Useri me kete email ose username ekziston" });
    }

    /* Hash password me bcrypt - 10 rounds eshte standard */
    const password_hash = await bcrypt.hash(password, 10);

    /* Krijo userin ne transaksion bashke me rolin default 'Klient' */
    const result = await prisma.$transaction(async (tx) => {
      /* Krijo userin */
      const newUser = await tx.users.create({
        data: {
          user_name,
          email,
          password_hash,
          emri_plote: emri_plote || null,
          telefoni: telefoni || null,
        },
      });

      /* Gjej rolin 'Klient' nga DB */
      const klientRole = await tx.roles.findUnique({
        where: { name: "Klient" },
      });
      if (klientRole) {
        await tx.user_roles.create({
          data: { user_id: newUser.id, role_id: klientRole.id },
        });
      }

      /* Krijo edhe nje rekord ne customers per kete user */
      if (emri_plote) {
        const [emri, ...mbiemriParts] = emri_plote.split(" ");
        await tx.customers.create({
          data: {
            user_id: newUser.id,
            emri: emri || "Klient",
            mbiemri: mbiemriParts.join(" ") || "I Ri",
            email,
            telefoni,
          },
        });
      }

      return newUser;
    });

    res.status(201).json({
      message: "Useri u regjistrua me sukses",
      user: {
        id: result.id,
        user_name: result.user_name,
        email: result.email,
        emri_plote: result.emri_plote,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Gabim ne server gjate regjistrimit" });
  }
});

/* ─────────────────────────────────────────────
   POST /api/auth/login - Login dhe leshim tokeni
   ───────────────────────────────────────────── */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email dhe password jane te detyrueshme" });
    }

    /* Gjej userin me rolet */
    const user = await prisma.users.findUnique({
      where: { email },
      include: {
        user_roles: { include: { roles: true } },
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Email ose password i gabuar" });
    }

    if (!user.aktiv) {
      return res.status(403).json({ error: "Llogaria juaj eshte caktivizuar" });
    }

    /* Krahaso passwordin me hash-in */
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Email ose password i gabuar" });
    }

    /* Merr listen e roleve */
    const roles = user.user_roles.map((ur) => ur.roles.name);

    /* Payload per tokenin */
    const payload = { id: user.id, email: user.email, roles };

    /* Gjenero tokenat */
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    /* Ruaj refresh token ne DB per ta verifikuar dhe ta revokuar me vone */
    await prisma.refresh_tokens.create({
      data: {
        user_id: user.id,
        token: refreshToken,
        expires_at: getRefreshExpiry(),
      },
    });

    /* Perditeso last_login */
    await prisma.users.update({
      where: { id: user.id },
      data: { last_login: new Date() },
    });

    res.json({
      message: "Login i suksesshem",
      user: {
        id: user.id,
        user_name: user.user_name,
        email: user.email,
        emri_plote: user.emri_plote,
        roles,
      },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Gabim ne server gjate login-it" });
  }
});

/* ─────────────────────────────────────────────
   POST /api/auth/refresh - Rinovo access token me refresh token
   Implementon REFRESH TOKEN ROTATION per siguri maksimale
   ───────────────────────────────────────────── */
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token mungon" });
    }

    /* Verifiko nese tokeni eshte valid */
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return res
        .status(401)
        .json({ error: "Refresh token i pavlefshem ose i skaduar" });
    }

    /* Gjej tokenin ne DB */
    const dbToken = await prisma.refresh_tokens.findFirst({
      where: { token: refreshToken, user_id: payload.id },
    });

    if (!dbToken) {
      return res.status(401).json({ error: "Refresh token nuk u gjet" });
    }

    /* Kontrollo nese eshte revokuar */
    if (dbToken.revoked_at) {
      /* SECURITY ALERT: nese po perdoret nje token i revokuar, 
         dikush ka tentuar ta vjedhi - revokojme te gjithe tokenat e userit */
      await prisma.refresh_tokens.updateMany({
        where: { user_id: payload.id, revoked_at: null },
        data: { revoked_at: new Date() },
      });
      return res.status(401).json({
        error: "Token i revokuar - per siguri, te gjithe sesionet jane mbyllur",
      });
    }

    /* Kontrollo nese ka skaduar */
    if (new Date() > dbToken.expires_at) {
      return res.status(401).json({ error: "Refresh token i skaduar" });
    }

    /* TOKEN ROTATION: gjenero token te ri, revoko te vjetrin */
    const newPayload = {
      id: payload.id,
      email: payload.email,
      roles: payload.roles,
    };
    const newAccessToken = generateAccessToken(newPayload);
    const newRefreshToken = generateRefreshToken(newPayload);

    await prisma.$transaction([
      /* Revoko tokenin e vjeter */
      prisma.refresh_tokens.update({
        where: { id: dbToken.id },
        data: { revoked_at: new Date(), replaced_by_token: newRefreshToken },
      }),
      /* Ruaj tokenin e ri */
      prisma.refresh_tokens.create({
        data: {
          user_id: payload.id,
          token: newRefreshToken,
          expires_at: getRefreshExpiry(),
        },
      }),
    ]);

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    console.error("Refresh error:", err);
    res.status(500).json({ error: "Gabim ne server" });
  }
});

/* ─────────────────────────────────────────────
   POST /api/auth/logout - Revoko refresh token
   ───────────────────────────────────────────── */
router.post("/logout", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await prisma.refresh_tokens.updateMany({
        where: { token: refreshToken, revoked_at: null },
        data: { revoked_at: new Date() },
      });
    }

    res.json({ message: "Logout i suksesshem" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Gabim ne server" });
  }
});

/* ─────────────────────────────────────────────
   GET /api/auth/me - Merr te dhenat e userit te loguar
   ───────────────────────────────────────────── */
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: req.user.id },
      include: { user_roles: { include: { roles: true } } },
    });

    if (!user) return res.status(404).json({ error: "Useri nuk u gjet" });

    res.json({
      id: user.id,
      user_name: user.user_name,
      email: user.email,
      emri_plote: user.emri_plote,
      telefoni: user.telefoni,
      foto_profili: user.foto_profili,
      data_regjistrimit: user.data_regjistrimit,
      roles: user.user_roles.map((ur) => ur.roles.name),
    });
  } catch (err) {
    console.error("Me error:", err);
    res.status(500).json({ error: "Gabim ne server" });
  }
});

export default router;
