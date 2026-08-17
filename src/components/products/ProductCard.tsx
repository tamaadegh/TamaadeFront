"use client";

import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import {
  formatPrice,
  getProductDiscountMeta,
  getProductImageUrl,
} from "@/lib/utils/product";
import type { Product } from "@/types";

type ProductCardProps = {
  product: Product;
  variant?: "compact" | "grid";
};

export function ProductCard({ product, variant = "grid" }: ProductCardProps) {
  const imageUrl = getProductImageUrl(product);
  const { discountPercent, originalPrice, isNew, promoLabel, brand, isExpress } =
    getProductDiscountMeta(product);
  const outOfStock = product.quantity <= 0;

  const widthClass =
    variant === "compact" ? "w-[168px] shrink-0 sm:w-[180px] md:w-[196px]" : "w-full";

  return (
    <article
      className={`flex flex-col overflow-hidden bg-white ${widthClass}`}
    >
      <Link href={`/products/${product.slug || product.id}`} className="group flex flex-1 flex-col">
        <div className="relative aspect-[4/5] bg-[#f7f7f7]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-contain p-2 transition group-hover:scale-[1.02]"
              sizes={variant === "compact" ? "196px" : "(max-width:768px) 50vw, 25vw"}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[#f7f7f7] text-[10px] text-gray-300">
              {product.name}
            </div>
          )}
          {isNew && (
            <span className="absolute left-2 top-2 rounded px-1.5 py-0.5 text-[10px] font-semibold text-white bg-[#28a745]">
              New
            </span>
          )}
          {outOfStock && (
            <span className="absolute right-2 top-2 rounded bg-gray-800 px-1.5 py-0.5 text-[10px] text-white">
              Sold out
            </span>
          )}
        </div>

        {promoLabel && (
          <div className="promo-strip px-2 py-1 text-center text-[10px] font-bold tracking-wide text-[var(--ishtari-red)] sm:text-[11px]">
            {promoLabel}
          </div>
        )}

        <div className="flex flex-1 flex-col px-2.5 pb-2 pt-2">
          <p className="line-clamp-2 text-[11px] leading-snug text-gray-900 sm:text-xs">
            <span className="font-bold uppercase">{brand}</span>{" "}
            <span className="font-normal">{product.name}</span>
          </p>

          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className="text-base font-bold text-gray-900 sm:text-lg">
              {formatPrice(product.price).replace(".00", "")}
            </span>
            {discountPercent != null && (
              <span className="rounded border border-[var(--ishtari-red)] px-1 py-px text-[10px] font-semibold text-[var(--ishtari-red)]">
                -{discountPercent}%
              </span>
            )}
          </div>
          {originalPrice != null && (
            <p className="text-[11px] text-[#9b9b9b] line-through sm:text-xs">
              {formatPrice(originalPrice.toFixed(2)).replace(".00", "")}
            </p>
          )}
        </div>
      </Link>

      <div className="flex items-center justify-between px-2 py-2">
        {isExpress ? (
          <span className="express-badge inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium italic text-white sm:text-[11px]">
            <span className="inline-block h-2 w-2 rounded-sm bg-white/90" aria-hidden />
            express
          </span>
        ) : (
          <span />
        )}
        <AddToCartButton product={product} />
      </div>
    </article>
  );
}
