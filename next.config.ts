import type { NextConfig } from "next";
import { execSync } from "node:child_process";

/** Short commit id of the build, for the in-app version label. */
function buildCommit(): string {
  if (process.env.VERCEL_GIT_COMMIT_SHA) {
    return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7);
  }
  try {
    return execSync("git rev-parse --short HEAD").toString().trim();
  } catch {
    return "dev";
  }
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_COMMIT: buildCommit(),
  },
};

export default nextConfig;
