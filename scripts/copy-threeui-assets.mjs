import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkgRoot = join(root, 'node_modules/@designcodeio/threeui/lib-dist');
const src = join(pkgRoot, 'assets/landing-pages');
const dest = join(root, 'public/landing-pages');

/**
 * Next.js webpack rejects `new URL("data:...")` in threeui (asset/inline + filename).
 * Rewrite those literals to plain strings so TextureLoader / <img src> still work.
 */
function patchDataUrlModules() {
  const targets = [
    join(pkgRoot, 'shaders/gallery/Gallery.js'),
    join(pkgRoot, 'shaders/section-elements/SectionElements.js'),
  ];

  for (const file of targets) {
    if (!existsSync(file)) continue;
    const before = readFileSync(file, 'utf8');
    if (!before.includes('new URL("data:')) continue;
    const after = before
      .replace(/new URL\("(data:[^"]+)",\s*import\.meta\.url\)\.href/g, '"$1"')
      .replace(/new URL\("(data:[^"]+)"\)/g, '"$1"');
    if (after !== before) {
      writeFileSync(file, after);
      console.log(`[threeui] patched data-URL assets → ${file.replace(root + '/', '')}`);
    }
  }
}

if (!existsSync(src)) {
  console.warn('[threeui] landing-page assets not found — skip copy');
  patchDataUrlModules();
  process.exit(0);
}

mkdirSync(join(root, 'public'), { recursive: true });
rmSync(dest, { recursive: true, force: true });
cpSync(src, dest, { recursive: true });
console.log('[threeui] copied landing-page assets → public/landing-pages');
patchDataUrlModules();
