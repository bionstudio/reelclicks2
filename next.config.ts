import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "image.mux.com" },
      { protocol: "https", hostname: "*.b-cdn.net" },
      // Instagram via Behold.so
      { protocol: "https", hostname: "behold.pictures" },
      { protocol: "https", hostname: "*.behold.pictures" },
      { protocol: "https", hostname: "*.cdninstagram.com" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
