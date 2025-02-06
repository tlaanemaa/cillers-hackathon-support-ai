import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["couchbase"],
  compress: true,
};

export default nextConfig;
