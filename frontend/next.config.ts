import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow HMR / dev resources to be loaded from these origin(s).
  // Update to the IP/port you use to access the dev server from another device.
  allowedDevOrigins: [
    "http://192.168.18.100:3000",
    "http://192.168.18.100:3001",
  ],
};

export default nextConfig;
