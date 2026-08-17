import Link from "next/link";
import { bottomCategoryGrid } from "@/config/site";

export function BottomCategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-8">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9">
        {bottomCategoryGrid.map((cat) => (
          <Link
            key={cat.label}
            href={cat.href}
            className="flex flex-col items-center gap-2 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition hover:border-[var(--ishtari-red)] hover:shadow md:h-20 md:w-20">
              <span className="text-lg font-bold text-[var(--ishtari-red)]">
                {cat.label.charAt(0)}
              </span>
            </div>
            <span className="line-clamp-2 text-[10px] font-medium text-gray-800 md:text-xs">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
