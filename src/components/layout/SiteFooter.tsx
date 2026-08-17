import Link from "next/link";
import { siteConfig } from "@/config/site";
import { SiteLogo } from "./SiteLogo";
import type { NavLink } from "@/types";

export function SiteFooter({ navLinks = [] }: { navLinks?: NavLink[] }) {
  return (
    <footer className="mt-8 border-t border-[var(--border)] bg-white pb-20 md:pb-0">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-4">
        <div>
          <SiteLogo className="h-10 w-auto" />
          <p className="mt-2 text-sm text-[var(--muted)]">{siteConfig.tagline}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Shop</h3>
          <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
            <li><Link href="/" className="hover:text-[var(--ishtari-red)]">Home</Link></li>
            <li><Link href="/allcategories" className="hover:text-[var(--ishtari-red)]">All Categories</Link></li>
            <li><Link href="/deals" className="hover:text-[var(--ishtari-red)]">Deals</Link></li>
            <li><Link href="/products" className="hover:text-[var(--ishtari-red)]">Products</Link></li>
            <li><Link href="/cart" className="hover:text-[var(--ishtari-red)]">Basket</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Account</h3>
          <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
            <li><Link href="/profile" className="hover:text-[var(--ishtari-red)]">Me / Profile</Link></li>
            <li><Link href="/login" className="hover:text-[var(--ishtari-red)]">Login</Link></li>
            <li><Link href="/register" className="hover:text-[var(--ishtari-red)]">Register</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Help</h3>
          <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
            <li><Link href="/help" className="hover:text-[var(--ishtari-red)]">Help Center</Link></li>
            <li>
              <a
                href={`https://wa.me/${siteConfig.whatsapp.replace("+", "")}`}
                className="hover:text-[var(--ishtari-red)]"
                target="_blank"
                rel="noreferrer"
              >
                Contact us on WhatsApp
              </a>
            </li>
            <li><Link href="/visual-search" className="hover:text-[var(--ishtari-red)]">Visual Search</Link></li>
          </ul>
        </div>
      </div>

      {navLinks.length > 0 && (
        <div className="border-t border-[var(--border)] bg-gray-50 px-4 py-3">
          <div className="mx-auto flex max-w-7xl flex-wrap gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.link}
                className="text-xs text-[var(--muted)] hover:text-[var(--ishtari-red)]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-[var(--border)] py-4 text-center text-xs text-[var(--muted)]">
        &copy; {new Date().getFullYear()} {siteConfig.name}.
      </div>
    </footer>
  );
}
