import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import { getCategories, getProducts } from "@/lib/api";
import {
  filterProductsByMaxPrice,
  sortProductsByDate,
} from "@/lib/utils/product";
import type { Product } from "@/types";

export const metadata: Metadata = {
  title: "Products",
};

export const dynamic = "force-dynamic";

type ProductsPageProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    maxPrice?: string;
    ordering?: string;
    filter?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  let products: Product[] = [];
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  const [data, cats] = await Promise.all([
    getProducts({ search: params.search }),
    getCategories(),
  ]);
  products = data.results;
  categories = cats;

  if (params.search) {
    const q = params.search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }

  if (params.category) {
    const cat = decodeURIComponent(params.category).toLowerCase();
    products = products.filter((p) =>
      p.category.toLowerCase().includes(cat) ||
      cat.includes(p.category.toLowerCase()),
    );
  }

  if (params.maxPrice) {
    products = filterProductsByMaxPrice(products, Number(params.maxPrice));
  }

  if (params.ordering === "-created_at" || params.filter === "back-to-stock") {
    products = sortProductsByDate(products);
  }

  if (params.filter === "top-selling" || params.filter === "top-picks") {
    products = [...products].reverse();
  }

  const pageTitle = params.category
    ? decodeURIComponent(params.category)
    : params.search
      ? `Search: ${params.search}`
      : params.maxPrice
        ? `Under ${params.maxPrice}¢`
        : "Products";

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 pb-24 md:pb-8">
      <h1 className="text-xl font-bold text-gray-900 md:text-2xl">{pageTitle}</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        {products.length} item{products.length !== 1 ? "s" : ""} found
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/products"
          className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:border-[var(--ishtari-red)]"
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${encodeURIComponent(cat.name)}`}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              params.category === cat.name
                ? "border-[var(--ishtari-red)] bg-[var(--ishtari-red)] text-white"
                : "border-gray-300 bg-white text-gray-700 hover:border-[var(--ishtari-red)]"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-gray-300 bg-white py-16 text-center text-[var(--muted)]">
          No products match your search.
          <Link href="/" className="mt-4 block text-[var(--ishtari-red)] hover:underline">
            START SHOPPING
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
