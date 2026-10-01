"use client";

import Link from "next/link";
import { useState } from "react";
import { CircleHelp, Search, ShoppingCart, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { AccountDropdown } from "./AccountDropdown";
import { SiteLogo } from "./SiteLogo";

export function TopHeader() {
  const [query, setQuery] = useState("");
  const { user, logout, loading } = useAuth();
  const { itemCount } = useCart();

  const displayName = user?.first_name || user?.email?.split("@")[0] || "Guest";

  return (
    <header className="bg-[var(--ishtari-red)] text-white">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-2.5 md:gap-4 md:px-4 md:py-3">
        <SiteLogo
          priority
          cropped
          className="h-9 sm:h-10 md:h-11 lg:h-12"
        />

        <form
          action="/products"
          method="get"
          className="flex flex-1 items-center overflow-hidden rounded-md bg-white"
        >
          <input
            name="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What are you looking for?"
            className="min-w-0 flex-1 py-2 pl-3 text-xs text-gray-800 outline-none placeholder:text-gray-400 md:py-2.5 md:text-sm"
          />
          <button
            type="submit"
            className="bg-[var(--ishtari-red-dark)] px-3 py-2 hover:opacity-90 md:px-4 md:py-2.5"
            aria-label="Search"
          >
            <Search className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        </form>

        <Link
          href="/help"
          className="hidden shrink-0 flex-col items-center text-[10px] hover:opacity-90 lg:flex"
        >
          <CircleHelp className="h-5 w-5" />
          <span>Help Center</span>
        </Link>

        {!loading && user ? (
          <AccountDropdown userName={displayName} onSignOut={() => void logout()} />
        ) : (
          <Link
            href="/login"
            className="hidden shrink-0 flex-col items-center text-[10px] hover:opacity-90 sm:flex"
          >
            <User className="h-5 w-5" />
            <span>Log In</span>
          </Link>
        )}

        <Link
          href="/cart"
          className="flex shrink-0 flex-col items-center text-[10px] font-medium"
        >
          <span className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -right-2 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--ishtari-blue)] px-1 text-[9px] font-bold text-white">
              {itemCount}
            </span>
          </span>
          <span className="mt-0.5 hidden sm:inline">Basket</span>
        </Link>
      </div>
    </header>
  );
}
