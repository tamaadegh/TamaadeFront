import type { Product } from "@/types";

/** Product detail content built only from real API fields (nothing invented). */
export function getProductOverviewSections(product: Product) {
  const specifications = [
    product.brand ? `Brand: ${product.brand}` : null,
    product.category ? `Category: ${product.category}` : null,
    product.seller ? `Seller: ${product.seller}` : null,
    product.quantity > 0 ? `In stock: ${product.quantity} unit(s)` : "Out of stock",
  ].filter((line): line is string => Boolean(line));

  return {
    description: product.desc?.trim() || null,
    specifications,
  };
}

export function formatPriceDisplay(price: number, stripDecimals = false): string {
  if (stripDecimals && price % 1 === 0) {
    return `${Math.round(price)} GH₵`;
  }
  return `${price.toFixed(2)} GH₵`;
}
