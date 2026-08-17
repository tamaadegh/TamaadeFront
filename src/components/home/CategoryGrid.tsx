import Image from "next/image";
import Link from "next/link";
import { getCategoryIconUrl } from "@/lib/utils/product";
import type { ProductCategory } from "@/types";

type CategoryGridProps = {
  categories: ProductCategory[];
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) {
    return (
      <section className="mx-auto max-w-7xl bg-[#f5f5f5] px-3 py-8 text-center md:px-4">
        <p className="text-sm text-[var(--muted)]">No categories yet. Add some in TamaadeAPI admin.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl bg-[#f5f5f5] px-3 py-4 md:px-4 md:py-5">
      <div className="grid grid-cols-3 gap-x-2 gap-y-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9">
        {categories.map((cat) => {
          const icon = getCategoryIconUrl(cat);
          return (
            <Link
              key={cat.id}
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              className="flex flex-col items-center gap-1.5 text-center"
            >
              <div className="relative flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full bg-[#ebebeb] sm:h-[76px] sm:w-[76px] md:h-[80px] md:w-[80px]">
                {icon ? (
                  <Image src={icon} alt={cat.name} fill className="object-cover" sizes="80px" />
                ) : (
                  <span className="text-lg font-bold text-[var(--ishtari-red)]">
                    {cat.name.charAt(0)}
                  </span>
                )}
              </div>
              <span className="line-clamp-2 max-w-[88px] text-[10px] font-normal leading-tight text-gray-900 sm:text-[11px]">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
