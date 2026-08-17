import Image from "next/image";
import Link from "next/link";
import { featuredCategories } from "@/config/site";

export function FeaturedCategories() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-5">
      <div className="flex justify-center gap-4 overflow-x-auto pb-2 scrollbar-hide sm:gap-6 md:gap-10">
        {featuredCategories.map((cat) => (
          <Link
            key={cat.label}
            href={cat.href}
            className="flex w-20 shrink-0 flex-col items-center gap-2 sm:w-24"
          >
            <div className="relative h-[72px] w-[72px] overflow-hidden rounded-full bg-[#efefef] sm:h-20 sm:w-20">
              <Image
                src={cat.image}
                alt={cat.label}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <span className="text-xs font-medium text-gray-900">{cat.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
