import { SwitchBrandLogo } from "@/components/switch-brand-logo";

interface SignInBrandMarkProps {
  href?: string;
}

export function SignInBrandMark({ href = "/" }: SignInBrandMarkProps) {
  return (
    <SwitchBrandLogo href={href} size="md" />
  );
}
