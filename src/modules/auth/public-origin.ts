export function getAuthPublicOrigin(requestUrl: URL): URL {
  const configuredBaseUrl = process.env.SWITCH_AUTH_BASE_URL?.trim();

  if (configuredBaseUrl) {
    return new URL(configuredBaseUrl);
  }

  return requestUrl;
}

export function getAuthCallbackUrl(requestUrl: URL): string {
  return new URL("/api/auth/callback", getAuthPublicOrigin(requestUrl)).toString();
}

export function getAuthRedirectUrl(requestUrl: URL, path: string): URL {
  return new URL(path, getAuthPublicOrigin(requestUrl));
}
