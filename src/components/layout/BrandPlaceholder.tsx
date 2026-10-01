import Image from "next/image";
import { siteConfig } from "@/config/site";

type BrandPlaceholderProps = {
  /** Accessible label (e.g. the product or category name). Empty = decorative. */
  alt?: string;
  className?: string;
  sizes?: string;
};

/**
 * Brand fallback used wherever a real product/category image is missing.
 * Fills its (relatively positioned) parent with the square Tamaade icon on brand green.
 */
export function BrandPlaceholder({ alt = "", className = "", sizes = "200px" }: BrandPlaceholderProps) {
  return (
    <span className={`absolute inset-0 block bg-[#365944] ${className}`}>
      <Image src={siteConfig.iconSrc} alt={alt} fill className="object-contain" sizes={sizes} />
    </span>
  );
}
