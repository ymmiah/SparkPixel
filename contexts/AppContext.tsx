import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { db, users } from '../database/mockDatabase';
import { Product, User, Order, OrderItem, DesignTemplate } from '../types';

interface AppContextType {
  products: Product[];
  currentUser: User | null;
  orders: Order[];
  cart: OrderItem[];
  isLoading: boolean;
  toastMessage: string | null;
  activeTemplateToLoad: DesignTemplate | null;
  setActiveTemplateToLoad: (template: DesignTemplate | null) => void;
  showToast: (msg: string) => void;
  login: (userId: string) => Promise<void>;
  logout: () => void;
  addToCart: (item: OrderItem) => void;
  removeFromCart: (index: number) => void;
  updateCartQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (shippingMethod?: 'Standard' | 'Express Rush') => Promise<Order | null>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(users[0]); // Default to mock user for easy preview
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTemplateToLoad, setActiveTemplateToLoad] = useState<DesignTemplate | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  }, []);

  const fetchUserOrders = useCallback(async (userId: string) => {
    const userOrders = await db.getOrdersByUserId(userId);
    setOrders(userOrders);
  }, []);

  // Fetch initial products and orders
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      const fetchedProducts = await db.getProducts();
      setProducts(fetchedProducts);
      if (currentUser) {
        await fetchUserOrders(currentUser.id);
      }
      setIsLoading(false);
    };
    fetchInitialData();
  }, [fetchUserOrders]);

  const login = async (userId: string) => {
    setIsLoading(true);
    const user = await db.getUserById(userId);
    if (user) {
      setCurrentUser(user);
      await fetchUserOrders(user.id);
      showToast(`Welcome back, ${user.name}!`);
    } else {
      console.error("User not found");
    }
    setIsLoading(false);
  };

  const logout = () => {
    setCurrentUser(null);
    setOrders([]);
    setCart([]);
    showToast("Signed out successfully");
  };

  const addToCart = (item: OrderItem) => {
    setCart(prevCart => [...prevCart, item]);
    showToast(`Added ${item.quantity} × ${item.product.name} to cart!`);
  };

  const removeFromCart = (index: number) => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
    showToast("Item removed from cart");
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
  };

  const placeOrder = async (shippingMethod: 'Standard' | 'Express Rush' = 'Standard'): Promise<Order | null> => {
    if (!currentUser || cart.length === 0) {
      return null;
    }
    setIsLoading(true);
    const newOrder = await db.createOrder(currentUser.id, cart, shippingMethod);
    clearCart();
    await fetchUserOrders(currentUser.id);
    setIsLoading(false);
    showToast(`Order #${newOrder.id} placed successfully!`);
    return newOrder;
  };

  const value = {
    products,
    currentUser,
    orders,
    cart,
    isLoading,
    toastMessage,
    activeTemplateToLoad,
    setActiveTemplateToLoad,
    showToast,
    login,
    logout,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    placeOrder,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-800 text-sm font-semibold flex items-center gap-3 animate-bounce">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          {toastMessage}
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
