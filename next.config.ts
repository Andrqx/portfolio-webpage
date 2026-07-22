import type { NextConfig } from "next";

const isGithubPages = process.env.DEPLOY_TARGET === "github-pages";
const basePath = isGithubPages ? "/portfolio-webpage" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath,
  images: { unoptimized: true },
  // Static export writes each route as page/index.html rather than page.html.
  // GitHub Pages can't serve page.html at a trailing-slash URL, so without
  // this, /work/[slug]/ 404s even though /work/[slug] (no slash) works —
  // this keeps every route consistent with how the homepage already behaves.
  trailingSlash: true,
};

export default nextConfig;
