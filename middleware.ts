import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    const reqPath = req.nextUrl.pathname;
    const token = req.nextauth.token;

    const unAuthenticatedRoute = ["/auth/sign-in", "/auth/verify-request"];
    const authenticatedRoute = [
      "/settings",
      "/play/",
      "/auth/register",
      "/auth/sign-out",
      "/statistics",
    ];

    // REGISTRATION & AUTHENTICATION VALIDATION ON REQUEST PATH

    // Non signed in user requests for authenticated only page
    if (!token && authenticatedRoute.some((path) => reqPath.startsWith(path))) {
      return NextResponse.redirect(new URL("/auth/sign-in", req.nextUrl));
    }

    // Non Registered user (data is not complete, name and username is empty) requests for non register page
    if (
      token &&
      (!token.name || !token.username) &&
      !reqPath.startsWith("/auth/register")
    ) {
      return NextResponse.redirect(new URL("/auth/register", req.nextUrl));
    }

    // Registered user (data is complete, name and username is not empty) requests for register page
    if (
      token &&
      token.name &&
      token.username &&
      reqPath.startsWith("/auth/register")
    ) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    // Authenticated user requests for unauthenticated only page
    if (
      token &&
      unAuthenticatedRoute.some((path) => reqPath.startsWith(path))
    ) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    // CUSTOM REDIRECTS (AFTER PREVIOUS VALIDATIONS)

    // User requests /leaderboard, redirect to default /leaderboard/constellation
    if (reqPath === "/leaderboard") {
      return NextResponse.redirect(
        new URL("/leaderboard/constellation", req.nextUrl)
      );
    }

    // User requests /settings, redirect to /settings/profile
    if (reqPath === "/settings") {
      return NextResponse.redirect(new URL("/settings/profile", req.nextUrl));
    }

    // User requests /statistics, redirect to /statistics/constellation
    if (reqPath === "/statistics") {
      return NextResponse.redirect(
        new URL("/statistics/constellation", req.nextUrl)
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // middleware runs only if authorized() returns true
      authorized: ({ req, token }) => true,
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - icon.ico (PWA icon file)
     * - robots.txt (SEO file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|icon.ico|robots.txt).*)",
  ],
};
