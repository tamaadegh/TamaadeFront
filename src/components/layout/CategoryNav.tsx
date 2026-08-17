"use client";

import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import type { NavLink } from "@/types";

export function CategoryNav({ links = [] }: { links?: NavLink[] }) {
  if (links.length === 0) return null;

  return (
    <nav className="hidden border-b border-[var(--border)] bg-white md:block">
      <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-4 py-2.5 scrollbar-hide">
        <Link
          href="/allcategories"
          className="flex shrink-0 items-center gap-2 text-sm font-semibold text-gray-800 hover:text-[var(--ishtari-red)]"
        >
          <Menu className="h-4 w-4" />
          All Categories
          <ChevronDown className="h-3.5 w-3.5" />
        </Link>

        {links.map((link) => (
          <Link
            key={link.id}
            href={link.link}
            className="flex shrink-0 items-center gap-0.5 text-sm text-gray-700 hover:text-[var(--ishtari-red)]"
          >
            {link.label}
            {link.has_dropdown ? <ChevronDown className="h-3.5 w-3.5" /> : null}
          </Link>
        ))}
      </div>
    </nav>
  );
}
