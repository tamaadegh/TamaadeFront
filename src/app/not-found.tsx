import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <p className="text-7xl font-black text-gray-200">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Page introuvable</h1>
      <p className="mt-2 text-[var(--muted)]">
        Cette page n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-md bg-[var(--ishtari-red)] px-6 py-2.5 text-sm font-bold text-white hover:bg-[var(--ishtari-red-dark)]"
      >
        Retour à l&apos;accueil
      </Link>
    </section>
  );
}
