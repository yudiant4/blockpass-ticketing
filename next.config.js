const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
      'styled-system': path.resolve(__dirname, './styled-system'),
    };
    // Externalize heavy Node modules (MetaMask SDK, pino)
    config.externals = {
      ...config.externals,
      '@react-native-async-storage/async-storage': 'commonjs @react-native-async-storage/async-storage',
      '@metamask/sdk': 'commonjs @metamask/sdk',
      pino: 'commonjs pino',
      'pino-pretty': 'commonjs pino-pretty',
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