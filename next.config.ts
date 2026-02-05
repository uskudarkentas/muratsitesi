import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: '*.placehold.co', // Wildcard just in case
      },
      {
        protocol: 'https',
        hostname: 'localhost', // For local https (rare but possible)
      },
      // If user is running on localhost without https, 'next/image' usually doesn't block local files if they are in /public, 
      // but if served via absolute URL:
      {
        protocol: 'http',
        hostname: 'localhost',
      }
    ],
  },
};

export default nextConfig;
