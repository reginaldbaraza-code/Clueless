import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/photo-**",
        search: "",
        port: "",
      },
      {
        protocol: "https",
        hostname: "replicate.delivery",
        pathname: "/**",
        search: "",
        port: "",
      },
    ],
  },
};

export default nextConfig;
