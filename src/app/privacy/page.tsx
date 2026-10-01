import type { Metadata } from "next";
import Link from "next/link";
import { getPrivacyPolicy } from "@/lib/api";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export const revalidate = 60;

const FALLBACK_CONTENT = `${siteConfig.name} only collects the personal data needed for you to shop with us, and nothing else.

## What we collect
- Account details you give us (name, email address or phone number)
- Your basket / cart contents
- Your orders and order history
- Checkout and payment information needed to complete a purchase (payments are processed by our payment provider)
- Delivery addresses and contact details needed to deliver your order

## How we use it
We use this data only to run your account, process your orders and payments, and deliver your purchases. We do not sell your data and we do not collect anything beyond what shopping on ${siteConfig.name} requires.

## Contact
If you have questions about your data, please reach out through our Help Center.`;

type Block =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

/** Plain-text policy → blocks. Blank lines separate blocks; "## " = heading; "- " = bullet. */
function parsePolicy(content: string): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ type: "paragraph", text: paragraph.join("\n") });
    paragraph = [];
  };
  const flushList = () => {
    if (list.length) blocks.push({ type: "list", items: list });
    list = [];
  };

  for (const rawLine of content.replace(/\r\n?/g, "\n").split("\n")) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
    } else if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "heading", text: line.slice(3).trim() });
    } else if (line.startsWith("- ")) {
      flushParagraph();
      list.push(line.slice(2).trim());
    } else {
      flushList();
      paragraph.push(line);
    }
  }
  flushParagraph();
  flushList();
  return blocks;
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default async function PrivacyPage() {
  let title = "Privacy Policy";
  let content = FALLBACK_CONTENT;
  let updatedAt: string | null = null;

  try {
    const policy = await getPrivacyPolicy();
    if (policy.content?.trim()) {
      title = policy.title?.trim() || title;
      content = policy.content;
      updatedAt = policy.updated_at;
    }
  } catch {
    // API unavailable — keep the built-in fallback text.
  }

  const blocks = parsePolicy(content);
  const updatedLabel = formatDate(updatedAt);

  return (
    <section className="mx-auto max-w-3xl px-4 py-8 pb-24 md:pb-8">
      <div className="rounded-lg border border-[var(--border)] bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {updatedLabel && (
          <p className="mt-1 text-xs text-[var(--muted)]">Last updated: {updatedLabel}</p>
        )}

        <div className="mt-6 space-y-4 text-sm leading-relaxed text-gray-800">
          {blocks.map((block, i) => {
            if (block.type === "heading") {
              return (
                <h2 key={i} className="pt-2 text-base font-bold text-gray-900">
                  {block.text}
                </h2>
              );
            }
            if (block.type === "list") {
              return (
                <ul key={i} className="list-disc space-y-1 pl-5">
                  {block.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={i} className="whitespace-pre-line">
                {block.text}
              </p>
            );
          })}
        </div>

        <div className="mt-8 border-t border-[var(--border)] pt-4 text-sm text-gray-700">
          <h2 className="font-bold text-gray-900">Deleting your account</h2>
          <p className="mt-1">
            You can delete your account and personal data at any time.{" "}
            <Link href="/account/delete" className="font-medium text-[var(--ishtari-red)] hover:underline">
              Learn how to delete your account
            </Link>
            .
          </p>
        </div>
      </div>

      <Link href="/" className="mt-8 inline-block text-sm font-medium text-[var(--ishtari-red)] hover:underline">
        ← Back to Home
      </Link>
    </section>
  );
}
