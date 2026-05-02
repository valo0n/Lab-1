/* ProductGrid — shfaq nje grid produktesh me filter sipas kategorise */
import ProductCard from "../../../components/shop/ProductCard";
import { PRODUCTS } from "../../../data/products";
import { SectionHeader } from "./CategoriesStrip";

export default function ProductGrid({ title, sub, filter = "trending", selectedCat = "" }) {
  /* Filtro produktet sipas seksionit (trending, deal, ose feat) */
  let products = PRODUCTS.filter((p) => p[filter]);

  /* Filtro me tej sipas kategorise nese eshte zgjedhur */
  if (selectedCat) {
    products = products.filter((p) => p.cat === selectedCat);
  }

  /* Nese nuk ka asnje produkt me kete filter, mos shfaq seksionin */
  if (products.length === 0) return null;

  return (
    <section className="bg-white px-4 py-7">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title={title} sub={sub} onMore={() => alert("Shiko te gjitha")} />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
