import { useState } from "react";
import Header from "./Header";
import Footer from "./sections/Footer";
import Hero from "./sections/Hero";
import { Ticker, CategoriesStrip } from "./sections/CategoriesStrip";
import ProductGrid from "./sections/ProductGrid";

function LandingPage() {
  /* Filtri i kategorise — "" = krejt, "Laptops" = vetem laptops, etj. */
  const [selectedCat, setSelectedCat] = useState("");

  return (
    <>
      <Header />
      <Hero />
      <Ticker />
      <CategoriesStrip selectedCat={selectedCat} onSelect={setSelectedCat} />

      {/* Grids me produkte — filtri kalon ne secilin */}
      <ProductGrid
        title="Trending Products"
        sub="Produktet me te shitura kete jave"
        filter="trending"
        selectedCat={selectedCat}
      />

      <ProductGrid
        title="🔥 Ofertat e Limituara"
        sub="Mos i humb keto cmime"
        filter="deal"
        selectedCat={selectedCat}
      />

      <Footer />
    </>
  );
}

export default LandingPage;
