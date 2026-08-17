"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  CalendarCheck,
  ChevronDown,
  ChevronUp,
  Clock,
  Heart,
  Lightbulb,
  MapPin,
  MessageCircle,
  MessageSquare,
  Package,
  RefreshCw,
  RotateCcw,
  Shield,
  Star,
  Store,
  Ticket,
  User,
  Wallet,
} from "lucide-react";
import { accountMenuItems } from "@/config/site";

const iconMap = {
  user: User,
  shield: Shield,
  "map-pin": MapPin,
  package: Package,
  "rotate-ccw": RotateCcw,
  star: Star,
  wallet: Wallet,
  ticket: Ticket,
  "calendar-check": CalendarCheck,
  "refresh-cw": RefreshCw,
  heart: Heart,
  clock: Clock,
  "message-square": MessageSquare,
  "message-circle": MessageCircle,
  lightbulb: Lightbulb,
  store: Store,
} as const;

type AccountDropdownProps = {
  userName?: string;
  onSignOut?: () => void;
};

export function AccountDropdown({ userName = "Guest", onSignOut }: AccountDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open]);

  const Chevron = open ? ChevronUp : ChevronDown;

  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex shrink-0 flex-col items-center text-[10px] hover:opacity-90 lg:text-[11px]"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <User className="h-5 w-5" />
        <span className="mt-0.5 flex items-center gap-0.5 whitespace-nowrap">
          <span className="hidden lg:inline">Welcome </span>
          <span className="max-w-[72px] truncate font-medium lg:max-w-[88px]">{userName}</span>
          <Chevron className="h-3 w-3 shrink-0" />
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-md border border-[var(--border)] bg-white py-1 shadow-lg">
          <div className="max-h-[min(70vh,520px)] overflow-y-auto">
            {accountMenuItems.map((item) => {
              const Icon = iconMap[item.icon];
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-50"
                >
                  <Icon className="h-4 w-4 shrink-0 text-gray-500" />
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="border-t border-[var(--border)]">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onSignOut?.();
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-[var(--ishtari-red)] hover:bg-[#eef3ef]"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
