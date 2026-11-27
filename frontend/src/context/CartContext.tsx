
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
  special_instructions: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (
    item: Omit<CartItem, "quantity" | "special_instructions">
  ) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  updateInstructions: (id: number, instructions: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (
    item: Omit<CartItem, "quantity" | "special_instructions">
  ) => {
    setItems((current) => {
      const existing = current.find((cartItem) => cartItem.id === item.id);

      if (existing) {
        return current.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [
        ...current,
        { ...item, quantity: 1, special_instructions: "" },
      ];
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      setItems((current) => current.filter((item) => item.id !== id));
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const updateInstructions = (id: number, instructions: string) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, special_instructions: instructions }
          : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        updateInstructions,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
