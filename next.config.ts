import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

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
  allowedDevOrigins: ['192.168.0.3'],
  experimental: {
    useCache: true,
    serverActions: {
      bodySizeLimit: '5125kb'
    }
  }
};
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
