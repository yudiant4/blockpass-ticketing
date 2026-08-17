import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  include: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  exclude: [],

  theme: {
    extend: {
      tokens: {
        colors: {
          bg: { DEFAULT: { value: '#080a0f' } },
          surface: { DEFAULT: { value: '#0d1017' } },
          border: { DEFAULT: { value: '#1a2030' } },
          neon: { DEFAULT: { value: '#00f5c4' } },
          neon2: { DEFAULT: { value: '#7b2fff' } },
          neon3: { DEFAULT: { value: '#ff3d6e' } },
          text: { DEFAULT: { value: '#e8eaf0' } },
          muted: { DEFAULT: { value: '#5a6070' } },
          card: { DEFAULT: { value: '#0f1520' } },
        },
        fonts: {
          syne: { value: "'Syne', sans-serif" },
          mono: { value: "'Space Mono', monospace" },
        },
      },
      keyframes: {
        pulseBlob: {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(1.2)', opacity: '1' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        scanLine: {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },

  outdir: 'styled-system',
  jsxFramework: 'react',
});