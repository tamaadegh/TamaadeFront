import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";
import { getProducts } from "@/lib/api";
import type { Product } from "@/types";

export const metadata: Metadata = {
  title: "Shopping Basket",
};

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const data = await getProducts();
  const recommended = data.results.slice(0, 8);
  const productMap = data.results.reduce<Record<number, Product>>((acc, product) => {
    acc[product.id] = product;
    return acc;
  }, {});

  return <CartView recommended={recommended} productMap={productMap} />;
}
