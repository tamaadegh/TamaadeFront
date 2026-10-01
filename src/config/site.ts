export const siteConfig = {
  name: "Tamaade",
  /** Full 1920x1080 artwork: white wordmark on solid green (#365944) */
  logoSrc: "/logo/tamaade-logo.png",
  /** Square brand icon — favicon, app icon and image fallback */
  iconSrc: "/logo/tamaade-icon.png",
  appleIconSrc: "/logo/tamaade-apple-icon.png",
  tagline: "Online Shopping in Ghana",
  description: "Tamaade — online shopping in Ghana.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  currency: "GH₵",
  country: "Ghana",
  /** WhatsApp contact number (international format). Empty = WhatsApp links are hidden. */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
} as const;

/** wa.me link for the configured WhatsApp number, or null when none is configured. */
export function getWhatsAppUrl(): string | null {
  const digits = siteConfig.whatsapp.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}

/** Navigation mobile bas de page */
export const mobileNavItems = [
  { label: "Home", href: "/", icon: "home" as const },
  { label: "Category", href: "/allcategories", icon: "categories" as const },
  { label: "Deals", href: "/deals", icon: "deals" as const, center: true },
  { label: "Cart", href: "/cart", icon: "cart" as const },
  { label: "Me", href: "/profile", icon: "profile" as const },
] as const;

/** Account dropdown menu (header) — only pages that actually exist. */
export const accountMenuItems = [
  { label: "Profile", href: "/profile", icon: "user" as const },
  { label: "Basket", href: "/cart", icon: "package" as const },
  { label: "Help Center", href: "/help", icon: "help" as const },
  { label: "Privacy Policy", href: "/privacy", icon: "shield" as const },
  { label: "Delete Account", href: "/account/delete", icon: "user-x" as const },
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
