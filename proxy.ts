import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import { authConfig } from "./auth.config";
import { isStaffRole } from "@/lib/auth/roles";
import { SHOP_LIVE, isCommercePath } from "@/lib/storefront";

const { auth } = NextAuth(authConfig);

export const proxy = auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth?.user;
  const role = req.auth?.user?.role;

  // Soft launch: the storefront isn't live yet, so commerce routes don't exist.
  if (!SHOP_LIVE && isCommercePath(nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  const requireLogin = () => {
    const url = new URL("/login", nextUrl);
    url.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(url);
  };

  if (nextUrl.pathname.startsWith("/admin") && (!isLoggedIn || !isStaffRole(role))) {
    return requireLogin();
  }

  if (nextUrl.pathname.startsWith("/account") && !isLoggedIn) {
    return requireLogin();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/account",
    "/account/:path*",
    "/shop",
    "/shop/:path*",
    "/product",
    "/product/:path*",
    "/brands",
    "/brands/:path*",
    "/search",
    "/checkout",
    "/checkout/:path*",
    "/cart",
    "/cart/:path*",
  ],
};
