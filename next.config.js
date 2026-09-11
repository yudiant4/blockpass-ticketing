const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Externalize heavy Node modules (MetaMask SDK, pino) – Vercel-friendly array syntax
  externals: {
    '@react-native-async-storage/async-storage': 'commonjs @react-native-async-storage/async-storage',
    '@metamask/sdk': 'commonjs @metamask/sdk',
    pino: 'commonjs pino',
    'pino-pretty': 'commonjs pino-pretty',
  },
  webpack: (config, { isServer }) => {
    // Aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
      'styled-system': path.resolve(__dirname, './styled-system'),
    };
    // Client‑side fallback for Node core modules used by MetaMask SDK
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
