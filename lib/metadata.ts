import { headers } from "next/headers";

const DEFAULT_SITE_URL = "https://dnbls.com";

export async function getSiteUrl() {
  // Try to get the current request URL from headers
  try {
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = headersList.get("x-forwarded-proto") || "https";

    if (host) {
      return `${protocol}://${host}`;
    }

    // Fallback to Referer header if host is not available
    const referer = headersList.get("referer");
    if (referer) {
      try {
        const refererUrl = new URL(referer);
        return `${refererUrl.protocol}//${refererUrl.host}`;
      } catch {
        // Invalid referer URL, continue to fallback
      }
    }
  } catch {
    // headers() can only be called in Server Components/Server Actions
    // Fall back to environment variable or default
  }

  return process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
}

export async function absoluteUrl(path: string) {
  return new URL(path, await getSiteUrl()).toString();
}

export async function ogImageUrl(subtitle?: string) {
  const url = new URL("/api/og", await getSiteUrl());

  if (subtitle) {
    url.searchParams.set("subtitle", subtitle);
  }

  return url.toString();
}
