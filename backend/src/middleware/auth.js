/* Auth middleware - mbron rrugat qe kerkojne login */
import { verifyAccessToken } from "../utils/jwt.js";

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token mungon ose i pavlefshem" });
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyAccessToken(token);

  if (!payload) {
    return res.status(401).json({ error: "Token i skaduar ose i pavlefshem" });
  }

  req.user = payload; // { id, email, roles }
  next();
}

/* Middleware per rolet - kontrollon nese useri ka nje rol te caktuar */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return res.status(403).json({ error: "Nuk ke leje" });
    }

    const hasRole = req.user.roles.some((r) => allowedRoles.includes(r));
    if (!hasRole) {
      return res.status(403).json({ error: "Nuk ke rolin e duhur" });
    }

    next();
  };
}
