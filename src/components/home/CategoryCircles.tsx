import Image from "next/image";
import Link from "next/link";
import { mainCategoryCircles } from "@/config/site";

export function CategoryCircles() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-4">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide md:gap-4">
        {mainCategoryCircles.map((cat, index) => (
          <Link
            key={cat.label}
            href={cat.href}
            className="flex w-[72px] shrink-0 flex-col items-center gap-1.5 text-center md:w-24"
          >
            <div
              className={`relative flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full border bg-[#efefef] shadow-sm transition hover:shadow-md md:h-20 md:w-20 ${
                "highlight" in cat && cat.highlight
                  ? "border-[var(--ishtari-red)]"
                  : "border-gray-200"
              }`}
            >
              {"badge" in cat && cat.badge ? (
                <span className="px-1 text-center text-[9px] font-bold leading-tight text-[var(--ishtari-red)] md:text-[10px]">
                  {cat.badge}
                </span>
              ) : (
                <Image
                  src={`https://picsum.photos/seed/cat-${index}/160/160`}
                  alt={cat.label}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              )}
            </div>
            <span className="line-clamp-2 text-[10px] font-medium text-gray-900 md:text-xs">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
