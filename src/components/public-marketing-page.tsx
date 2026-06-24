import type { ReactNode } from "react";

import { MarketingSiteHeader } from "@/components/marketing-site-header";
import { MarketingSiteFooter } from "@/components/mock-idea/marketing-site-footer";

interface PublicMarketingPageProps {
  children: ReactNode;
  isAuthenticated?: boolean;
}

/** Public routes — shared Study Atelier marketing chrome (C-3/C-4). */
export function PublicMarketingPage({ children, isAuthenticated = false }: PublicMarketingPageProps) {
  return (
    <main className="min-h-screen bg-stone-100 text-stone-950">
      <MarketingSiteHeader isAuthenticated={isAuthenticated} />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
      <MarketingSiteFooter />
    </main>
  );
}
