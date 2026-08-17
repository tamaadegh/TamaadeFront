"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { HeroBanner } from "@/types";

type HeroSlide = {
  id: string;
  href: string;
  image: string;
  alt: string;
};

function toSlides(banners: HeroBanner[]): HeroSlide[] {
  return banners
    .filter((banner) => Boolean(banner.image))
    .map((banner) => ({
      id: String(banner.id),
      href: banner.link || "/deals",
      image: banner.image as string,
      alt: banner.title,
    }));
}

const AUTOPLAY_MS = 5000;

export function HeroCarousel({ banners = [] }: { banners?: HeroBanner[] }) {
  const slides = toSlides(banners);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (index >= slides.length) setIndex(0);
  }, [index, slides.length]);

  useEffect(() => {
    if (slides.length < 2 || paused) return;
    const timer = window.setInterval(() => {
      setIndex((i) => (i === slides.length - 1 ? 0 : i + 1));
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  if (slides.length === 0) {
    return null;
  }

  const slide = slides[index] ?? slides[0];

  const goPrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => (i === 0 ? slides.length - 1 : i - 1));
  };

  const goNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => (i === slides.length - 1 ? 0 : i + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    if (start == null) return;
    const end = e.changedTouches[0]?.clientX ?? start;
    const delta = end - start;
    if (Math.abs(delta) > 48) {
      if (delta < 0) {
        setIndex((i) => (i === slides.length - 1 ? 0 : i + 1));
      } else {
        setIndex((i) => (i === 0 ? slides.length - 1 : i - 1));
      }
    }
    touchStartX.current = null;
  };

  return (
    <section
      className="hero-carousel relative w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Link
        href={slide.href}
        className="relative block w-full"
        aria-label={slide.alt}
      >
        <div className="relative aspect-[21/7] min-h-[180px] w-full sm:min-h-[220px] md:min-h-[280px] lg:min-h-[320px]">
          {slides.map((s, i) => (
            <Image
              key={s.id}
              src={s.image}
              alt={s.alt}
              fill
              priority={i === 0}
              className={`object-cover object-center transition-opacity duration-300 ${
                i === index ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              sizes="100vw"
            />
          ))}
        </div>
      </Link>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="carousel-arrow-prev"
            aria-label="Previous slide"
          >
            <span className="carousel-arrow-circle">
              <ChevronLeft className="h-5 w-5 text-gray-600" strokeWidth={2.5} />
            </span>
          </button>

          <button
            type="button"
            onClick={goNext}
            className="carousel-arrow-next"
            aria-label="Next slide"
          >
            <span className="carousel-arrow-circle">
              <ChevronRight className="h-5 w-5 text-gray-600" strokeWidth={2.5} />
            </span>
          </button>

          <div className="absolute bottom-2.5 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIndex(i);
                }}
                className={`h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2 ${
                  i === index ? "bg-[var(--ishtari-red)]" : "bg-white/80 shadow-sm"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
