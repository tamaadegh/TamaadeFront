import Link from "next/link";
import type { StorefrontPromo } from "@/types";

/** Promo banner driven by an API `StorefrontPromo`; renders nothing without one. */
export function PromoBanner({ promo }: { promo?: StorefrontPromo | null }) {
  if (!promo) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-8">
      <Link
        href={promo.link || "/deals"}
        className="block overflow-hidden rounded-lg bg-gradient-to-r from-[var(--ishtari-yellow)] via-yellow-300 to-[var(--ishtari-yellow)] p-6 transition hover:shadow-md md:p-10"
      >
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-black text-[var(--ishtari-red)] md:text-4xl">{promo.title}</h2>
            {promo.subtitle ? (
              <p className="mt-1 text-sm font-medium text-gray-800 md:text-base">{promo.subtitle}</p>
            ) : null}
          </div>
          <span className="rounded-full bg-[var(--ishtari-red)] px-6 py-2.5 text-sm font-bold text-white shadow">
            {promo.cta_label || "SHOP NOW"}
          </span>
        </div>
      </Link>
    </section>
  );
}
