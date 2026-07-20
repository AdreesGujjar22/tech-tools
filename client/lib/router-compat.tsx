"use client";

import React, { Suspense } from "react";
import NextLink from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export const locales = ["en", "es"] as const;
export type RouteLocale = (typeof locales)[number];

function getPathLocale(pathname: string | null | undefined): RouteLocale {
  const segment = pathname?.split("/")[1];
  return segment === "es" ? "es" : "en";
}

export function stripLocalePrefix(pathname: string) {
  return pathname.replace(/^\/(?:en|es)(?=\/|$)/, "") || "/";
}

export function withLocalePath(to: string, locale: RouteLocale) {
  if (!to.startsWith("/") || to.startsWith("//") || to.startsWith("/admin") || to.startsWith("/api") || /^\/(?:en|es)(?:\/|$)/.test(to)) {
    return to;
  }
  return `/${locale}${to === "/" ? "" : to}`;
}

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: string;
  prefetch?: boolean;
}

export function Link({ to, prefetch, ...props }: LinkProps) {
  const pathname = usePathname();
  const locale = getPathLocale(pathname);
  return <NextLink href={withLocalePath(to, locale)} prefetch={prefetch} {...props} />;
}

export function useNavigate() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = getPathLocale(pathname);
  return (to: string | number) => {
    if (typeof to === "number") {
      if (to === -1) router.back();
    } else {
      router.push(withLocalePath(to, locale));
    }
  };
}

function UseLocationContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return {
    pathname: pathname || "/",
    search: searchParams?.toString() ? `?${searchParams.toString()}` : "",
    hash: "",
    state: null,
    key: "",
  };
}

export function useLocation() {
  try {
    return UseLocationContent();
  } catch (e) {
    return {
      pathname: "/",
      search: "",
      hash: "",
      state: null,
      key: "",
    };
  }
}
