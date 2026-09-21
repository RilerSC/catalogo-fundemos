import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/programas",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
