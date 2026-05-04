import type { NextConfig } from "next";
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /\/api\/menu/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'menu-cache',
        expiration: { maxAgeSeconds: 86400 } // 24 hours
      }
    },
    {
      urlPattern: /\/api\/orders/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'orders-cache',
        networkTimeoutSeconds: 5
      }
    }
  ]
});

const nextConfig: NextConfig = {
  /* config options here */
};

export default withPWA(nextConfig);
