/* MyOrders — faqja e porosive te klienti */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyOrders, api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Header from "../landing/Header";
import Footer from "../landing/sections/Footer";

const CATEGORY_EMOJI = {
  Smartphones: "📱",
  Laptops: "💻",
  Audio: "🎧",
  Gaming: "🎮",
  "TV & Monitor": "📺",
  Cameras: "📷",
  Wearables: "⌚",
  Accessories: "🔌",
};

const STATUS_LABELS = {
  pending: {
    label: "Në Pritje",
    color: "bg-yellow-100 text-yellow-700",
    icon: "⏳",
  },
  processing: {
    label: "Duke u Procesuar",
    color: "bg-blue-100 text-blue-700",
    icon: "🔄",
  },
  shipped: {
    label: "Dërguar",
    color: "bg-purple-100 text-purple-700",
    icon: "🚚",
  },
  completed: {
    label: "Përfunduar",
    color: "bg-green-100 text-green-700",
    icon: "✓",
  },
  canceled: { label: "Anuluar", color: "bg-red-100 text-red-700", icon: "✗" },
};

export default function MyOrders() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [serviceModal, setServiceModal] = useState(null); // { product, orderId }
  const [problemText, setProblemText] = useState("");
  const [submittingService, setSubmittingService] = useState(false);

  const openServiceModal = (product, orderId) => {
    setServiceModal({ product, orderId });
    setProblemText("");
  };

  const submitServiceRequest = async () => {
    if (!problemText.trim()) {
      showToast("Përshkruaj problemin e produktit", "error");
      return;
    }
    setSubmittingService(true);
    try {
      await api.post("/service-requests", {
        produkti_id: serviceModal.product.id,
        pershkrimi_problemit: problemText.trim(),
      });
      showToast("Kërkesa për servis u dërgua me sukses!", "success");
      setServiceModal(null);
    } catch (err) {
      showToast(`Gabim: ${err.data?.error || err.message}`, "error");
    } finally {
      setSubmittingService(false);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError("Nuk mund të ngarkohen porositë");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchOrders();
  }, [user]);

  /* Nese nuk je i loguar */
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-bg font-lato">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-20 px-4">
          <span className="text-7xl mb-4">🔒</span>
          <h2 className="text-2xl font-black text-dark mb-2">
            Duhet të kyçesh
          </h2>
          <p className="text-muted mb-6">Logohu për të parë porositë e tua</p>
          <Link
            to="/login"
            className="bg-primary hover:bg-green-600 text-white px-6 py-3 rounded-xl font-black no-underline"
          >
            Kyçu
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg font-lato">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-black text-dark mb-2">
            Porositë e Mia
          </h1>
          <p className="text-sm text-muted">
            {loading ? "Duke ngarkuar..." : `${orders.length} porosi gjithsej`}
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-card animate-pulse h-32"
              />
            ))}
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-card">
            <p className="text-5xl mb-3">⚠️</p>
            <p className="font-black text-danger">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-card">
            <p className="text-7xl mb-4">📦</p>
            <h2 className="text-xl font-black text-dark mb-2">
              Nuk ke porosi ende
            </h2>
            <p className="text-muted mb-6">
              Shfleto produktet dhe bëj porosinë tënde të parë!
            </p>
            <Link
              to="/"
              className="inline-block bg-primary hover:bg-green-600 text-white px-6 py-3 rounded-xl font-black no-underline"
            >
              Shko te Dyqani →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const status =
                STATUS_LABELS[order.statusi_porosis] || STATUS_LABELS.pending;
              const isExpanded = expandedOrder === order.id;
              const itemsCount =
                order.order_details?.reduce((sum, d) => sum + d.sasia, 0) || 0;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-card overflow-hidden"
                >
                  {/* Header i porosise */}
                  <div className="p-5 border-b border-bg">
                    <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                      <div>
                        <p className="font-black text-dark text-lg">
                          #ORD{order.id.toString().padStart(6, "0")}
                        </p>
                        <p className="text-xs text-muted">
                          {new Date(order.data_porosis).toLocaleDateString(
                            "sq-AL",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>

                      <span
                        className={`text-xs font-black px-3 py-1.5 rounded-full ${status.color}`}
                      >
                        {status.icon} {status.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted">Produkte</p>
                        <p className="font-black text-dark">{itemsCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">Pagesa</p>
                        <p className="font-black text-dark capitalize">
                          {order.metoda_pageses}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">Totali</p>
                        <p className="font-black text-primary">
                          €{parseFloat(order.shuma_totale).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() =>
                            setExpandedOrder(isExpanded ? null : order.id)
                          }
                          className="bg-bg hover:bg-bg/70 text-dark text-xs font-black px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-colors w-full"
                        >
                          {isExpanded ? "▲ Mbyll" : "▼ Detaje"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Detajet (kur është expanded) */}
                  {isExpanded && (
                    <div className="p-5 bg-bg/30">
                      {order.adresa_dorezimit && (
                        <div className="bg-white rounded-xl p-3 mb-3">
                          <p className="text-xs text-muted mb-1">
                            📍 Adresa e Dorëzimit
                          </p>
                          <p className="text-sm text-dark">
                            {order.adresa_dorezimit}
                          </p>
                        </div>
                      )}

                      <p className="text-xs font-black text-muted mb-2">
                        PRODUKTET
                      </p>
                      <div className="space-y-2">
                        {order.order_details?.map((detail) => {
                          const emoji =
                            detail.products?.categories?.ikona ||
                            CATEGORY_EMOJI[
                              detail.products?.categories?.emertimi
                            ] ||
                            "📦";

                          return (
                            <div
                              key={detail.id}
                              className="bg-white rounded-xl p-3"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-bg rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                                  {emoji}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-black text-dark text-sm truncate">
                                    {detail.products?.emertimi}
                                  </p>
                                  <p className="text-xs text-muted">
                                    {detail.products?.marka} · Sasia:{" "}
                                    {detail.sasia}
                                  </p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <p className="font-black text-primary text-sm">
                                    €{parseFloat(detail.shuma).toLocaleString()}
                                  </p>
                                  <p className="text-xs text-muted">
                                    €
                                    {parseFloat(
                                      detail.cmimi_njesi,
                                    ).toLocaleString()}{" "}
                                    × {detail.sasia}
                                  </p>
                                </div>
                              </div>
                              {(order.statusi_porosis === "completed" ||
                                order.statusi_porosis === "shipped") && (
                                <button
                                  onClick={() =>
                                    openServiceModal(detail.products, order.id)
                                  }
                                  className="mt-3 w-full text-xs font-black text-primary border border-primary/40 rounded-lg py-2 hover:bg-bg cursor-pointer transition-colors"
                                >
                                  🔧 Dërgo në servis
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-bg">
                        <span className="font-black text-dark">Totali:</span>
                        <span className="font-black text-primary text-lg">
                          €{parseFloat(order.shuma_totale).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal: Dërgo në servis */}
      {serviceModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9998] p-4"
          onClick={() => !submittingService && setServiceModal(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-black text-dark mb-1">
              🔧 Dërgo në servis
            </h3>
            <p className="text-sm text-muted mb-4">
              {serviceModal.product?.emertimi}
            </p>

            <label className="block text-sm font-black text-dark mb-2">
              Përshkruaj problemin
            </label>
            <textarea
              value={problemText}
              onChange={(e) => setProblemText(e.target.value)}
              rows={4}
              placeholder="P.sh. nuk ndizet, ekrani ka probleme, bateria nuk mban..."
              className="w-full border border-bg rounded-xl px-3 py-2 text-sm outline-none focus:border-primary resize-none mb-4"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setServiceModal(null)}
                disabled={submittingService}
                className="flex-1 border-2 border-bg text-muted font-black py-2.5 rounded-full hover:bg-bg cursor-pointer transition-colors"
              >
                Anulo
              </button>
              <button
                onClick={submitServiceRequest}
                disabled={submittingService}
                className="flex-1 bg-primary text-white font-black py-2.5 rounded-full hover:bg-primary/90 cursor-pointer transition-colors disabled:opacity-60"
              >
                {submittingService ? "Duke dërguar..." : "Dërgo kërkesën"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
