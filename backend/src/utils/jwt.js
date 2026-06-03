/* JWT utils - gjenerimi dhe verifikimi i tokeneve */
import jwt from "jsonwebtoken";

/* RENDESISHME: sekretet lexohen brenda funksioneve (jo ne krye te skedarit),
   sepse importet e ES modules ekzekutohen PARA se dotenv.config() te ngarkoje .env. */
function accessSecret() {
  return (
    process.env.JWT_ACCESS_SECRET || "dev_access_secret_ndrysho_ne_prodhim"
  );
}
function refreshSecret() {
  return (
    process.env.JWT_REFRESH_SECRET || "dev_refresh_secret_ndrysho_ne_prodhim"
  );
}

/* Normalizon vleren e expiresIn qe jsonwebtoken te mos hedhi error.
   - bosh/mungon            -> fallback
   - numer i paster ("604800") -> sekonda (numer)
   - timespan i vlefshem ("15m","7d","24h","7 days") -> ashtu sic eshte
   - cdo gje tjeter (hapesira, komente, gabim) -> fallback */
function normalizeExpiry(value, fallback) {
  if (value === undefined || value === null) return fallback;
  const v = String(value).trim();
  if (v === "") return fallback;
  if (/^\d+$/.test(v)) return Number(v); // sekonda
  if (
    /^\d+\s*(ms|msec|msecs|s|sec|secs|m|min|mins|h|hr|hrs|d|day|days|w|week|weeks|y|yr|yrs)$/i.test(
      v,
    )
  )
    return v;
  return fallback;
}

const accessExpires = () =>
  normalizeExpiry(process.env.JWT_ACCESS_EXPIRES, "15m");
const refreshExpires = () =>
  normalizeExpiry(process.env.JWT_REFRESH_EXPIRES, "7d");

/* Gjenero access token - jeta e shkurter (15 min) */
export function generateAccessToken(payload) {
  return jwt.sign(payload, accessSecret(), { expiresIn: accessExpires() });
}

/* Gjenero refresh token - jeta me e gjate (7 dite) */
export function generateRefreshToken(payload) {
  return jwt.sign(payload, refreshSecret(), { expiresIn: refreshExpires() });
}

/* Verifiko access token */
export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, accessSecret());
  } catch (err) {
    return null;
  }
}

/* Verifiko refresh token */
export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, refreshSecret());
  } catch (err) {
    return null;
  }
}

/* Llogarit daten e skadimit per refresh token (per ta ruajtur ne DB) */
export function getRefreshExpiry() {
  const days = parseInt(process.env.JWT_REFRESH_EXPIRES) || 7;
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + days);
  return expiry;
}
