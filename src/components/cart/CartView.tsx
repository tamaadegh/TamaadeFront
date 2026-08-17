"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { ProductSection } from "@/components/home/ProductSection";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { getApiErrorMessage, startHubtelCheckout } from "@/lib/api";
import { formatPrice, getProductImageUrl } from "@/lib/utils/product";
import type { Product } from "@/types";

type CartViewProps = {
  recommended: Product[];
  productMap: Record<number, Product>;
};

export function CartView({ recommended, productMap }: CartViewProps) {
  const { order, itemCount, loading, updateQuantity, removeItem } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [cartError, setCartError] = useState<string | null>(null);
  const items = order?.order_items ?? [];

  async function handleQuantityChange(itemId: number, quantity: number) {
    setCartError(null);
    try {
      await updateQuantity(itemId, quantity);
    } catch (err) {
      setCartError(getApiErrorMessage(err, "Could not update quantity."));
    }
  }

  async function handleRemoveItem(itemId: number) {
    setCartError(null);
    try {
      await removeItem(itemId);
    } catch (err) {
      setCartError(getApiErrorMessage(err, "Could not remove item."));
    }
  }

  async function handleCheckout() {
    if (!user) {
      router.push("/login");
      return;
    }
    setPayError(null);
    setPaying(true);
    try {
      const session = await startHubtelCheckout();
      if (session.checkout_url) {
        window.location.href = session.checkout_url;
        return;
      }
      setPayError("Hubtel did not return a checkout URL.");
    } catch (err) {
      setPayError(getApiErrorMessage(err, "Could not start Hubtel checkout."));
    } finally {
      setPaying(false);
    }
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-6 pb-24 md:pb-8">
      <h1 className="text-lg font-bold text-gray-900 md:text-xl">Shopping Basket</h1>

      {items.length === 0 ? (
        <div className="mt-6 rounded-lg bg-white py-12 text-center shadow-sm">
          <ShoppingBag className="mx-auto h-20 w-20 text-gray-200" />
          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            Your shopping basket is empty
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">What are you waiting for ?</p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-md bg-[var(--ishtari-red)] px-8 py-3 text-sm font-bold text-white hover:bg-[var(--ishtari-red-dark)]"
          >
            START SHOPPING
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((item) => {
            const product = productMap[item.product];
            const imageUrl = product ? getProductImageUrl(product) : null;
            return (
              <div
                key={item.id}
                className="flex gap-3 rounded-lg border border-[var(--border)] bg-white p-3 shadow-sm"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-gray-50">
                  {imageUrl ? (
                    <Image src={imageUrl} alt={product?.name ?? "Product"} fill className="object-contain p-1" />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col">
                  <Link
                    href={`/products/${item.product}`}
                    className="text-sm font-medium text-gray-900 hover:text-[var(--ishtari-red)]"
                  >
                    {product?.name ?? `Product #${item.product}`}
                  </Link>
                  <p className="mt-1 text-sm font-bold">{formatPrice(item.price)}</p>
                  <div className="mt-auto flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => void handleQuantityChange(item.id, item.quantity - 1)}
                      className="rounded border border-gray-300 p-1"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-[1.5rem] text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => void handleQuantityChange(item.id, item.quantity + 1)}
                      className="rounded border border-gray-300 p-1"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleRemoveItem(item.id)}
                      className="ml-auto text-gray-400 hover:text-[var(--ishtari-red)]"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {cartError && (
        <p className="mt-3 text-sm text-red-600">{cartError}</p>
      )}

      <div className="sticky top-0 z-20 mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">
              {itemCount} item{itemCount !== 1 ? "s" : ""}
            </p>
            {order && (
              <p className="text-xs text-[var(--muted)]">
                Total: {formatPrice(order.total_cost)}
              </p>
            )}
          </div>
          <button
            type="button"
            disabled={itemCount === 0 || loading || paying}
            onClick={() => void handleCheckout()}
            className="rounded-md bg-[var(--ishtari-red)] px-8 py-3 text-sm font-bold uppercase text-white hover:bg-[var(--ishtari-red-dark)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {paying ? "Redirecting…" : "Checkout"}
          </button>
        </div>
        {payError && (
          <p className="mt-3 text-sm text-red-600">{payError}</p>
        )}
      </div>

      {recommended.length > 0 && (
        <div className="mt-4">
          <ProductSection title="Recommended" products={recommended} viewAllHref="/products" />
        </div>
      )}
    </section>
  );
}
