import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined,
  serverExternalPackages: ["lighthouse", "chrome-launcher"],
}

export default nextConfig
