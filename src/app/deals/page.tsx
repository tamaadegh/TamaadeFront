import type { Metadata } from "next";
import Link from "next/link";
import { ProductSection } from "@/components/home/ProductSection";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { PriceTierBlocks } from "@/components/home/PriceTierBlocks";
import { findPromo, getBanners, getHomeSections, getPriceTiers, getProducts, getPromos } from "@/lib/api";
import { productsForSection } from "@/lib/utils/product";

export const metadata: Metadata = {
  title: "Deals & Promotions",
};

export const dynamic = "force-dynamic";

export default async function DealsPage() {
  const [data, banners, priceTiers, promos, sections] = await Promise.all([
    getProducts(),
    getBanners(),
    getPriceTiers(),
    getPromos(),
    getHomeSections("deals"),
  ]);
  const products = data.results;
  const dealsHeader = findPromo(promos, "deals_header");

  return (
    <div className="bg-[#f5f5f5] pb-24 md:pb-8">
      {dealsHeader && (
        <section className="bg-[var(--ishtari-red)] px-4 py-8 text-center text-white">
          <h1 className="text-2xl font-black md:text-4xl">{dealsHeader.title}</h1>
          {dealsHeader.subtitle && (
            <p className="mt-2 text-sm opacity-90 md:text-base">{dealsHeader.subtitle}</p>
          )}
          <Link
            href={dealsHeader.link || "/products"}
            className="mt-4 inline-block rounded-full bg-white px-8 py-2.5 text-sm font-bold text-[var(--ishtari-red)] hover:bg-gray-100"
          >
            {dealsHeader.cta_label || "SHOP NOW"}
          </Link>
        </section>
      )}

      <HeroCarousel banners={banners} />
      <PriceTierBlocks tiers={priceTiers} />

      {sections.map((section) => (
        <ProductSection
          key={section.id}
          title={section.title}
          subtitle={section.subtitle}
          products={productsForSection(section.product_source, products)}
          viewAllHref={section.link}
          ctaLabel={section.cta_label}
        />
      ))}
    </div>
  );
}
