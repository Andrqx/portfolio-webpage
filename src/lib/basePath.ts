// Mirrors the basePath logic in next.config.ts. next/image doesn't
// auto-prepend basePath to string src values when images.unoptimized is set,
// so static image paths need this applied manually.
export const basePath =
  process.env.DEPLOY_TARGET === "github-pages" ? "/portfolio-webpage" : "";
