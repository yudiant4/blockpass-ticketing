'use client';

import KageHome from '../components/three/KageHome';

/**
 * Blockpass home = ThreeUI KageLandingPage shell.
 * App routes (marketplace, mint, profile) remain reachable from the overlay.
 */
export default function HomePage() {
  return <KageHome />;
}
