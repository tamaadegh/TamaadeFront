import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

/** Source artwork: 1920x1080, wordmark spans ~x 477–1398, y 402–640 on solid green. */
const LOGO_WIDTH = 1920;
const LOGO_HEIGHT = 1080;

/** Crop window around the wordmark (with a little breathing room). */
const CROP = { x: 430, y: 360, width: 1020, height: 320 } as const;

const pct = (value: number) => `${(value * 100).toFixed(4)}%`;

type SiteLogoProps = {
  className?: string;
  priority?: boolean;
  linked?: boolean;
  /** Show only the wordmark area of the artwork (trims the large green margins). Set a height via className. */
  cropped?: boolean;
};

export function SiteLogo({
  className = "h-14 w-auto md:h-16",
  priority = false,
  linked = true,
  cropped = false,
}: SiteLogoProps) {
  const image = cropped ? (
    <span
      className={`relative inline-block shrink-0 overflow-hidden bg-[#365944] ${className}`}
      style={{ aspectRatio: `${CROP.width} / ${CROP.height}` }}
    >
      <Image
        src={siteConfig.logoSrc}
        alt={siteConfig.name}
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        sizes="(max-width: 768px) 720px, 960px"
        className="absolute h-auto max-w-none"
        style={{
          width: pct(LOGO_WIDTH / CROP.width),
          left: pct(-CROP.x / CROP.width),
          top: pct(-CROP.y / CROP.height),
        }}
        priority={priority}
      />
    </span>
  ) : (
    <Image
      src={siteConfig.logoSrc}
      alt={siteConfig.name}
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      className={`object-contain ${className}`}
      priority={priority}
    />
  );

  if (linked) {
    return (
      <Link href="/" className="shrink-0">
        {image}
      </Link>
    );
  }

  return image;
}
