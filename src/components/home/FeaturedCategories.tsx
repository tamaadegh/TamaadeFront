import { CategoryCircles } from "@/components/home/CategoryCircles";
import type { ProductCategory } from "@/types";

/** Centered featured category row. Pass categories from `getCategories()`; renders nothing when empty. */
export function FeaturedCategories({ categories = [] }: { categories?: ProductCategory[] }) {
  return <CategoryCircles categories={categories} />;
}
