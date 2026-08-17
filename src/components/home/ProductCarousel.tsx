"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/types";

type ProductCarouselProps = {
  products: Product[];
};

export function ProductCarousel({ products }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scroll("left")}
        className="carousel-arrow absolute -left-1 top-1/2 z-10 hidden -translate-y-1/2 md:flex"
        aria-label="Previous products"
      >
        <ChevronLeft className="h-5 w-5 text-gray-600" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide sm:gap-3 md:px-1"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} variant="compact" />
        ))}
      </div>

      <button
        type="button"
        onClick={() => scroll("right")}
        className="carousel-arrow absolute -right-1 top-1/2 z-10 hidden -translate-y-1/2 md:flex"
        aria-label="Next products"
      >
        <ChevronRight className="h-5 w-5 text-gray-600" />
      </button>
    </div>
  );
}
