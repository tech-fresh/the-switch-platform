import Image from "next/image";
import Link from "next/link";

import { MOCK_IDEA_BRAND } from "@/components/mock-idea/brand-tokens";

/** Native asset ratio after trim — 726×255 */
const LOGO_ASPECT = 726 / 255;

const LOGO_SIZES = {
  sm: {
    width: 112,
    height: Math.round(112 / LOGO_ASPECT),
    className: "h-auto w-28",
  },
  md: {
    width: 160,
    height: Math.round(160 / LOGO_ASPECT),
    className: "h-auto w-36 sm:w-40",
  },
  lg: {
    width: 220,
    height: Math.round(220 / LOGO_ASPECT),
    className: "h-auto w-52 sm:w-56",
  },
  hero: {
    width: 726,
    height: 255,
    className: "h-auto w-full max-w-2xl sm:max-w-3xl",
  },
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
  const stackWordmark = showWordmark && size === "hero";

  const logoImage = (
    <Image
      src={MOCK_IDEA_BRAND.logoSrc}
      alt="The Switch Platform logo"
      width={dimensions.width}
      height={dimensions.height}
      className={`${dimensions.className} shrink-0 object-contain opacity-85 drop-shadow-md`}
      priority={size === "hero" || size === "lg"}
    />
  );

  const content = showWordmark ? (
    <span
      className={`flex min-w-0 items-center gap-3 ${stackWordmark ? "flex-col items-start gap-4" : ""} ${className}`}
    >
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
    <span className={`inline-flex ${className}`}>{logoImage}</span>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} className={`inline-flex items-center ${stackWordmark ? "flex-col items-start" : ""}`}>
      {content}
    </Link>
  );
}
