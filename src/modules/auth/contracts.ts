import type { AccountOverview, AuthRuntimeConfig, AuthSession, SignInOption } from "./types";

export type AuthContractRoute =
  | "GET /auth/session"
  | "GET /auth/providers"
  | "GET /account/overview";

export interface GetAuthSessionResponse {
  session: AuthSession;
  runtime: AuthRuntimeConfig;
}

export interface GetAuthProvidersResponse {
  providers: SignInOption[];
  runtime: AuthRuntimeConfig;
}

export interface GetAccountOverviewResponse {
  account: AccountOverview;
}
