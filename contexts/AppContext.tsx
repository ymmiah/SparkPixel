import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { db } from '../database/mockDatabase';
import { Product, User, Order, OrderItem } from '../types';

interface AppContextType {
  products: Product[];
  currentUser: User | null;
  orders: Order[];
  cart: OrderItem[];
  isLoading: boolean;
  login: (userId: string) => Promise<void>;
  logout: () => void;
  addToCart: (item: OrderItem) => void;
  removeFromCart: (index: number) => void;
  updateCartQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  placeOrder: () => Promise<Order | null>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch initial products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const fetchedProducts = await db.getProducts();
      setProducts(fetchedProducts);
      setIsLoading(false);
    };
    fetchProducts();
  }, []);
  
  const fetchUserOrders = useCallback(async (userId: string) => {
      setIsLoading(true);
      const userOrders = await db.getOrdersByUserId(userId);
      setOrders(userOrders);
      setIsLoading(false);
  }, []);

  const login = async (userId: string) => {
    setIsLoading(true);
    const user = await db.getUserById(userId);
    if (user) {
      setCurrentUser(user);
      await fetchUserOrders(user.id);
    } else {
        console.error("User not found");
    }
    setIsLoading(false);
  };

  const logout = () => {
    setCurrentUser(null);
    setOrders([]);
    setCart([]);
  };

  const addToCart = (item: OrderItem) => {
    setCart(prevCart => [...prevCart, item]);
  };

  const removeFromCart = (index: number) => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
  };

  const updateCartQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart(prevCart =>
      prevCart.map((item, i) => (i === index ? { ...item, quantity } : item))
    );
  };
  
  const clearCart = () => {
      setCart([]);
  }

  const placeOrder = async (): Promise<Order | null> => {
    if (!currentUser || cart.length === 0) {
      return null;
    }
    setIsLoading(true);
    const newOrder = await db.createOrder(currentUser.id, cart);
    clearCart();
    await fetchUserOrders(currentUser.id); // Refreshes order history
    setIsLoading(false);
    return newOrder;
  };

  const value = {
    products,
    currentUser,
    orders,
    cart,
    isLoading,
    login,
    logout,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    placeOrder,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
