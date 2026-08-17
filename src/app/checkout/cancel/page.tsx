import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <section className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-gray-900">Checkout cancelled</h1>
      <p className="mt-3 text-sm text-[var(--muted)]">
        Your basket is still saved. You can try Hubtel checkout again whenever you are ready.
      </p>
      <Link
        href="/cart"
        className="mt-6 inline-block rounded-md bg-[var(--ishtari-red)] px-6 py-3 text-sm font-bold text-white"
      >
        Back to basket
      </Link>
    </section>
  );
}
