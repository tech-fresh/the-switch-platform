import Link from "next/link";

interface SignInBrandMarkProps {
  href?: string;
}

export function SignInBrandMark({ href = "/" }: SignInBrandMarkProps) {
  return (
    <Link href={href} className="inline-flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-white shadow-sm shadow-violet-200/50"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M12 2.5 14.8 9l6.7.6-5.1 4.2 1.6 6.5L12 17.8 6 20.3l1.6-6.5-5.1-4.2 6.7-.6L12 2.5Z" />
        </svg>
      </span>
      <span className="text-xl font-bold tracking-[0.18em] text-violet-700">THE SWITCH</span>
    </Link>
  );
}
