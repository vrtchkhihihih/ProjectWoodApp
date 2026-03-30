import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "woodapp.ru",
      },
    ],
  },
};

export default nextConfig;
