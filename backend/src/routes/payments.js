/* Payments route - Stripe (vetem kartela, test mode) */
import express from "express";
import Stripe from "stripe";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

/* Inicializohet vetem nje here, dhe lexohet pas dotenv */
let stripeClient = null;
function getStripe() {
  if (stripeClient) return stripeClient;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  stripeClient = new Stripe(key);
  return stripeClient;
}

/* POST /api/payments/create-intent - krijon PaymentIntent (kartele) */
router.post("/create-intent", authenticate, async (req, res) => {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return res
        .status(500)
        .json({ error: "STRIPE_SECRET_KEY mungon te .env" });
    }

    const { amount } = req.body; // ne cents (p.sh. 1299 = 12.99)
    const cents = Math.round(Number(amount));
    if (!cents || cents < 50) {
      return res.status(400).json({ error: "Shuma e pavlefshme" });
    }

    const intent = await stripe.paymentIntents.create({
      amount: cents,
      currency: "eur",
      payment_method_types: ["card"], // vetem kartele
    });

    res.json({ clientSecret: intent.client_secret });
  } catch (err) {
    console.error("Create payment intent error:", err);
    res.status(500).json({ error: err.message || "Gabim ne pagese" });
  }
});

export default router;
