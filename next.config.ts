import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL("https://cdn.discordapp.com/icons/**"),
      new URL("https://styles.redditmedia.com/**")
    ]
  },
  experimental: {
    useCache: true,
  }
};

export default nextConfig;
