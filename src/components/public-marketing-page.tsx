import type { ReactNode } from "react";

import { MarketingSiteHeader } from "@/components/marketing-site-header";
import { MarketingSiteFooter } from "@/components/mock-idea/marketing-site-footer";
import { mark32Ui } from "@/components/streamlined/mark32-ui";

interface PublicMarketingPageProps {
  children: ReactNode;
  isAuthenticated?: boolean;
}

/** Public routes — shared marketing chrome aligned to the current light-mode product shell. */
export function PublicMarketingPage({ children, isAuthenticated = false }: PublicMarketingPageProps) {
  return (
    <main className={mark32Ui.publicMain}>
      <MarketingSiteHeader isAuthenticated={isAuthenticated} />
      <div className={mark32Ui.contentWrap}>{children}</div>
      <MarketingSiteFooter />
    </main>
  );
}
