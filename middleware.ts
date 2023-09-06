import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    const reqPath = req.nextUrl.pathname;
    const token = req.nextauth.token;
    // console.log("START--------");
    // console.log(reqPath);
    // console.log(token);
    // console.log("END-------");

    const unAuthenticatedRoute = ["/sign-in", "/verify-request"];
    const authenticatedRoute = [
      "/profile",
      "constellation",
      "/messier",
      "/register",
    ];

    // User not signed in and requests for protected page
    if (!token && authenticatedRoute.includes(reqPath)) {
      return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
    }

    // User signed in but name and username is empty, always redirect to register page
    if (
      token &&
      (!token.name || !token.username) &&
      !reqPath.startsWith("/register")
    ) {
      return NextResponse.redirect(new URL("/register", req.nextUrl));
    }

    // User signed in and name and username is not empty, and requests for register page (protect register page)
    if (
      token &&
      token.name &&
      token.username &&
      reqPath.startsWith("/register")
    ) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    // User signed in and requests for unauthenticated page
    if (token && unAuthenticatedRoute.includes(reqPath)) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // middleware runs only if authroized returns true
      authorized: ({ req, token }) => true,
    },
    pages: {
      signIn: "/sign-in",
      verifyRequest: "/verify-request",
      newUser: "/register",
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
