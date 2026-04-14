import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ssl.gstatic.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'crests.football-data.org',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
