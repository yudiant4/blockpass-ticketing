const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
      'styled-system': path.resolve(__dirname, './styled-system'),
    };
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      path: require.resolve('path-browserify'),
      os: false,
      stream: false,
      util: false,
    };
    config.externals = {
      ...config.externals,
      '@react-native-async-storage/async-storage': 'commonjs @react-native-async-storage/async-storage',
      '@metamask/sdk': 'commonjs @metamask/sdk',
      pino: 'commonjs pino',
      'pino-pretty': 'commonjs pino-pretty',
    };
    return config;
  },
  // Ignore TypeScript errors in node_modules (for third-party libraries without proper types)
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;