import { NextRequest, NextResponse } from "next/server";

function unauthorized() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Lego Gallery Admin"' },
  });
}

export function middleware(request: NextRequest) {
  const user = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;

  // If not configured, fail closed rather than leaving /admin wide open.
  if (!user || !password) return unauthorized();

  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Basic ")) return unauthorized();

  const decoded = atob(authHeader.slice("Basic ".length));
  const separatorIndex = decoded.indexOf(":");
  const suppliedUser = decoded.slice(0, separatorIndex);
  const suppliedPassword = decoded.slice(separatorIndex + 1);

  if (suppliedUser !== user || suppliedPassword !== password) {
    return unauthorized();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/auth", "/api/callback"],
};
