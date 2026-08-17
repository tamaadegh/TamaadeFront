"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  addProductToCart,
  getPendingOrder,
  removeOrderItem,
  updateOrderItem,
} from "@/lib/api/orders";
import { useAuth } from "@/contexts/AuthContext";
import type { Order } from "@/types";

type CartContextValue = {
  order: Order | null;
  itemCount: number;
  loading: boolean;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    try {
      const pending = await getPendingOrder();
      setOrder(pending);
    } catch {
      setOrder(null);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setOrder(null);
      return;
    }
    void refreshCart();
  }, [user, authLoading, refreshCart]);

  const addToCart = useCallback(
    async (productId: number, quantity = 1) => {
      setLoading(true);
      try {
        const updated = await addProductToCart(productId, quantity);
        setOrder(updated);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const updateQuantity = useCallback(
    async (itemId: number, quantity: number) => {
      if (!order) return;
      setLoading(true);
      try {
        if (quantity <= 0) {
          await removeOrderItem(order.id, itemId);
        } else {
          await updateOrderItem(order.id, itemId, quantity);
        }
        await refreshCart();
      } finally {
        setLoading(false);
      }
    },
    [order, refreshCart],
  );

  const removeItem = useCallback(
    async (itemId: number) => {
      if (!order) return;
      setLoading(true);
      try {
        await removeOrderItem(order.id, itemId);
        await refreshCart();
      } finally {
        setLoading(false);
      }
    },
    [order, refreshCart],
  );

  // Distinct order lines, not sum of quantities: one product with qty 2 is 1 item.
  const itemCount = useMemo(
    () => order?.order_items.length ?? 0,
    [order],
  );

  const value = useMemo(
    () => ({
      order,
      itemCount,
      loading,
      addToCart,
      updateQuantity,
      removeItem,
      refreshCart,
    }),
    [order, itemCount, loading, addToCart, updateQuantity, removeItem, refreshCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
