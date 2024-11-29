import { type NextRequest, NextResponse } from "next/server";

import { checkCookies } from "@/server/auth";

const publicPaths = ["/", "/start", "/api/sso"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is public
  if (publicPaths.includes(pathname) || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Get cookies from request
  const cookieStore = request.cookies;
  const laravelSession = cookieStore.get("laravel_session")?.value;
  const xsrfToken = cookieStore.get("XSRF-TOKEN")?.value;
  const casAuth = cookieStore.get("CASAuth")?.value;
  const userId = cookieStore.get("userId")?.value;

  // If any required cookie is missing, redirect to start
  if (!laravelSession || !xsrfToken || !casAuth || !userId) {
    // Store the original URL to redirect back after login
    const startUrl = new URL("/start", request.url);
    startUrl.searchParams.set("callbackUrl", request.url);

    return NextResponse.redirect(startUrl);
  }

  // Verify cookies are valid
  const isValid = await checkCookies(laravelSession, xsrfToken, casAuth);
  if (!isValid) {
    // Clear invalid cookies when redirecting
    const response = NextResponse.redirect(new URL("/start", request.url));
    response.cookies.delete("laravel_session");
    response.cookies.delete("XSRF-TOKEN");
    response.cookies.delete("CASAuth");
    response.cookies.delete("userId");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
};
