export type SupportedLocale = "en-GB";

export interface LocalePreference {
  userId: string;
  locale: SupportedLocale;
}

export interface RouteCopy {
  label: string;
  description: string;
}

export interface RecommendationCategoryCopy {
  actionLabel: string;
  eyebrow: string;
}

export interface AppCopyCatalog {
  locale: SupportedLocale;
  routes: Record<string, RouteCopy>;
  recommendationCategories: Record<string, RecommendationCategoryCopy>;
}
