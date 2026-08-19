import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Emit .next/standalone so the runtime image can boot with `node server.js`
  // and without node_modules, matching how the other apps on this VPS ship.
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/media/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "8000", pathname: "/media/**" },
    ],
  },
};

export default nextConfig;
