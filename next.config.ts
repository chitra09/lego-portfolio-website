import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Sample content uses local SVG placeholders until real photos are added.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async rewrites() {
    return [{ source: "/admin", destination: "/admin/index.html" }];
  },
};

export default nextConfig;
