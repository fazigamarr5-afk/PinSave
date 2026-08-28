import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.pinimg.com",
      },
    ],
  },
};

export default nextConfig;
