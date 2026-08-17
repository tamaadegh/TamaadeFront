"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { getApiErrorMessage } from "@/lib/api/client";
import type { Product } from "@/types";

type AddToCartButtonProps = {
  product: Product;
  className?: string;
  quantity?: number;
};

export function AddToCartButton({
  product,
  className = "flex h-8 w-8 items-center justify-center rounded-md border border-[#ddd] bg-white text-gray-800 transition hover:border-gray-400 hover:bg-gray-50",
  quantity = 1,
}: AddToCartButtonProps) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push("/login");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await addToCart(product.id, quantity);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not add to basket."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => void handleClick(e)}
        disabled={busy}
        className={className}
        aria-label="Add to basket"
        title={error ?? "Add to basket"}
      >
        <ShoppingCart className="h-4 w-4" />
      </button>
      {error ? (
        <p className="absolute right-0 top-full z-10 mt-1 w-40 rounded bg-red-50 px-2 py-1 text-[10px] text-red-700 shadow">
          {error}
        </p>
      ) : null}
    </div>
  );
}
