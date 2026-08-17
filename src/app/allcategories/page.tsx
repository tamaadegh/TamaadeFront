import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getCategories, getMerchTiles } from "@/lib/api";
import { MerchCircleGrid } from "@/components/home/MerchCircleGrid";
import { getCategoryIconUrl } from "@/lib/utils/product";

export const metadata: Metadata = {
  title: "All Categories",
};

export const dynamic = "force-dynamic";

export default async function AllCategoriesPage() {
  const [categories, merchTiles] = await Promise.all([
    getCategories(),
    getMerchTiles(),
  ]);
  const tiles = merchTiles.length > 0 ? merchTiles : [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 pb-24 md:pb-8">
      <h1 className="text-xl font-bold text-gray-900 md:text-2xl">All Categories</h1>

      {tiles.length > 0 ? (
        <div className="mt-4">
          <MerchCircleGrid tiles={tiles} columns="bottom" />
        </div>
      ) : categories.length === 0 ? (
        <p className="mt-8 text-sm text-[var(--muted)]">
          No categories from TamaadeAPI yet.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {categories.map((cat) => {
            const icon = getCategoryIconUrl(cat);
            return (
              <Link
                key={cat.id}
                href={`/products?category=${encodeURIComponent(cat.name)}`}
                className="flex flex-col items-center gap-2 text-center"
              >
                <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-white shadow-sm md:h-20 md:w-20">
                  {icon ? (
                    <Image src={icon} alt={cat.name} fill className="object-cover p-2" sizes="80px" />
                  ) : (
                    <span className="text-lg font-bold text-[var(--ishtari-red)]">
                      {cat.name.charAt(0)}
                    </span>
                  )}
                </div>
                <span className="line-clamp-2 text-xs font-medium text-gray-800">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
