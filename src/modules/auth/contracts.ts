import type { AccountOverview, AuthSession, SignInOption } from "./types";

export type AuthContractRoute =
  | "GET /auth/session"
  | "POST /auth/session"
  | "DELETE /auth/session"
  | "GET /auth/providers"
  | "GET /account/overview";

export interface GetAuthSessionResponse {
  session: AuthSession;
}

export interface GetAuthProvidersResponse {
  providers: SignInOption[];
}

export interface GetAccountOverviewResponse {
  account: AccountOverview;
}
