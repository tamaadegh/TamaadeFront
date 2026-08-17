import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { StorefrontPromo } from "@/types";

export function TopPromoStrip({ promo }: { promo: StorefrontPromo }) {
  return (
    <div className="border-b border-[#ececec] bg-[#f3f3f3]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5">
        <p className="text-xs text-gray-900 sm:text-sm">
          {promo.title}{" "}
          {promo.highlight ? <strong className="font-bold">{promo.highlight}</strong> : null}
        </p>
        <Link
          href={promo.link || "/deals"}
          className="flex shrink-0 items-center gap-0.5 text-xs font-medium text-gray-900 hover:text-[var(--ishtari-red)] sm:text-sm"
        >
          {promo.cta_label || "shop now"}
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
