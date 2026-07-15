"use client";

import React, { Suspense } from "react";
import NextLink from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: string;
  prefetch?: boolean;
}

export function Link({ to, prefetch, ...props }: LinkProps) {
  return <NextLink href={to} prefetch={prefetch} {...props} />;
}

export function useNavigate() {
  const router = useRouter();
  return (to: string | number) => {
    if (typeof to === 'number') {
      if (to === -1) {
        router.back();
      }
    } else {
      router.push(to);
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
