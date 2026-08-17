import type { Product } from "@/types";

export function getProductOverviewSections(product: Product) {
  return {
    features: [
      `${product.name} is built for everyday use with durable materials.`,
      "Safe and reliable design suitable for home use.",
      "Easy to assemble with included instructions.",
      product.desc,
    ],
    specifications: [
      `Category: ${product.category}`,
      `Seller: ${product.seller}`,
      `Stock available: ${product.quantity} unit(s)`,
      `SKU: TMD-${product.id.toString().padStart(4, "0")}`,
    ],
    packageIncluded: [
      "1 × Main product unit",
      "1 × User manual",
      "Standard accessories as shown",
    ],
  };
}

export function formatPriceDisplay(price: number, stripDecimals = false): string {
  if (stripDecimals && price % 1 === 0) {
    return `${Math.round(price)} GH₵`;
  }
  return `${price.toFixed(2)} GH₵`;
}
