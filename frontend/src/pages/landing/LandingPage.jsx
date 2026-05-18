import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./sections/Footer";
import Hero from "./sections/Hero";
import { Ticker, CategoriesStrip } from "./sections/CategoriesStrip";
import ProductGrid from "./sections/ProductGrid";

function LandingPage() {
  const [selectedCat, setSelectedCat] = useState(null);

  return (
    <>
      <Header />
      <Hero />
      <Ticker />
      <CategoriesStrip selectedCat={selectedCat} onSelect={setSelectedCat} />

      <ProductGrid
        title="Trending Products"
        sub="Produktet me te shitura kete jave"
        categoryFilter={selectedCat}
        limit={8}
      />

      <ProductGrid
        title="🔥 Ofertat e Limituara"
        sub="Mos i humb keto cmime"
        categoryFilter={selectedCat}
        limit={4}
      />

      <Footer />
    </>
  );
}

export default LandingPage;
