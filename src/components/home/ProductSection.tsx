import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import type { Product } from "@/types";

type ProductSectionProps = {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  ctaLabel?: string;
};

export function ProductSection({
  title,
  subtitle,
  products,
  viewAllHref = "/products",
  ctaLabel = "View More",
}: ProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl pt-4 md:px-4">
      <div className="flex items-center justify-between bg-[var(--ishtari-yellow)] px-4 py-2.5">
        <div>
          <h2 className="text-base font-bold text-gray-900 md:text-lg">{title}</h2>
          {subtitle ? (
            <p className="text-[11px] text-gray-800 md:text-xs">{subtitle}</p>
          ) : null}
        </div>
        <Link
          href={viewAllHref}
          className="flex shrink-0 items-center gap-0.5 text-xs font-medium text-gray-800 hover:opacity-80 md:text-sm"
        >
          {ctaLabel}
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="bg-white px-3 py-3 md:px-0">
        <ProductCarousel products={products} />
      </div>
    </section>
  );
}
