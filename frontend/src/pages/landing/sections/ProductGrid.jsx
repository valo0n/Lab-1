/* ProductGrid — shfaq produktet me filter, ngarkuar nga DB */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../../components/shop/ProductCard";
import { getProducts } from "../../../lib/api";
import { SectionHeader } from "./CategoriesStrip";

export default function ProductGrid({
  title,
  sub,
  categoryFilter = null,
  limit = 8,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = { limit };
        if (categoryFilter) params.category = categoryFilter;

        const data = await getProducts(params);
        setProducts(data);
      } catch (err) {
        console.error("Error loading products:", err);
        setError("Nuk mund të ngarkohen produktet");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryFilter, limit]);

  if (loading) {
    return (
      <section className="bg-white px-4 py-7">
        <div className="max-w-7xl mx-auto">
          <SectionHeader title={title} sub={sub} />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-bg rounded-xl h-72 animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white px-4 py-7">
        <div className="max-w-7xl mx-auto text-center py-10">
          <p className="text-danger font-black">{error}</p>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="bg-white px-4 py-7">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title={title}
          sub={sub}
          onMore={() => navigate("/shop")}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
