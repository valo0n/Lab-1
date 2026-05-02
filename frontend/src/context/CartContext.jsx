/* CartContext — menaxhon shporten globale per krejt aplikacionin */
import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  /* Lista e produkteve ne shporte */
  const [cartItems, setCartItems] = useState([]);

  /* Shto produkt ne shporte */
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        /* Nese ekziston, rrit sasine */
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      /* Nese nuk ekziston, shtoje me sasi 1 */
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  /* Hiq nje produkt nga shporta */
  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  /* Ndrysho sasine — nese 0 ose me pak, hiqe */
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  /* Pastro krejt shporten */
  const clearCart = () => setCartItems([]);

  /* Numri total i artikujve (per badge ne header) */
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  /* Shuma totale ne euro */
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* Hook per perdorimin e shportes ne cdo komponent */
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart duhet brenda CartProvider");
  return ctx;
};
