import type { NextConfig } from "next";

const isPagesBuild = Boolean(process.env.PAGES_BASE_PATH);

const nextConfig: NextConfig = {
  output: isPagesBuild ? "export" : undefined,
  basePath: process.env.PAGES_BASE_PATH || undefined,
  trailingSlash: isPagesBuild,
  images: { unoptimized: isPagesBuild },
  cacheComponents: !isPagesBuild,
  partialPrefetching: !isPagesBuild,
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
