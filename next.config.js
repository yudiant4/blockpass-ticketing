const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // Optional proxy to external Express/Mongo backend.
    // When unset, Next.js /api/* routes (file-backed event store) are used.
    const backend = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL;
    if (!backend) return [];
    const destination = backend.replace(/\/$/, '');
    return [
      {
        source: '/backend-api/:path*',
        destination: `${destination}/api/:path*`,
      },
    ];
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
      'styled-system': path.resolve(__dirname, './styled-system'),
    };

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        path: false,
        os: false,
        stream: false,
        util: false,
      };
    }

    return config;
  },
  typescript: { ignoreBuildErrors: true },
};

module.exports = nextConfig;
