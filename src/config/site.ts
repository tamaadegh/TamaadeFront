export const siteConfig = {
  name: "Tamaade",
  logoSrc: "/logo/tamaade-logo.png",
  tagline: "Online Shopping in Ghana",
  description: "Marketplace e-commerce — achetez en ligne au Ghana.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  currency: "GH₵",
  country: "Ghana",
  whatsapp: "+233000000000",
} as const;

/** Featured row with product-style circle images (Ishtari homepage) */
export const featuredCategories = [
  { label: "Shoes", href: "/products?category=Shoes", image: "https://picsum.photos/seed/shoes-cat/200/200" },
  { label: "Clothing", href: "/products?category=Clothing", image: "https://picsum.photos/seed/clothing-cat/200/200" },
  { label: "Bags", href: "/products?category=Bags", image: "https://picsum.photos/seed/bags-cat/200/200" },
  { label: "Watches", href: "/products?category=Watches", image: "https://picsum.photos/seed/watches-cat/200/200" },
  { label: "Accessories", href: "/products?category=Accessories", image: "https://picsum.photos/seed/accessories-cat/200/200" },
] as const;

/** Barre de navigation secondaire (comme Ishtari) */
export const secondaryNavLinks = [
  { label: "Home & Kitchen", href: "/products?category=Home%20%26%20Kitchen" },
  { label: "Tools & Improvement", href: "/products?category=Tools" },
  { label: "Electronics", href: "/products?category=Electronics" },
  { label: "Storage & Organization", href: "/products?category=Storage" },
  { label: "New Arrivals", href: "/products?ordering=-created_at" },
  { label: "Back To Stock", href: "/products?filter=back-to-stock" },
  { label: "Top Selling", href: "/products?filter=top-selling" },
] as const;

/** Cercles catégories — rangée principale homepage */
export const mainCategoryCircles = [
  { label: "4th Anniversary!", href: "/deals", badge: "Up to 70% OFF", highlight: true },
  { label: "Appliances", href: "/products?category=Appliances" },
  { label: "Decor", href: "/products?category=Decor" },
  { label: "Personal Care", href: "/products?category=Personal%20Care" },
  { label: "Kitchen & Dining", href: "/products?category=Kitchen%20%26%20Dining" },
  { label: "Lighting", href: "/products?category=Lighting" },
  { label: "Shavers", href: "/products?category=Shavers" },
  { label: "Housekeeping", href: "/products?category=Housekeeping" },
  { label: "Kitchen & Bath Fixtures", href: "/products?category=Kitchen%20%26%20Bath" },
  { label: "Back To School!", href: "/products?category=Back%20To%20School" },
  { label: "Fitness", href: "/products?category=Fitness" },
  { label: "Electronics", href: "/products?category=Electronics" },
  { label: "Automotive", href: "/products?category=Automotive" },
  { label: "Home Furniture", href: "/products?category=Home%20Furniture" },
  { label: "Storage & Organization", href: "/products?category=Storage" },
  { label: "Luggage", href: "/products?category=Luggage" },
  { label: "Cooling", href: "/products?category=Cooling" },
  { label: "Shoes", href: "/products?category=Shoes" },
  { label: "Shop By Bundles", href: "/deals" },
  { label: "Tools", href: "/products?category=Tools" },
  { label: "Baby & Toys", href: "/products?category=Baby%20%26%20Toys" },
  { label: "Camping & Outdoor", href: "/products?category=Camping" },
  { label: "Bath", href: "/products?category=Bath" },
  { label: "Patio & Garden", href: "/products?category=Patio%20%26%20Garden" },
  { label: "Cameras", href: "/products?category=Cameras" },
  { label: "Shoe Organizer", href: "/products?category=Shoe%20Organizer" },
  { label: "Top Brands", href: "/products?filter=top-brands" },
] as const;

/** Grille catégories bas de homepage */
export const bottomCategoryGrid = [
  { label: "Coffee & More", href: "/products?category=Coffee" },
  { label: "Air Quality", href: "/products?category=Air%20Quality" },
  { label: "Kitchen Storage", href: "/products?category=Kitchen%20Storage" },
  { label: "Decorative Accessories", href: "/products?category=Decorative" },
  { label: "Drinkware", href: "/products?category=Drinkware" },
  { label: "Rugs & Carpets", href: "/products?category=Rugs" },
  { label: "Cookware", href: "/products?category=Cookware" },
  { label: "Inflatable Furniture", href: "/products?category=Inflatable" },
  { label: "Clocks", href: "/products?category=Clocks" },
  { label: "Vacuums & Floor Care", href: "/products?category=Vacuums" },
  { label: "Wall Decor", href: "/products?category=Wall%20Decor" },
  { label: "Kitchen Gadgets", href: "/products?category=Kitchen%20Gadgets" },
  { label: "Shoes Organizer", href: "/products?category=Shoe%20Organizer" },
  { label: "Living Room Furniture", href: "/products?category=Living%20Room" },
  { label: "Blenders", href: "/products?category=Blenders" },
  { label: "Bathroom Storage", href: "/products?category=Bathroom%20Storage" },
  { label: "Irons & Steamers", href: "/products?category=Irons" },
  { label: "Dinnerware", href: "/products?category=Dinnerware" },
] as const;

