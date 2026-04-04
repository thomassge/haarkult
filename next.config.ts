import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/impressum.html",
        destination: "/impressum",
        permanent: true,
      },
      {
        source: "/datenschutz.html",
        destination: "/datenschutz",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
