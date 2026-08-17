import Link from "next/link";

export function PromoBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-8">
      <Link
        href="/deals"
        className="block overflow-hidden rounded-lg bg-gradient-to-r from-[var(--ishtari-yellow)] via-yellow-300 to-[var(--ishtari-yellow)] p-6 transition hover:shadow-md md:p-10"
      >
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-black text-[var(--ishtari-red)] md:text-4xl">
              Cheers To 4 Years!
            </h2>
            <p className="mt-1 text-sm font-medium text-gray-800 md:text-base">
              Celebrate 4 Years of Savings!
            </p>
          </div>
          <span className="rounded-full bg-[var(--ishtari-red)] px-6 py-2.5 text-sm font-bold text-white shadow">
            SHOP NOW
          </span>
        </div>
      </Link>
    </section>
  );
}
