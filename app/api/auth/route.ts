import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const clientId = process.env.OAUTH_CLIENT_ID;
  if (!clientId) {
    return new NextResponse(
      "Missing OAUTH_CLIENT_ID environment variable.",
      { status: 500 }
    );
  }

  const redirectUri = `${request.nextUrl.origin}/api/callback`;
  const scope = request.nextUrl.searchParams.get("scope") || "repo,user";

  const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", scope);

  return NextResponse.redirect(authorizeUrl.toString());
}
