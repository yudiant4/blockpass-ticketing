const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [{
      source: '/api/:path*',
      destination: 'http://129.226.95.94:3002/api/:path*',
    }];
  },
  webpack: (config, { isServer }) => {
    // Aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
      'styled-system': path.resolve(__dirname, './styled-system'),
    };

    // Client-side fallback for Node core modules used by MetaMask SDK
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