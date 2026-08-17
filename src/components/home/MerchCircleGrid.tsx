import Image from "next/image";
import Link from "next/link";
import type { MerchTile } from "@/types";

type MerchCircleGridProps = {
  tiles: MerchTile[];
  columns?: "dense" | "featured" | "bottom";
};

export function MerchCircleGrid({ tiles, columns = "dense" }: MerchCircleGridProps) {
  if (tiles.length === 0) return null;

  const gridClass =
    columns === "featured"
      ? "flex justify-center gap-4 overflow-x-auto pb-1 scrollbar-hide sm:gap-8 md:gap-10"
      : columns === "bottom"
        ? "grid grid-cols-3 gap-x-2 gap-y-5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9"
        : "grid grid-cols-4 gap-x-2 gap-y-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-9";

  return (
    <section className="mx-auto max-w-7xl bg-white px-3 py-4 md:px-4 md:py-5">
      <div className={gridClass}>
        {tiles.map((tile) => (
          <Link
            key={tile.id}
            href={tile.link || "/products"}
            className={`flex flex-col items-center gap-1.5 text-center ${
              columns === "featured" ? "w-20 shrink-0 sm:w-24" : "w-full"
            }`}
          >
            <div
              className={`relative flex h-[68px] w-[68px] items-center justify-center overflow-hidden rounded-full bg-white sm:h-[76px] sm:w-[76px] md:h-[84px] md:w-[84px] ${
                tile.highlight
                  ? "border-2 border-[var(--ishtari-red)]"
                  : "border border-[#ececec]"
              }`}
            >
              {tile.badge && !tile.image ? (
                <span className="px-1 text-center text-[10px] font-bold leading-tight text-[var(--ishtari-red)] sm:text-[11px]">
                  {tile.badge}
                </span>
              ) : tile.image ? (
                <Image
                  src={tile.image}
                  alt={tile.title}
                  fill
                  className="object-cover"
                  sizes="84px"
                />
              ) : (
                <span className="text-lg font-bold text-[var(--ishtari-red)]">
                  {tile.title.charAt(0)}
                </span>
              )}
              {tile.badge && tile.image ? (
                <span className="absolute left-0 top-0 rounded-br-md bg-[var(--ishtari-red)] px-1 py-px text-[9px] font-bold text-white">
                  {tile.badge}
                </span>
              ) : null}
            </div>
            <span className="line-clamp-2 max-w-[92px] text-[10px] leading-tight text-gray-900 sm:text-[11px]">
              {tile.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
