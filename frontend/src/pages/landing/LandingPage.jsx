import React from "react";
import { useState } from "react";
import Header from "./Header";
import Footer from "./sections/Footer";
import Hero from "./sections/Hero";
import { Ticker, CategoriesStrip } from "./sections/CategoriesStrip";

const LandingPage = ({ onNavigate }) => {
  /* Filtri i kategorisë — "" = shfaq të gjitha, "Laptops" = vetëm laptopë, etj. */
  const [selectedCat, setSelectedCat] = useState("");

  return (
    <>
      <Header />

      <Hero />
      <Ticker />

      {/* CategoriesStrip vendos filtrin — të gjitha grids poshtë e marrin */}
      <CategoriesStrip selectedCat={selectedCat} onSelect={setSelectedCat} />

      <Footer />
    </>
  );
};

export default LandingPage;
