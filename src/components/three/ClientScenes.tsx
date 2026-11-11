'use client';

import dynamic from 'next/dynamic';
import type { CSSProperties, ReactNode } from 'react';

const loadingFallback = (
  <div
    style={{
      width: '100%',
      height: '100%',
      minHeight: 120,
      background: 'radial-gradient(circle at 30% 20%, #1a2a3a, #080a0f 70%)',
    }}
  />
);

export const EmeraldHorizon = dynamic(
  () => import('@designcodeio/threeui/components/EmeraldHorizonBackground').then((m) => m.EmeraldHorizonBackground),
  { ssr: false, loading: () => loadingFallback }
);

export const NebulaBg = dynamic(
  () => import('@designcodeio/threeui/components/NebulaBackground').then((m) => m.NebulaBackground),
  { ssr: false, loading: () => loadingFallback }
);

export const ParticleWordmark = dynamic(
  () => import('@designcodeio/threeui/components/ParticleWordmark').then((m) => m.ParticleWordmark),
  { ssr: false, loading: () => loadingFallback }
);

export const NeonTypography = dynamic(
  () => import('@designcodeio/threeui/components/NeonTypography').then((m) => m.NeonTypography),
  { ssr: false, loading: () => loadingFallback }
);

export const BrandOrbs = dynamic(
  () => import('@designcodeio/threeui/components/BrandOrbs').then((m) => m.BrandOrbs),
  { ssr: false, loading: () => loadingFallback }
);

export const LiquidMetalButton = dynamic(
  () => import('@designcodeio/threeui/components/LiquidMetalButton').then((m) => m.LiquidMetalButton),
  { ssr: false, loading: () => <button style={{ opacity: 0.5 }}>…</button> }
);

export const LaunchButton = dynamic(
  () => import('@designcodeio/threeui/components/LaunchButton').then((m) => m.LaunchButton),
  { ssr: false, loading: () => loadingFallback }
);

export const SpinningBorderButton = dynamic(
  () => import('@designcodeio/threeui/components/SpinningBorderButton').then((m) => m.SpinningBorderButton),
  { ssr: false, loading: () => loadingFallback }
);

export const GradientPillButton = dynamic(
  () => import('@designcodeio/threeui/components/GradientPillButton').then((m) => m.GradientPillButton),
  { ssr: false, loading: () => loadingFallback }
);

export const GlassmorphismCta = dynamic(
  () => import('@designcodeio/threeui/components/GlassmorphismCta').then((m) => m.GlassmorphismCta),
  { ssr: false, loading: () => loadingFallback }
);

export const ConnectivityGraph = dynamic(
  () => import('@designcodeio/threeui/components/ConnectivityGraph').then((m) => m.ConnectivityGraph),
  { ssr: false, loading: () => loadingFallback }
);

export const GatewayFlow = dynamic(
  () => import('@designcodeio/threeui/components/GatewayFlow').then((m) => m.GatewayFlow),
  { ssr: false, loading: () => loadingFallback }
);

export const ParticleNetwork = dynamic(
  () => import('@designcodeio/threeui/components/ParticleNetwork').then((m) => m.ParticleNetwork),
  { ssr: false, loading: () => loadingFallback }
);

export const DataField = dynamic(
  () => import('@designcodeio/threeui/components/DataField').then((m) => m.DataField),
  { ssr: false, loading: () => loadingFallback }
);

export const UplinkLoader = dynamic(
  () => import('@designcodeio/threeui/components/UplinkLoader').then((m) => m.UplinkLoader),
  { ssr: false, loading: () => loadingFallback }
);

export const NewsletterFooter = dynamic(
  () => import('@designcodeio/threeui/components/NewsletterFooterSection').then((m) => m.NewsletterFooterSection),
  { ssr: false, loading: () => loadingFallback }
);

export const AnimatedTopDock = dynamic(
  () => import('@designcodeio/threeui/components/AnimatedTopDock').then((m) => m.AnimatedTopDock),
  { ssr: false, loading: () => loadingFallback }
);

export const DotMatrixBackground = dynamic(
  () => import('@designcodeio/threeui/components/DotMatrixBackground').then((m) => m.DotMatrixBackground),
  { ssr: false, loading: () => loadingFallback }
);

export const FluxVortex = dynamic(
  () => import('@designcodeio/threeui/components/FluxVortex').then((m) => m.FluxVortex),
  { ssr: false, loading: () => loadingFallback }
);

export const KageLandingPage = dynamic(
  () =>
    import('@designcodeio/threeui/components/KageLandingPage').then(
      (m) => m.KageLandingPage
    ),
  { ssr: false, loading: () => loadingFallback }
);

export function SceneFrame({
  children,
  height = 280,
  className,
  style,
}: {
  children: ReactNode;
  height?: number | string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height,
        overflow: 'hidden',
        borderRadius: 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
