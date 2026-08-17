import type { Product } from "@/types";
import { resolveMediaUrl } from "@/lib/utils/media";

export function formatPrice(price: string | number): string {
  const value = typeof price === "string" ? parseFloat(price) : price;
  if (Number.isNaN(value)) return `GH₵0.00`;
  return `GH₵${value.toFixed(2)}`;
}
export function formatPricePlain(price: string | number): string {
  const value = typeof price === "string" ? parseFloat(price) : price;
  if (Number.isNaN(value)) return "0";
  return value % 1 === 0 ? String(Math.round(value)) : value.toFixed(2);
}

export function getProductImageUrl(product: {
  images: { is_primary: boolean; url: string | null; order: number }[];
  image: string | null;
}): string | null {
  const images = product.images ?? [];
  const fromGallery =
    images.find((img) => img.is_primary)?.url ??
    images[0]?.url ??
    null;
  if (fromGallery) return resolveMediaUrl(fromGallery);
  return resolveMediaUrl(product.image);
}

export function getCategoryIconUrl(category: { icon: string | null }): string | null {
  return resolveMediaUrl(category.icon);
}

export function sortProductsByDate<T extends { created_at: string }>(products: T[]): T[] {
  return [...products].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export function filterProductsByMaxPrice<T extends { price: string }>(
  products: T[],
  maxPrice: number,
): T[] {
  return products.filter((p) => parseFloat(p.price) <= maxPrice);
}

/** Promo display values come from the API — never invented on the client. */
export function getProductDiscountMeta(product: Product) {
  const price = parseFloat(product.price);
  const originalPrice = product.compare_at_price
    ? parseFloat(product.compare_at_price)
    : null;
  const discountPercent =
    product.discount_percent ??
    (originalPrice && originalPrice > price
      ? Math.round((1 - price / originalPrice) * 100)
      : null);

  return {
    discountPercent,
    originalPrice:
      originalPrice && originalPrice > price ? originalPrice : null,
    isNew: Boolean(product.is_new),
    promoLabel: product.promo_label?.trim() || null,
    brand: (product.brand || product.category || "Tamaade").toUpperCase(),
    isExpress: Boolean(product.is_express),
    saleEndsAt: product.sale_ends_at || null,
  };
}

export function productsForSection(
  source: "newest" | "featured" | "bestsellers",
  products: Product[],
): Product[] {
  const newest = sortProductsByDate(products);
  if (source === "newest") return newest.slice(0, 12);
  if (source === "bestsellers") return [...products].reverse().slice(0, 12);
  return products.slice(0, 12);
}
