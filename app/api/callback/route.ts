import { NextRequest, NextResponse } from "next/server";

function renderPage(script: string) {
  const response = new NextResponse(
    `<!doctype html><html><body><script>${script}</script></body></html>`,
    { headers: { "Content-Type": "text/html" } }
  );
  response.cookies.delete("oauth_state");
  return response;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const storedState = request.cookies.get("oauth_state")?.value;
  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;

  if (!state || !storedState || state !== storedState) {
    return new NextResponse("Invalid or missing OAuth state.", { status: 400 });
  }
  if (!code) {
    return new NextResponse("Missing authorization code.", { status: 400 });
  }
  if (!clientId || !clientSecret) {
    return new NextResponse(
      "Missing OAUTH_CLIENT_ID / OAUTH_CLIENT_SECRET environment variables.",
      { status: 500 }
    );
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });
  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    const message = tokenData.error_description || "Failed to obtain access token.";
    const payload = JSON.stringify({ provider: "github", message });
    return renderPage(`
      (function() {
        function receiveMessage(e) {
          window.opener.postMessage('authorization:github:error:' + JSON.stringify(${payload}), e.origin);
          window.removeEventListener('message', receiveMessage, false);
        }
        window.addEventListener('message', receiveMessage, false);
        window.opener.postMessage('authorizing:github', '*');
      })();
    `);
  }

  const payload = JSON.stringify({
    token: tokenData.access_token,
    provider: "github",
  });

  return renderPage(`
    (function() {
      function receiveMessage(e) {
        window.opener.postMessage('authorization:github:success:' + JSON.stringify(${payload}), e.origin);
        window.removeEventListener('message', receiveMessage, false);
      }
      window.addEventListener('message', receiveMessage, false);
      window.opener.postMessage('authorizing:github', '*');
    })();
  `);
}
