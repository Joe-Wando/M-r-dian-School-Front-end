import { createContext, useContext, useMemo, useState } from "react";

/**
 * Panier / session d'achat leger : cours et prestations d'accompagnement
 * en attente de paiement (Naboopay). La confirmation reste cote serveur.
 */
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const value = useMemo(() => {
    const add = (item) =>
      setItems((prev) =>
        prev.some((i) => i.type === item.type && i.id === item.id) ? prev : [...prev, item]
      );
    const remove = (type, id) =>
      setItems((prev) => prev.filter((i) => !(i.type === type && i.id === id)));
    const clear = () => setItems([]);
    const total = items.reduce((sum, i) => sum + (i.price || 0), 0);
    return { items, add, remove, clear, total, count: items.length };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit etre utilise dans <CartProvider>");
  return ctx;
}
