import Link from "next/link";
import type { PriceTier } from "@/types";

export function PriceTierBlocks({ tiers = [] }: { tiers?: PriceTier[] }) {
  if (tiers.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl bg-[#f5f5f5] px-4 pt-3 md:pt-4">
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 md:gap-3">
        {tiers.map((tier) => (
          <Link
            key={tier.id}
            href={`/products?maxPrice=${tier.amount}`}
            className="flex items-center justify-center rounded-md bg-[var(--ishtari-red)] py-3 text-center text-white transition hover:bg-[var(--ishtari-red-dark)] md:py-4"
          >
            <span className="text-[10px] font-semibold sm:text-sm">
              Only {tier.amount}
              <span className="ml-0.5">₵</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
