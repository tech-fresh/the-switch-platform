import Image from "next/image";
import Link from "next/link";

import { MOCK_IDEA_BRAND } from "@/components/mock-idea/brand-tokens";

const LOGO_SIZES = {
  sm: { width: 40, height: 40, className: "size-10" },
  md: { width: 44, height: 44, className: "size-11" },
  lg: { width: 48, height: 48, className: "size-12" },
} as const;

interface SwitchBrandLogoProps {
  href?: string;
  size?: keyof typeof LOGO_SIZES;
  showWordmark?: boolean;
  wordmark?: string;
  subtitle?: string;
  className?: string;
  onDark?: boolean;
}

export function SwitchBrandLogo({
  href = "/",
  size = "md",
  showWordmark = false,
  wordmark = MOCK_IDEA_BRAND.name,
  subtitle,
  className = "",
  onDark = false,
}: SwitchBrandLogoProps) {
  const dimensions = LOGO_SIZES[size];

  const logoImage = (
    <Image
      src={MOCK_IDEA_BRAND.logoSrc}
      alt="The Switch Platform logo"
      width={dimensions.width}
      height={dimensions.height}
      className={`${dimensions.className} shrink-0 object-contain opacity-90 drop-shadow-sm`}
      priority={size === "lg"}
    />
  );

  const content = showWordmark ? (
    <span className={`flex min-w-0 items-center gap-3 ${className}`}>
      {logoImage}
      <span className="min-w-0">
        <span
          className={`block truncate text-sm font-black tracking-tight ${
            onDark ? "text-white" : "text-stone-950"
          }`}
        >
          {wordmark}
        </span>
        {subtitle ? (
          <span
            className={`hidden text-[10px] font-semibold uppercase tracking-[0.22em] sm:block ${
              onDark ? "text-stone-400" : "text-stone-500"
            }`}
          >
            {subtitle}
          </span>
        ) : null}
      </span>
    </span>
  ) : (
    logoImage
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} className={`inline-flex items-center ${className}`}>
      {content}
    </Link>
  );
}
