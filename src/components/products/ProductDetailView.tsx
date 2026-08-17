"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  Minus,
  Package,
  RotateCcw,
  Truck,
} from "lucide-react";
import { AddToBasketDrawer } from "@/components/products/AddToBasketDrawer";
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
  const [activeTab, setActiveTab] = useState<"overview" | "reviews">("overview");
  const [wishlisted, setWishlisted] = useState(false);
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
          <Link href="/deals" className="hover:text-[var(--ishtari-blue)]">4th Anniversary</Link>
          <span className="mx-1.5">&gt;</span>
          <span className="text-gray-900">{product.name.slice(0, 40)}…</span>
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
                <div className="flex h-full items-center justify-center text-gray-400">No image</div>
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
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-base font-normal leading-snug text-gray-800 sm:text-lg">
                {product.name}
              </h1>
              <button
                type="button"
                onClick={() => setWishlisted((v) => !v)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white"
                aria-label="Add to wishlist"
              >
                <Heart
                  className={`h-4 w-4 ${wishlisted ? "fill-[var(--ishtari-red)] text-[var(--ishtari-red)]" : "text-gray-600"}`}
                />
              </button>
            </div>

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

            <ul className="mt-6 space-y-4 border-t border-gray-100 pt-5">
              <li className="flex gap-3">
                <Truck className="mt-0.5 h-5 w-5 shrink-0 text-[var(--ishtari-red)]" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Express Delivery</p>
                  <p className="text-xs text-gray-600">
                    Order now and get it delivered fast. Stock available in Ghana warehouses.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <RotateCcw className="mt-0.5 h-5 w-5 shrink-0 text-[var(--ishtari-red)]" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Return Eligible</p>
                  <Link href="/help" className="text-xs text-[var(--ishtari-blue)] hover:underline">
                    1–3 Days Return
                  </Link>
                </div>
              </li>
              <li className="flex gap-3">
                <Package className="mt-0.5 h-5 w-5 shrink-0 text-[var(--ishtari-red)]" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Trusted Shipping</p>
                  <p className="text-xs text-gray-600">Delivery within 5 business days nationwide.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 border-b border-gray-200">
          <div className="flex gap-8">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`border-b-2 pb-3 text-sm font-medium transition ${
                activeTab === "overview"
                  ? "border-[var(--ishtari-blue)] text-[var(--ishtari-blue)]"
                  : "border-transparent text-gray-700 hover:text-gray-900"
              }`}
            >
              Product Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`border-b-2 pb-3 text-sm font-medium transition ${
                activeTab === "reviews"
                  ? "border-[var(--ishtari-blue)] text-[var(--ishtari-blue)]"
                  : "border-transparent text-gray-700 hover:text-gray-900"
              }`}
            >
              Customer Reviews (0)
            </button>
          </div>
        </div>

        <div className="py-6">
          {activeTab === "overview" ? (
            <div className="max-w-3xl space-y-6 text-sm text-gray-800">
              <div>
                <h2 className="font-bold text-gray-900">Features:</h2>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {overview.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Specifications:</h2>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {overview.specifications.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Package Included:</h2>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {overview.packageIncluded.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No customer reviews yet. Be the first to review this product.</p>
          )}
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
