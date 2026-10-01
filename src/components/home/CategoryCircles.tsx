import Image from "next/image";
import Link from "next/link";
import { BrandPlaceholder } from "@/components/layout/BrandPlaceholder";
import { getCategoryIconUrl } from "@/lib/utils/product";
import type { ProductCategory } from "@/types";

/** Horizontal row of category circles. Pass categories from `getCategories()`; renders nothing when empty. */
export function CategoryCircles({ categories = [] }: { categories?: ProductCategory[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-4">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide md:gap-4">
        {categories.map((cat) => {
          const icon = getCategoryIconUrl(cat);
          return (
            <Link
              key={cat.id}
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              className="flex w-[72px] shrink-0 flex-col items-center gap-1.5 text-center md:w-24"
            >
              <div className="relative h-[72px] w-[72px] overflow-hidden rounded-full border border-gray-200 bg-[#efefef] shadow-sm transition hover:shadow-md md:h-20 md:w-20">
                {icon ? (
                  <Image src={icon} alt={cat.name} fill className="object-cover" sizes="80px" />
                ) : (
                  <BrandPlaceholder alt={cat.name} sizes="80px" />
                )}
              </div>
              <span className="line-clamp-2 text-[10px] font-medium text-gray-900 md:text-xs">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
