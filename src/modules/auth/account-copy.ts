import type { AuthRuntimeMode } from "./types";

interface BuildSignedOutAccountCopyInput {
  runtimeMode: AuthRuntimeMode;
  hasConfiguredProductionProviders: boolean;
  configuredProviderCount: number;
}

export interface SignedOutAccountCopy {
  signedInLabel: string;
  accessLevelLabel: string;
  signedInDetail: string;
  supportSummary: string;
  nextBestAction: string;
  signedOutTitle: string;
  signedOutDescription: string;
}

export function buildSignedOutAccountCopy(
  input: BuildSignedOutAccountCopyInput,
): SignedOutAccountCopy {
  const isPreviewRuntime = input.runtimeMode === "preview-cookie";

  if (input.runtimeMode === "oidc" && input.hasConfiguredProductionProviders) {
    return {
      signedInLabel: "Signed out",
      accessLevelLabel: "Signed out",
      signedInDetail:
        "Sign in through the configured identity provider to keep saved progress, support settings, and session recovery tied to one student profile.",
      supportSummary: `Configured production provider${input.configuredProviderCount === 1 ? "" : "s"} can now anchor support preferences, accessibility settings, and saved session recovery to one learner account.`,
      nextBestAction:
        "Sign in through the production auth provider to keep progress, support settings, and resume links connected.",
      signedOutTitle:
        "Sign in through the production identity provider to open your personal study account.",
      signedOutDescription:
        "Production auth keeps saved sessions, support settings, and account-linked recovery paths connected to the same learner.",
    };
  }

  if (input.runtimeMode === "oidc") {
    return {
      signedInLabel: "Signed out",
      accessLevelLabel: "Signed out",
      signedInDetail:
        "Production auth is active, but a live sign-in provider still needs to be configured for this runtime.",
      supportSummary:
        "Production auth is now the default path, and this runtime still needs at least one live identity provider configured before student sign-in can complete.",
      nextBestAction:
        "Configure at least one production sign-in provider so student accounts can be used outside preview mode.",
      signedOutTitle: "Production auth is now the default sign-in path for this product.",
      signedOutDescription:
        "Local preview still exists for development, but launch readiness now depends on wiring this runtime to a real identity provider instead of relying on demo sign-in.",
    };
  }

  if (input.runtimeMode === "external-header") {
    return {
      signedInLabel: "Signed out",
      accessLevelLabel: "Signed out",
      signedInDetail:
        "Sign in is managed by the trusted upstream identity layer for this environment.",
      supportSummary:
        "Requests in this environment should arrive after sign-in has already been completed by the trusted upstream identity boundary.",
      nextBestAction:
        "Complete sign-in through the trusted upstream identity layer to keep progress and support settings connected.",
      signedOutTitle:
        "Sign-in is managed by the trusted upstream identity layer for this environment.",
      signedOutDescription:
        "Requests in this environment should arrive after sign-in has already been completed by the trusted upstream identity boundary.",
    };
  }

  return {
    signedInLabel: "Guest preview",
    accessLevelLabel: "Guest preview",
    signedInDetail:
      "Sign in to keep saved progress, support settings, and session recovery tied to a named student profile.",
    supportSummary:
      "Sign in to keep support preferences, accessibility settings, and saved session snapshots tied to one student account.",
    nextBestAction: "Sign in to keep progress, support settings, and resume links connected.",
    signedOutTitle: "Sign in to turn the preview into a personal study account.",
    signedOutDescription:
      "The website can still load in preview mode, but signed-in auth is what keeps saved sessions, support settings, and account-linked recovery paths connected to the same learner.",
  };
}
