/* Checkout — faqja e pageses */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { createOrder } from "../../lib/api";
import Header from "../landing/Header";
import Footer from "../landing/sections/Footer";

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  /* Form state */
  const [step, setStep] = useState(1); // 1: info, 2: payment, 3: success

  /* Shipping info */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");

  /* Payment */
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  /* Order ID i gjeneruar */
  const [orderId, setOrderId] = useState("");

  const tax = cartTotal * 0.08;
  const total = cartTotal + tax;

  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  /* Nese shporta eshte bosh */
  if (cartItems.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen flex flex-col font-lato">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-20 px-4">
          <span className="text-7xl mb-4">🛒</span>
          <h2 className="text-2xl font-black text-dark mb-2">
            Shporta jote eshte bosh
          </h2>
          <p className="text-muted mb-6">
            Shto produkte para se te vazhdosh me pagesen
          </p>
          <Link
            to="/"
            className="bg-primary hover:bg-green-600 text-white px-6 py-3 rounded-xl font-black transition-colors"
          >
            ← Kthehu te produktet
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  /* Validimi i hapit 1 */
  const handleStep1 = (e) => {
    e.preventDefault();
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !zip
    ) {
      alert("Plotëso të gjitha fushat!");
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* Validimi i hapit 2 - pagesa */
  const handlePayment = async (e) => {
    e.preventDefault();
    setApiError("");

    /* Validim karte */
    if (paymentMethod === "card") {
      if (!cardNumber || !cardHolder || !expiry || !cvv) {
        alert("Plotëso të dhënat e kartës!");
        return;
      }
      if (cardNumber.replace(/\s/g, "").length < 16) {
        alert("Numri i kartës duhet të ketë 16 shifra!");
        return;
      }
      if (cvv.length < 3) {
        alert("CVV duhet të ketë 3 shifra!");
        return;
      }
    }

    setSubmitting(true);
    try {
      /* Pergatit te dhenat per backend */
      const items = cartItems.map((item) => ({
        produkti_id: item.id,
        sasia: item.quantity,
        cmimi: item.price,
      }));

      const result = await createOrder({
        items,
        adresa_dorezimit: `${address}, ${city}, ${zip}`,
        telefoni: phone,
        metoda_pageses: paymentMethod,
      });

      /* Set order ID dhe shko te hapi 3 */
      setOrderId(result.order.orderId);
      setStep(3);
      clearCart();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Order error:", err);
      setApiError(
        err.data?.error || "Gabim ne krijimin e porosise. Provo prap.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* Format card number ne grupe 4-she */
  const formatCardNumber = (val) => {
    return val
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const formatExpiry = (val) => {
    const v = val.replace(/\D/g, "").slice(0, 4);
    if (v.length >= 3) return v.slice(0, 2) + "/" + v.slice(2);
    return v;
  };

  /* ═══════════ HAPI 3: SUCCESS ═══════════ */
  if (step === 3) {
    return (
      <div className="min-h-screen flex flex-col bg-bg font-lato">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-10">
          <div className="bg-white rounded-2xl shadow-card max-w-md w-full p-8 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">✓</span>
            </div>
            <h1 className="text-2xl font-black text-dark mb-2">
              Porosia u Konfirmua!
            </h1>
            <p className="text-muted mb-5">
              Faleminderit per blerjen tuaj. Porosia juaj eshte ne procesim.
            </p>

            <div className="bg-bg rounded-xl p-4 mb-5">
              <p className="text-xs text-muted mb-1">Order ID</p>
              <p className="font-black text-dark text-lg">{orderId}</p>
            </div>

            <div className="space-y-2 mb-6 text-sm text-left">
              <div className="flex justify-between">
                <span className="text-muted">Klienti:</span>
                <span className="font-black text-dark">
                  {firstName} {lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Email:</span>
                <span className="font-black text-dark">{email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Totali:</span>
                <span className="font-black text-primary">
                  €{total.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Pagesa:</span>
                <span className="font-black text-dark">
                  {paymentMethod === "card"
                    ? "Kart Krediti"
                    : paymentMethod === "paypal"
                      ? "PayPal"
                      : "Cash on Delivery"}
                </span>
              </div>
            </div>

            <p className="text-xs text-muted mb-5">
              📧 Konfirmimi u dergua ne {email}
            </p>

            <div className="space-y-2">
              <Link
                to="/"
                className="block w-full bg-primary hover:bg-green-600 text-white font-black py-3 rounded-xl transition-colors"
              >
                ← Kthehu te ballina
              </Link>
              <button
                onClick={() => window.print()}
                className="w-full border-2 border-bg text-dark font-black py-3 rounded-xl cursor-pointer hover:bg-bg transition-colors border-0"
              >
                🖨️ Printo Faturen
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  /* ═══════════ HAPAT 1 & 2 ═══════════ */
  return (
    <div className="min-h-screen flex flex-col bg-bg font-lato">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[
            { n: 1, label: "Informacioni" },
            { n: 2, label: "Pagesa" },
            { n: 3, label: "Konfirmim" },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-colors ${
                  step >= s.n ? "bg-primary text-white" : "bg-bg text-muted"
                }`}
              >
                {step > s.n ? "✓" : s.n}
              </div>
              <span
                className={`ml-2 text-sm font-black hidden sm:inline ${step >= s.n ? "text-dark" : "text-muted"}`}
              >
                {s.label}
              </span>
              {i < 2 && (
                <div
                  className={`w-8 sm:w-16 h-0.5 mx-2 ${step > s.n ? "bg-primary" : "bg-bg"}`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Form */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <form
                onSubmit={handleStep1}
                className="bg-white rounded-2xl p-6 shadow-card"
              >
                <h2 className="text-xl font-black text-dark mb-5">
                  📍 Adresa e Dorezimit
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-black text-dark mb-2">
                      Emri *
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      placeholder="Valon"
                      className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-dark mb-2">
                      Mbiemri *
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      placeholder="Krasniqi"
                      className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-black text-dark mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="email@example.com"
                      className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-dark mb-2">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="+383 44 123 456"
                      className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-black text-dark mb-2">
                    Adresa *
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    placeholder="Rr. Nene Tereza Nr. 15"
                    className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-black text-dark mb-2">
                      Qyteti *
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      placeholder="Prishtine"
                      className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-dark mb-2">
                      Kodi Postar *
                    </label>
                    <input
                      type="text"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      required
                      placeholder="10000"
                      className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 bg-primary hover:bg-green-600 text-white font-black py-3 rounded-xl transition-colors border-0 cursor-pointer"
                >
                  Vazhdo me Pagesen →
                </button>
              </form>
            )}

            {step === 2 && (
              <form
                onSubmit={handlePayment}
                className="bg-white rounded-2xl p-6 shadow-card"
              >
                <h2 className="text-xl font-black text-dark mb-5">
                  💳 Menyra e Pageses
                </h2>

                {apiError && (
                  <div className="bg-red-50 border border-red-200 text-danger px-4 py-2 rounded-xl text-sm mb-4">
                    {apiError}
                  </div>
                )}
                {/* Payment method tabs */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {[
                    { key: "card", icon: "💳", label: "Kart" },
                    { key: "paypal", icon: "🅿️", label: "PayPal" },
                    { key: "cash", icon: "💵", label: "Cash" },
                  ].map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setPaymentMethod(m.key)}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all text-center ${
                        paymentMethod === m.key
                          ? "border-primary bg-bg"
                          : "border-bg hover:border-primary/50"
                      }`}
                    >
                      <p className="text-2xl mb-1">{m.icon}</p>
                      <p className="text-xs font-black text-dark">{m.label}</p>
                    </button>
                  ))}
                </div>

                {/* Card form */}
                {paymentMethod === "card" && (
                  <>
                    {/* Card preview */}
                    <div className="bg-gradient-to-br from-primary via-emerald-500 to-emerald-700 rounded-2xl p-5 text-white mb-5 relative overflow-hidden">
                      <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10"></div>
                      <div className="absolute right-4 top-4 flex">
                        <div className="w-6 h-6 rounded-full bg-white/40"></div>
                        <div className="w-6 h-6 rounded-full bg-white/60 -ml-2"></div>
                      </div>

                      <p className="text-lg font-black mb-8">Paradox Tech</p>
                      <p className="text-lg font-black tracking-widest mb-4">
                        {cardNumber || "**** **** **** ****"}
                      </p>

                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-xs opacity-75 mb-0.5">
                            Card Holder
                          </p>
                          <p className="font-black text-sm">
                            {cardHolder || "EMRI MBIEMRI"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs opacity-75 mb-0.5">Expiry</p>
                          <p className="font-black text-sm">
                            {expiry || "MM/YY"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-black text-dark mb-2">
                        Numri i Kartes *
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) =>
                          setCardNumber(formatCardNumber(e.target.value))
                        }
                        required
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                      />
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-black text-dark mb-2">
                        Emri ne Karte *
                      </label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) =>
                          setCardHolder(e.target.value.toUpperCase())
                        }
                        required
                        placeholder="VALON KRASNIQI"
                        className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-black text-dark mb-2">
                          Skadenca *
                        </label>
                        <input
                          type="text"
                          value={expiry}
                          onChange={(e) =>
                            setExpiry(formatExpiry(e.target.value))
                          }
                          required
                          placeholder="MM/YY"
                          className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-black text-dark mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          value={cvv}
                          onChange={(e) =>
                            setCvv(
                              e.target.value.replace(/\D/g, "").slice(0, 3),
                            )
                          }
                          required
                          placeholder="123"
                          className="w-full px-4 py-2.5 border border-bg rounded-xl text-sm outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  </>
                )}

                {paymentMethod === "paypal" && (
                  <div className="bg-bg rounded-xl p-6 text-center">
                    <p className="text-5xl mb-2">🅿️</p>
                    <p className="text-sm text-dark mb-2">
                      Do te ridrejtohesh ne PayPal per te perfunduar pagesen
                    </p>
                    <p className="text-xs text-muted">
                      Pasi te konfirmosh, do te kthehesh automatikisht
                    </p>
                  </div>
                )}

                {paymentMethod === "cash" && (
                  <div className="bg-bg rounded-xl p-6 text-center">
                    <p className="text-5xl mb-2">💵</p>
                    <p className="text-sm text-dark mb-2">
                      Paguaj kur te marresh produktin
                    </p>
                    <p className="text-xs text-muted">
                      Pranohen vetem kartmonedha ne euro
                    </p>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={submitting}
                    className="flex-1 border-2 border-bg text-dark font-black py-3 rounded-xl cursor-pointer hover:bg-bg transition-colors disabled:opacity-50"
                  >
                    ← Kthehu
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-primary hover:bg-green-600 text-white font-black py-3 rounded-xl transition-colors border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting
                      ? "Duke krijuar porosine..."
                      : "Konfirmo Porosine →"}
                  </button>
                </div>

                <p className="text-xs text-muted text-center mt-4">
                  🔒 Pagesa juaj eshte e mbrojtur me enkriptim SSL
                </p>
              </form>
            )}
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-card sticky top-24">
              <h2 className="text-lg font-black text-dark mb-4">
                Pasqyra e Porosise
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-bg rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                      {item.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-dark text-sm truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted">
                        Sasia: {item.quantity}
                      </p>
                    </div>
                    <span className="font-black text-dark text-sm">
                      €{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-bg pt-3 space-y-2 text-sm mb-4">
                <div className="flex justify-between text-muted">
                  <span>Nentotal</span>
                  <span>€{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Dorezimi</span>
                  <span className="text-primary font-black">Falas</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>TVSH (8%)</span>
                  <span>€{tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-bg pt-3">
                <div className="flex justify-between text-lg font-black text-dark">
                  <span>Totali</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
