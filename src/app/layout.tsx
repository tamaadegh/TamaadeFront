import type { Metadata } from "next";
import { CategoryNav } from "@/components/layout/CategoryNav";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { TopHeader } from "@/components/layout/TopHeader";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { AppProviders } from "@/components/providers/AppProviders";
import { getNavLinks } from "@/lib/api";
import { siteConfig } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: siteConfig.logoSrc,
    apple: siteConfig.logoSrc,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let navLinks: Awaited<ReturnType<typeof getNavLinks>> = [];
  try {
    navLinks = await getNavLinks();
  } catch {
    navLinks = [];
  }

  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <AppProviders>
          <div className="sticky top-0 z-50">
            <TopHeader />
            <CategoryNav links={navLinks} />
          </div>
          <main className="min-h-[60vh]">{children}</main>
          <SiteFooter navLinks={navLinks} />
          <FloatingActions />
          <MobileBottomNav />
        </AppProviders>
      </body>
    </html>
  );
}
