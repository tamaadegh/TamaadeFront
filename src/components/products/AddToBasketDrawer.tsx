"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, X } from "lucide-react";
import { formatPriceDisplay } from "@/lib/utils/productDetail";
import { getProductDiscountMeta, getProductImageUrl } from "@/lib/utils/product";
import type { Product } from "@/types";

type AddToBasketDrawerProps = {
  open: boolean;
  product: Product;
  related: Product[];
  onClose: () => void;
};

export function AddToBasketDrawer({
  open,
  product,
  related,
  onClose,
}: AddToBasketDrawerProps) {
  if (!open) return null;

  const imageUrl = getProductImageUrl(product);

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[60] bg-black/40"
        onClick={onClose}
        aria-label="Close drawer"
      />
      <aside className="fixed bottom-0 right-0 top-0 z-[70] flex w-full max-w-sm flex-col bg-white shadow-2xl sm:max-w-md">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <span className="text-sm font-semibold text-gray-900">Basket</span>
          <button type="button" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="flex gap-3 border-b border-gray-100 pb-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded border border-gray-200 bg-gray-50">
              {imageUrl && (
                <Image src={imageUrl} alt={product.name} fill className="object-contain p-1" sizes="64px" />
              )}
            </div>
            <div>
              <p className="line-clamp-2 text-xs text-gray-800">{product.name}</p>
              <p className="mt-1 text-sm font-bold text-green-600">Added To Basket</p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Link
              href="/cart"
              className="block w-full rounded-md bg-[var(--ishtari-blue)] py-3 text-center text-sm font-bold text-white hover:opacity-95"
            >
              CHECKOUT
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-md border-2 border-[var(--ishtari-blue)] py-3 text-sm font-bold text-[var(--ishtari-blue)] hover:bg-blue-50"
            >
              CONTINUE SHOPPING
            </button>
          </div>

          {related.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-bold text-gray-900">Frequently Bought With</h3>
              <ul className="mt-3 space-y-3">
                {related.map((item) => {
                  const img = getProductImageUrl(item);
                  const { originalPrice } = getProductDiscountMeta(item);
                  const price = parseFloat(item.price);
                  return (
                    <li key={item.id} className="flex gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded border border-gray-200 bg-gray-50">
                        {img && (
                          <Image src={img} alt={item.name} fill className="object-contain p-1" sizes="56px" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link href={`/products/${item.id}`} className="line-clamp-2 text-xs text-gray-800 hover:text-[var(--ishtari-blue)]">
                          {item.name}
                        </Link>
                        {originalPrice != null && (
                          <p className="text-[10px] text-gray-400 line-through">
                            {formatPriceDisplay(originalPrice)}
                          </p>
                        )}
                        <p className="text-sm font-bold text-gray-900">
                          {formatPriceDisplay(price, true)}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-gray-300 bg-white"
                        aria-label="Add to basket"
                      >
                        <ShoppingCart className="h-4 w-4 text-gray-700" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
