import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
const code = fs.readFileSync(path.join(root, 'code.js'), 'utf8');
const prototypeMap = JSON.parse(fs.readFileSync(path.join(root, 'prototype-map.json'), 'utf8'));
const svgDir = path.join(root, 'svg');
const files = fs.readdirSync(svgDir).filter(file => file.endsWith('.svg')).sort();

const failures = [];
if (manifest.documentAccess !== 'dynamic-page') failures.push('manifest.documentAccess must be dynamic-page');
if (manifest.networkAccess?.allowedDomains?.[0] !== 'none') failures.push('plugin must remain offline');
if (code.includes('__SVG_ASSETS__') || code.includes('__SCREEN_DEFS__')) failures.push('build placeholders remain in code.js');
if (files.length !== 17) failures.push(`expected 17 SVG files, found ${files.length}`);
if (prototypeMap.role !== 'Product Manager') failures.push('prototype map has wrong role');
if (prototypeMap.start !== '01-splash') failures.push('prototype start must be 01-splash');
if (prototypeMap.screens.length !== 14) failures.push(`expected 14 prototype screens, found ${prototypeMap.screens.length}`);
const screenKeys = new Set(prototypeMap.screens.map(screen => screen.key));
if (screenKeys.size !== prototypeMap.screens.length) failures.push('duplicate prototype screen keys');
for (const screen of prototypeMap.screens) {
  for (const hotspot of screen.hotspots) {
    if (!screenKeys.has(hotspot.to)) failures.push(`${screen.key}: missing destination ${hotspot.to}`);
  }
}

for (const file of files) {
  const svg = fs.readFileSync(path.join(svgDir, file), 'utf8');
  if (!svg.startsWith('<?xml')) failures.push(`${file}: missing XML declaration`);
  if (!svg.includes('<svg') || !svg.trimEnd().endsWith('</svg>')) failures.push(`${file}: malformed root element`);
  if (!svg.includes('viewBox=')) failures.push(`${file}: missing viewBox`);
  if (/Project Manager/i.test(svg)) failures.push(`${file}: wrong role wording`);
}

const requiredFiles = [
  'README.md', 'GITHUB_SETUP.md', 'PORTFOLIO_COPY.md', 'NOTICE.md',
  '.gitignore', '.nojekyll', 'index.html', 'manifest.json', 'code.js',
  'ui.html', 'prototype-map.json', 'preview/01-prototype-board.png',
  'preview/02-product-story.png'
];
for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) failures.push(`missing repository file: ${file}`);
}

for (const file of ['README.md', 'GITHUB_SETUP.md', 'PORTFOLIO_COPY.md', 'NOTICE.md', 'ui.html', 'code.js', 'index.html']) {
  const body = fs.readFileSync(path.join(root, file), 'utf8');
  if (/Project Manager/i.test(body)) failures.push(`${file}: wrong role wording`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(JSON.stringify({
  status: 'ok',
  svgFiles: files.length,
  pluginBytes: Buffer.byteLength(code),
  prototypeScreens: prototypeMap.screens.length,
  prototypeHotspots: prototypeMap.screens.reduce((sum, screen) => sum + screen.hotspots.length, 0),
  role: 'Product Manager',
  offline: true
}, null, 2));
