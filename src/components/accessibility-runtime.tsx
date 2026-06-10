"use client";

import { useEffect, useState } from "react";
import type { AccessibilitySnapshot } from "@/modules/accessibility/types";
import { getLineHeightValue } from "@/modules/accessibility/presentation";

export const ACCESSIBILITY_UPDATED_EVENT = "switch:accessibility-updated";

interface AccessibilityRuntimeProps {
  initialSnapshot: AccessibilitySnapshot;
  children: React.ReactNode;
}

function applyAccessibilitySnapshot(snapshot: AccessibilitySnapshot) {
  const { settings } = snapshot;
  const root = document.documentElement;
  const body = document.body;

  root.dataset.switchColourScheme = settings.preferredColourScheme;
  root.dataset.switchHighContrast = String(settings.highContrastModeEnabled);
  root.dataset.switchFocusMode = String(settings.focusModeEnabled);
  root.dataset.switchReducedDistraction = String(settings.reducedDistractionModeEnabled);
  root.dataset.switchDyslexiaFont = String(settings.dyslexiaFriendlyFontEnabled);
  root.style.fontSize = `${settings.preferredFontSize}px`;
  root.style.setProperty("--switch-line-height", getLineHeightValue(settings.lineSpacing));
  body.style.lineHeight = getLineHeightValue(settings.lineSpacing);
}

export function AccessibilityRuntime({
  initialSnapshot,
  children,
}: AccessibilityRuntimeProps) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);

  useEffect(() => {
    applyAccessibilitySnapshot(snapshot);
  }, [snapshot]);

  useEffect(() => {
    const handleAccessibilityUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<AccessibilitySnapshot>;

      if (customEvent.detail) {
        setSnapshot(customEvent.detail);
      }
    };

    window.addEventListener(ACCESSIBILITY_UPDATED_EVENT, handleAccessibilityUpdated);

    return () => {
      window.removeEventListener(ACCESSIBILITY_UPDATED_EVENT, handleAccessibilityUpdated);
    };
  }, []);

  return <>{children}</>;
}
