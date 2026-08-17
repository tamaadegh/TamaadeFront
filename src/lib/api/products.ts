import { apiClient } from "./client";
import type {
  HeroBanner,
  HomeSection,
  MerchTile,
  NavLink,
  PaginatedResponse,
  PriceTier,
  Product,
  ProductCategory,
  StorefrontPromo,
} from "@/types";
import { resolveMediaUrl } from "@/lib/utils/media";

function normalizeProduct(product: Product): Product {
  const image = resolveMediaUrl(product.image);
  return {
    ...product,
    slug: product.slug || String(product.id),
    variantId: product.variantId ?? null,
    compare_at_price: product.compare_at_price ?? null,
    discount_percent: product.discount_percent ?? null,
    promo_label: product.promo_label ?? "",
    brand: product.brand ?? "",
    is_new: Boolean(product.is_new),
    is_express: Boolean(product.is_express),
    sale_ends_at: product.sale_ends_at ?? null,
    image,
    video: resolveMediaUrl(product.video),
    images: (product.images ?? []).map((img) => ({
      ...img,
      url: resolveMediaUrl(img.url),
    })),
    videos: (product.videos ?? []).map((vid) => ({
      ...vid,
      url: resolveMediaUrl(vid.url),
    })),
  };
}

function normalizeCategory(category: ProductCategory): ProductCategory {
  return {
    ...category,
    icon: resolveMediaUrl(category.icon),
  };
}

function toPaginated<T>(items: T[]): PaginatedResponse<T> {
  return {
    count: items.length,
    next: null,
    previous: null,
    results: items,
  };
}

export async function getProducts(params?: {
  search?: string;
}): Promise<PaginatedResponse<Product>> {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.set("search", params.search);
  const query = searchParams.toString();

  const data = await apiClient<Product[] | PaginatedResponse<Product>>(
    `/api/products/${query ? `?${query}` : ""}`,
    { cache: "no-store" },
  );

  const results = (Array.isArray(data) ? data : data.results).map(normalizeProduct);
  return toPaginated(results);
}

export async function getProduct(idOrSlug: string | number): Promise<Product> {
  const key = String(idOrSlug);
  const id = /^\d+$/.test(key) ? key : undefined;
  if (!id) {
    const listed = await getProducts();
    const match = listed.results.find((p) => p.slug === key);
    if (!match) throw new Error("Product not found");
    return match;
  }

  const product = await apiClient<Product>(`/api/products/${id}/`, {
    cache: "no-store",
  });
  return normalizeProduct(product);
}

export async function getCategories(): Promise<ProductCategory[]> {
  const data = await apiClient<PaginatedResponse<ProductCategory> | ProductCategory[]>(
    "/api/products/categories/",
    { cache: "no-store" },
  );
  const categories = Array.isArray(data) ? data : data.results;
  return categories.map(normalizeCategory);
}

export async function getBanners(): Promise<HeroBanner[]> {
  const data = await apiClient<PaginatedResponse<HeroBanner> | HeroBanner[]>(
    "/api/products/banners/",
    { cache: "no-store" },
  );
  const banners = Array.isArray(data) ? data : data.results;
  return banners
    .map((banner) => ({
      ...banner,
      image: resolveMediaUrl(banner.image),
      link: banner.link || "/deals",
    }))
    .filter((banner) => Boolean(banner.image));
}

function asList<T>(data: PaginatedResponse<T> | T[]): T[] {
  return Array.isArray(data) ? data : data.results;
}

export async function getPriceTiers(): Promise<PriceTier[]> {
  const data = await apiClient<PaginatedResponse<PriceTier> | PriceTier[]>(
    "/api/products/price-tiers/",
    { cache: "no-store" },
  );
  return asList(data).sort((a, b) => a.order - b.order || a.amount - b.amount);
}

export async function getPromos(): Promise<StorefrontPromo[]> {
  const data = await apiClient<PaginatedResponse<StorefrontPromo> | StorefrontPromo[]>(
    "/api/products/promos/",
    { cache: "no-store" },
  );
  return asList(data);
}

export function findPromo(promos: StorefrontPromo[], key: string): StorefrontPromo | null {
  return promos.find((promo) => promo.key === key) ?? null;
}

export async function getMerchTiles(placement?: MerchTile["placement"]): Promise<MerchTile[]> {
  const query = placement ? `?placement=${placement}` : "";
  const data = await apiClient<PaginatedResponse<MerchTile> | MerchTile[]>(
    `/api/products/merch-tiles/${query}`,
    { cache: "no-store" },
  );
  return asList(data).map((tile) => ({
    ...tile,
    image: resolveMediaUrl(tile.image),
    badge: tile.badge ?? "",
    highlight: Boolean(tile.highlight),
    link: tile.link || "/products",
  }));
}

export async function getHomeSections(location: HomeSection["location"] = "home"): Promise<HomeSection[]> {
  const data = await apiClient<PaginatedResponse<HomeSection> | HomeSection[]>(
    `/api/products/home-sections/?location=${location}`,
    { cache: "no-store" },
  );
  return asList(data).sort((a, b) => a.order - b.order);
}

export async function getNavLinks(): Promise<NavLink[]> {
  const data = await apiClient<PaginatedResponse<NavLink> | NavLink[]>(
    "/api/products/nav-links/",
    { cache: "no-store" },
  );
  return asList(data).sort((a, b) => a.order - b.order);
}
