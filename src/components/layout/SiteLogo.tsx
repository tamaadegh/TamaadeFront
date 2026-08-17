import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

const LOGO_WIDTH = 1024;
const LOGO_HEIGHT = 576;

type SiteLogoProps = {
  className?: string;
  priority?: boolean;
  linked?: boolean;
  /** Zoom into center — trims empty padding in the logo PNG */
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
      className={`relative inline-flex shrink-0 overflow-hidden ${className}`}
      style={{ aspectRatio: `${LOGO_WIDTH / LOGO_HEIGHT}` }}
    >
      <Image
        src={siteConfig.logoSrc}
        alt="Tamaade"
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        className="absolute left-1/2 top-1/2 h-[230%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2"
        priority={priority}
      />
    </span>
  ) : (
    <Image
      src={siteConfig.logoSrc}
      alt="Tamaade"
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
