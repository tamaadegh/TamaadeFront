import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCategories } from "@/lib/api";

type CategoryPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const categories = await getCategories();
    const cat = categories.find((c) => String(c.id) === id);
    return { title: cat?.name ?? "Category" };
  } catch {
    return { title: "Category" };
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;

  let categoryName: string | null = null;
  try {
    const categories = await getCategories();
    categoryName = categories.find((c) => String(c.id) === id)?.name ?? null;
  } catch {
    categoryName = null;
  }

  // redirect() throws, so it must stay outside the try/catch above.
  redirect(
    categoryName
      ? `/products?category=${encodeURIComponent(categoryName)}`
      : "/allcategories",
  );
}
