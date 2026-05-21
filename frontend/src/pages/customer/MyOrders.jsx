/* MyOrders — faqja e porosive te klienti */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

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
                              className="bg-white rounded-xl p-3 flex items-center gap-3"
                            >
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

      <Footer />
    </div>
  );
}
