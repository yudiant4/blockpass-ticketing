import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  include: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  exclude: [],

  theme: {
    extend: {
      tokens: {
        colors: {
          bg: { value: '#080a0f' },
          surface: { value: '#0d1017' },
          border: { value: '#1a2030' },
          neon: { value: '#00f5c4' },
          neon2: { value: '#7b2fff' },
          neon3: { value: '#ff3d6e' },
          text: { value: '#e8eaf0' },
          muted: { value: '#5a6070' },
          card: { value: '#0f1520' },
          emerald: { value: '#10b981' },
          cyan: { value: '#06b6d4' },
          purple: { value: '#a855f7' },
          yellow: { value: '#facc15' },
          red: { value: '#ef4444' },
          white: { value: '#ffffff' },
          black: { value: '#000000' },
          slate: { value: '#64748b' },
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