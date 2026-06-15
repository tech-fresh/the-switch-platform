import type { Metadata } from "next";
import { AccessibilityRuntime } from "@/components/accessibility-runtime";
import { getRequestUserId } from "@/modules/auth/request";
import { getAccessibilitySnapshot } from "@/modules/accessibility/service";
import { getLineHeightValue } from "@/modules/accessibility/presentation";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Switch Platform",
  description: "GCSE revision, progress tracking and exam readiness platform.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userId = await getRequestUserId();
  const snapshot = await getAccessibilitySnapshot(userId);

  return (
    <html
      lang="en"
      data-switch-colour-scheme={snapshot.settings.preferredColourScheme}
      data-switch-high-contrast={String(snapshot.settings.highContrastModeEnabled)}
      data-switch-focus-mode={String(snapshot.settings.focusModeEnabled)}
      data-switch-reduced-distraction={String(snapshot.settings.reducedDistractionModeEnabled)}
      data-switch-dyslexia-font={String(snapshot.settings.dyslexiaFriendlyFontEnabled)}
      style={{ fontSize: `${snapshot.settings.preferredFontSize}px` }}
    >
      <body style={{ lineHeight: getLineHeightValue(snapshot.settings.lineSpacing) }}>
        <AccessibilityRuntime initialSnapshot={snapshot}>{children}</AccessibilityRuntime>
      </body>
    </html>
  );
}
