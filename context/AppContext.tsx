import { CartItem, SavedItem, Payment, User } from '@/types/types';
import React, { createContext, useContext, useEffect, useState } from 'react';


type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  clearCart: () => void;
  savedItems: SavedItem[];
  addToSavedItems: (item: SavedItem) => void;
  removeFromSavedItems: (id: number) => void;
  clearSavedItems: () => void;
  totalPayment: Payment;
  setCurrentUser: (user: User) => void;
  currentUser: User;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [totalPayment, setTotalPayment] = useState<Payment>(
    {
      subtotal: 0,
      deliveryFee: 3.99,
      tax: 6.64,
      total: 0
    });
  const [currentUser, setCurrentUser] = useState<User>({
    id: 0,
    full_name: '',
    email: '',
    password: '',
    avatar_url: '',
    phone: '',
  })
  console.log(currentUser);

  const addToCart = (item: CartItem) => {
    const found = cart.find((x) => x.id === item.id);
    if (found) {
      increaseQuantity(item.id);
    } else {
      setCart((prev) => [...prev, item]);
    }
  };

  const increaseQuantity = (id: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id: number) => {
    const found = cart.find((item) => item.id === id);
    if (found) {
      if (found.quantity > 1) {
        setCart((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item
          )
        );
      } else {
        removeFromCart(id);
      }
    }
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const addToSavedItems = (item: SavedItem) => {
    const found = savedItems.find((x) => x.id === item.id);
    if (!found) {
      setSavedItems((prev) => [...prev, item]);
    }
  };

  const removeFromSavedItems = (id: number) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== id));
  };
  const clearSavedItems = () => {
    setSavedItems([]);
  };

  useEffect(() => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 3.99;
    const tax = subtotal * 0.08;
    const total = subtotal + deliveryFee + tax;

    setTotalPayment({
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      tax: tax,
      total: total
    })
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, decreaseQuantity, increaseQuantity, savedItems, addToSavedItems, removeFromSavedItems, clearSavedItems, totalPayment, currentUser, setCurrentUser }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};