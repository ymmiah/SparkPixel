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
    // For simplicity, we'll just add the new item. A real cart would handle merging quantities.
    setCart(prevCart => [...prevCart, item]);
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
