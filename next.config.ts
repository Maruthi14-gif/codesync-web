import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Allow access from network IPs during development (e.g. http://10.x.x.x:3000)
  allowedDevOrigins: ["10.189.131.241"],
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
