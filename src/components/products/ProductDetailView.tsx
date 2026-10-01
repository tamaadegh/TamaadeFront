"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus } from "lucide-react";
import { AddToBasketDrawer } from "@/components/products/AddToBasketDrawer";
import { BrandPlaceholder } from "@/components/layout/BrandPlaceholder";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { SaleCountdown } from "@/components/products/SaleCountdown";
import {
  formatPriceDisplay,
  getProductOverviewSections,
} from "@/lib/utils/productDetail";
import { getProductDiscountMeta } from "@/lib/utils/product";
import { getApiErrorMessage } from "@/lib/api/client";
import type { Product } from "@/types";

type ProductDetailViewProps = {
  product: Product;
  relatedProducts: Product[];
};

export function ProductDetailView({ product, relatedProducts }: ProductDetailViewProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const gallery = product.images.filter((img) => img.url);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);

  const { discountPercent, originalPrice, promoLabel, saleEndsAt } = getProductDiscountMeta(product);
  const currentPrice = parseFloat(product.price);
  const selectedImage = gallery[selectedIndex]?.url ?? product.image;
  const overview = getProductOverviewSections(product);
  const outOfStock = product.quantity <= 0;

  return (
    <>
      <section className="mx-auto max-w-7xl bg-white px-4 py-4 pb-24 md:pb-8">
        {/* Breadcrumbs */}
        <nav className="mb-4 text-xs text-gray-600 sm:text-sm">
          <Link href="/" className="hover:text-[var(--ishtari-blue)]">Home</Link>
          <span className="mx-1.5">&gt;</span>
          {product.category ? (
            <>
              <Link
                href={`/products?category=${encodeURIComponent(product.category)}`}
                className="hover:text-[var(--ishtari-blue)]"
              >
                {product.category}
              </Link>
              <span className="mx-1.5">&gt;</span>
            </>
          ) : null}
          <span className="text-gray-900">
            {product.name.length > 40 ? `${product.name.slice(0, 40)}…` : product.name}
          </span>
        </nav>

        {/* Main product grid — thumbnails | image | info */}
        <div className="grid gap-6 lg:grid-cols-[72px_1fr_1fr] lg:gap-8">
          {/* Thumbnails — vertical on desktop */}
          <div className="order-2 flex gap-2 overflow-x-auto lg:order-1 lg:flex-col lg:overflow-visible">
            {gallery.map((img, i) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setSelectedIndex(i)}
                className={`relative h-14 w-14 shrink-0 overflow-hidden rounded border-2 bg-gray-50 lg:h-16 lg:w-16 ${
                  i === selectedIndex ? "border-[var(--ishtari-blue)]" : "border-gray-200"
                }`}
              >
                {img.url && (
                  <Image src={img.url} alt="" fill className="object-cover" sizes="64px" />
                )}
              </button>
            ))}
          </div>

          {/* Main image */}
          <div className="order-1 lg:order-2">
            <div className="relative aspect-square max-h-[480px] w-full bg-[#fafafa]">
              {selectedImage ? (
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                  priority
                  sizes="(max-width:1024px) 100vw, 480px"
                />
              ) : (
                <BrandPlaceholder alt={product.name} sizes="(max-width:1024px) 100vw, 480px" />
              )}
            </div>
            {promoLabel && (
              <div className="promo-strip mt-0 py-2 text-center text-xs font-bold text-[var(--ishtari-red)] sm:text-sm">
                {promoLabel}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="order-3">
            <h1 className="text-base font-normal leading-snug text-gray-800 sm:text-lg">
              {product.name}
            </h1>

            <div className="mt-4">
              {originalPrice != null && (
                <p className="text-sm text-gray-400 line-through">
                  {formatPriceDisplay(originalPrice)}
                </p>
              )}
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="text-2xl font-bold text-[var(--ishtari-red)] sm:text-3xl">
                  {formatPriceDisplay(currentPrice, true)}
                </span>
                {discountPercent != null && (
                  <span className="rounded bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
                    Save {discountPercent}%
                  </span>
                )}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded border border-gray-300 bg-[#f5f5f5]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-gray-700 hover:bg-gray-200"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-[2rem] text-center text-sm font-medium">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.quantity, q + 1))}
                  className="px-3 py-2 text-gray-700 hover:bg-gray-200"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                disabled={outOfStock}
                onClick={() => {
                  if (!user) {
                    router.push("/login");
                    return;
                  }
                  setCartError(null);
                  void addToCart(product.id, quantity)
                    .then(() => setDrawerOpen(true))
                    .catch((err) => {
                      setCartError(getApiErrorMessage(err, "Could not add to basket."));
                    });
                }}
                className="min-w-[180px] flex-1 rounded-md bg-[var(--ishtari-blue)] px-6 py-3 text-sm font-bold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
              >
                Add to Basket
              </button>
            </div>
            {cartError ? (
              <p className="mt-2 text-sm text-red-600">{cartError}</p>
            ) : null}

            <SaleCountdown endsAt={saleEndsAt} />
          </div>
        </div>

        {/* Product details — only real API data */}
        <div className="mt-8 border-t border-gray-200 py-6">
          <h2 className="text-sm font-bold text-gray-900">Product Details</h2>
          <div className="mt-3 max-w-3xl space-y-4 text-sm text-gray-800">
            {overview.description ? (
              <p className="whitespace-pre-line">{overview.description}</p>
            ) : null}
            {overview.specifications.length > 0 ? (
              <ul className="list-disc space-y-1 pl-5">
                {overview.specifications.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </section>

      <AddToBasketDrawer
        open={drawerOpen}
        product={product}
        related={relatedProducts}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
}
