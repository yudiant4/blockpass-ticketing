'use client';

import dynamic from 'next/dynamic';

const loading = () => <div style={{ minHeight: 120, background: '#0a0f18' }} />;

const DiagnosticsPanel = dynamic(
  () => import('@designcodeio/threeui/components/DiagnosticsPanel').then((m) => m.DiagnosticsPanel),
  { ssr: false, loading }
);

const PerformanceGauges = dynamic(
  () => import('@designcodeio/threeui/components/PerformanceGauges').then((m) => m.PerformanceGauges),
  { ssr: false, loading }
);

export function DiagnosticsFrame() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '100vh', opacity: 0.35 }}>
      <DiagnosticsPanel />
    </div>
  );
}

export function PerformanceFrame() {
  return (
    <div style={{ width: '100%', height: 180, borderRadius: 12, overflow: 'hidden' }}>
      <PerformanceGauges />
    </div>
  );
}
