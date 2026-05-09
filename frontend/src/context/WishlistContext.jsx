/* WishlistContext — menaxhon listen e produkteve favorite */
import { createContext, useContext, useState } from "react";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  /* Toggle — nese eshte aty, hiqe; nese jo, shtoje */
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  /* Kontrollon nese produkti eshte ne wishlist */
  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  /* Hiq nje produkt */
  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  /* Pastro krejt */
  const clearWishlist = () => setWishlist([]);

  /* Numri total per badge */
  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        clearWishlist,
        wishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist duhet brenda WishlistProvider");
  return ctx;
};
