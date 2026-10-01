import { CategoryGrid } from "@/components/home/CategoryGrid";
import type { ProductCategory } from "@/types";

/** Bottom-of-page category grid. Pass categories from `getCategories()`; renders nothing when empty. */
export function BottomCategoryGrid({ categories = [] }: { categories?: ProductCategory[] }) {
  if (categories.length === 0) return null;
  return <CategoryGrid categories={categories} />;
}
