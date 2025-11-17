import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL("https://cdn.discordapp.com/icons/**"),
      new URL("https://styles.redditmedia.com/**"),
      {
        protocol: "https",
        hostname: "jojodnd-bucket.s3.us-east-1.amazonaws.com"
      },
      {
        protocol: "https",
        hostname: "jojodnd-demo-bucket.s3.us-east-1.amazonaws.com"
      }
    ]
  },
  experimental: {
    useCache: true,
    serverActions: {
      bodySizeLimit: '5mb'
    }
  }
};

export default nextConfig;
