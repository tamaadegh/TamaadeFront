import { HeroCarousel } from "@/components/home/HeroCarousel";
import { MerchCircleGrid } from "@/components/home/MerchCircleGrid";
import { PriceTierBlocks } from "@/components/home/PriceTierBlocks";
import { ProductSection } from "@/components/home/ProductSection";
import { TopPromoStrip } from "@/components/home/TopPromoStrip";
import {
  findPromo,
  getBanners,
  getHomeSections,
  getMerchTiles,
  getPriceTiers,
  getProducts,
  getPromos,
} from "@/lib/api";
import { productsForSection } from "@/lib/utils/product";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [
    { results: products },
    banners,
    priceTiers,
    promos,
    mainTiles,
    featuredTiles,
    bottomTiles,
    sections,
  ] = await Promise.all([
    getProducts(),
    getBanners(),
    getPriceTiers(),
    getPromos(),
    getMerchTiles("main"),
    getMerchTiles("featured"),
    getMerchTiles("bottom"),
    getHomeSections("home"),
  ]);
  const topStrip = findPromo(promos, "top_strip");

  return (
    <div className="bg-[#f5f5f5] pb-24 md:pb-8">
      {topStrip && <TopPromoStrip promo={topStrip} />}
      <HeroCarousel banners={banners} />
      <PriceTierBlocks tiers={priceTiers} />
      <MerchCircleGrid tiles={mainTiles} />
      <MerchCircleGrid tiles={featuredTiles} columns="featured" />

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

      <MerchCircleGrid tiles={bottomTiles} columns="bottom" />
    </div>
  );
}
