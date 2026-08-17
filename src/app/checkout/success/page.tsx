"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { getHubtelPaymentStatus } from "@/lib/api";

function CheckoutSuccessContent() {
  const params = useSearchParams();
  const ref = params.get("ref") || "";
  const { refreshCart } = useCart();
  const [paid, setPaid] = useState<boolean | null>(null);

  useEffect(() => {
    void refreshCart();
    if (!ref) return;

    let cancelled = false;
    let attempts = 0;

    async function checkStatus() {
      try {
        const status = await getHubtelPaymentStatus(ref);
        if (cancelled) return;
        if (status.paid) {
          setPaid(true);
          void refreshCart();
          return;
        }
        attempts += 1;
        if (attempts < 8) {
          window.setTimeout(() => {
            void checkStatus();
          }, 2000);
        } else {
          setPaid(false);
        }
      } catch {
        if (!cancelled) setPaid(false);
      }
    }

    void checkStatus();
    return () => {
      cancelled = true;
    };
  }, [ref, refreshCart]);

  return (
    <section className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-gray-900">Payment</h1>
      <p className="mt-3 text-sm text-[var(--muted)]">
        {paid === true
          ? "Payment received. Thank you — your order is confirmed."
          : paid === false
            ? "We have not confirmed the payment yet. If you paid, it can take a moment for Hubtel to notify us."
            : "Checking your Hubtel payment…"}
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-md bg-[var(--ishtari-red)] px-6 py-3 text-sm font-bold text-white"
      >
        Continue shopping
      </Link>
    </section>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<p className="px-4 py-16 text-center text-sm">Loading…</p>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
