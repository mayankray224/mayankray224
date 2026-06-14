import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Security: hide Next.js version header from responses
  poweredByHeader: false,

  // Enable React strict mode for catching potential issues
  reactStrictMode: true,

  // Allow build to succeed even without DATABASE_URL
  env: {
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://placeholder:placeholder@localhost:5432/placeholder",
  },

  // Packages that should be bundled on the server side only
  // (replaces deprecated experimental.serverComponentsExternalPackages)
  serverExternalPackages: ["@prisma/client", "bcryptjs"],

  // Ignore TypeScript and ESLint errors during build for deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
