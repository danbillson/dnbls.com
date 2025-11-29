const DEFAULT_SITE_URL = "https://dnbls.com";

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
}

export function absoluteUrl(path: string) {
  return new URL(path, getSiteUrl()).toString();
}

export function ogImageUrl(subtitle?: string) {
  const url = new URL("/api/og", getSiteUrl());

  if (subtitle) {
    url.searchParams.set("subtitle", subtitle);
  }

  return url.toString();
}