/** Slides hero carousel */
export const heroSlides = [
  {
    title: "UP TO 70% OFF",
    subtitle: "4th Anniversary!",
    sideText: "4 YEARS ANNIVERSARY",
    cta: "SHOP NOW",
    href: "/deals",
    bg: "from-[var(--ishtari-yellow)] via-[#ffe566] to-[var(--ishtari-yellow)]",
    accent: "text-[var(--ishtari-red)]",
  },
  {
    title: "BACK TO SCHOOL!",
    subtitle: "Everything you need",
    sideText: "SCHOOL DEALS",
    cta: "SHOP NOW",
    href: "/products?category=Back%20To%20School",
    bg: "from-blue-500 via-blue-600 to-blue-700",
    accent: "text-white",
  },
  {
    title: "HOT ARRIVALS",
    subtitle: "Don't miss out",
    sideText: "NEW IN",
    cta: "SHOP NOW",
    href: "/products?ordering=-created_at",
    bg: "from-[#4a7359] via-[var(--ishtari-red)] to-[var(--ishtari-red-dark)]",
    accent: "text-white",
  },
] as const;

/** Sections produits homepage */
export const homeProductSections = [
  {
    id: "hot-arrivals",
    title: "Hot Arrivals!",
    subtitle: "Don't Miss What Just Arrived!",
    viewAllHref: "/products?ordering=-created_at",
  },
  {
    id: "top-picks",
    title: "Our Top Picks",
    subtitle: "Tried, loved, and highly rated",
    viewAllHref: "/products?filter=top-picks",
  },
  {
    id: "hot-sellers",
    title: "Hot Sellers",
    subtitle: "The items everyone's buying",
    viewAllHref: "/products?filter=top-selling",
  },
] as const;

/** Navigation mobile bas de page */
export const mobileNavItems = [
  { label: "Home", href: "/", icon: "home" as const },
  { label: "Category", href: "/allcategories", icon: "categories" as const },
  { label: "Deals", href: "/deals", icon: "deals" as const, center: true },
  { label: "Cart", href: "/cart", icon: "cart" as const },
  { label: "Me", href: "/profile", icon: "profile" as const },
] as const;

/** Menu compte utilisateur (dropdown header — style Ishtari) */
export const accountMenuItems = [
  { label: "Profile", href: "/profile", icon: "user" as const },
  { label: "Security", href: "/profile?tab=security", icon: "shield" as const },
  { label: "Addresses", href: "/profile?tab=addresses", icon: "map-pin" as const },
  { label: "Orders", href: "/profile?tab=orders", icon: "package" as const },
  { label: "Return Orders", href: "/profile?tab=returns", icon: "rotate-ccw" as const },
  { label: "Points", href: "/profile?tab=points", icon: "star" as const },
  { label: "Wallet", href: "/profile?tab=wallet", icon: "wallet" as const },
  { label: "Coupons", href: "/profile?tab=coupons", icon: "ticket" as const },
  { label: "Check In", href: "/profile?tab=check-in", icon: "calendar-check" as const },
  { label: "Buy Again", href: "/profile?tab=buy-again", icon: "refresh-cw" as const },
  { label: "Wishlist", href: "/profile?tab=wishlist", icon: "heart" as const },
  { label: "Recently Viewed", href: "/profile?tab=recent", icon: "clock" as const },
  { label: "Review Center", href: "/profile?tab=reviews", icon: "message-square" as const },
  { label: "Feedback", href: "/help", icon: "message-circle" as const },
  { label: "Suggestion", href: "/help?tab=suggestion", icon: "lightbulb" as const },
  { label: "Shops", href: "/products", icon: "store" as const },
] as const;

export const orderStatusLabels: Record<string, string> = {
  P: "Pending",
  C: "Completed",
};

export const paymentStatusLabels: Record<string, string> = {
  P: "Pending",
  C: "Paid",
  F: "Failed",
};

export const paymentOptionLabels: Record<string, string> = {
  S: "Stripe",
  P: "PayPal",
  H: "Hubtel",
};

export const addressTypeLabels: Record<string, string> = {
  S: "Shipping",
  B: "Billing",
};
