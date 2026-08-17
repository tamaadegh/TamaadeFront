"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Grid3X3, Home, ShoppingCart, Tag, User } from "lucide-react";
import { mobileNavItems } from "@/config/site";

const icons = {
  home: Home,
  categories: Grid3X3,
  deals: Tag,
  cart: ShoppingCart,
  profile: User,
};

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white md:hidden">
      <div className="mx-auto flex max-w-lg items-end justify-around px-2 pb-1 pt-2">
        {mobileNavItems.map((item) => {
          const Icon = icons[item.icon];
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          if ("center" in item && item.center) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="-mt-5 flex flex-col items-center"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--ishtari-red)] text-white shadow-lg">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="mt-1 text-[10px] font-medium text-gray-600">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 px-2 py-1"
            >
              <Icon
                className={`h-5 w-5 ${active ? "text-[var(--ishtari-red)]" : "text-gray-400"}`}
              />
              <span
                className={`text-[10px] font-medium ${active ? "text-[var(--ishtari-red)]" : "text-gray-500"}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
