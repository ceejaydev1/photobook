import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  async redirects() {
    return [
      { source: "/auth/login", destination: "/login", permanent: false },
      { source: "/auth/sign-up", destination: "/signup", permanent: false },
    ];
  },
};

export default nextConfig;