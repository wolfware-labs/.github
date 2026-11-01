#!/usr/bin/env node
// Builds profile/assets/wolfware-banner.svg, the header of the org profile.
//
// The honeycomb, logo mark and wordmark come from the landing site repo, so
// the banner matches the wolfware.dev hero. Rerun it after changing any of
// them or the tagline:
//
//   cd scripts && npm install
//   node banner.mjs ../../landing
//
// Text is converted to Poppins outlines because GitHub serves the SVG as an
// image, which can't load web fonts. The fonts are downloaded on each run.
// Needs Node 23.6+ to import the landing site's TypeScript directly.

import { readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import opentype from 'opentype.js'

const landing = process.argv[2]
if (!landing) {
  console.error('usage: node banner.mjs <path to the landing repo>')
  process.exit(1)
}

const root = resolve(landing)
const out = join(import.meta.dirname, '../profile/assets/wolfware-banner.svg')
const { buildHoneycomb } = await import(
  pathToFileURL(join(root, 'src/lib/honeycomb.ts')).href
)
const FONT_URL = 'https://github.com/google/fonts/raw/main/ofl/poppins'

const WIDTH = 1280
const HEIGHT = 400
const NAVY = '#0a1520'
const CYAN = '#10d0ea'
const CX = 1010
const CY = HEIGHT / 2
const CELL = 46

async function loadFont(file) {
  const res = await fetch(`${FONT_URL}/${file}`)
  if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`)
  return opentype.parse(await res.arrayBuffer())
}

const [semibold, light] = await Promise.all([
  loadFont('Poppins-SemiBold.ttf'),
  loadFont('Poppins-Light.ttf'),
])

function text(font, s, x, y, size, attrs) {
  return `<path d="${font.getPath(s, x, y, size).toPathData(2)}" ${attrs}/>`
}

const attrs = (style) =>
  Object.entries(style)
    .filter(([key]) => key !== 'animationDelay')
    .map(
      ([key, value]) =>
        `${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}="${value}"`,
    )
    .join(' ')

const innerSvg = (file) =>
  readFileSync(join(root, file), 'utf8')
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')

const { tiles, points, logoWidth, logoHeight } = buildHoneycomb(CELL, CYAN)

// The ripple layer also gets opacity="0" as an attribute, so renderers that
// ignore CSS animation show the plain comb.
const comb = tiles
  .map(
    (tile) =>
      `<g transform="translate(${(CX + tile.left).toFixed(2)} ${(CY + tile.top).toFixed(2)})">` +
      `<polygon points="${points}" ${attrs(tile.shape)}/>` +
      `<polygon class="r" opacity="0" points="${points}" ${attrs(tile.ripple)} style="animation-delay:${tile.ripple.animationDelay}"/>` +
      `</g>`,
  )
  .join('')

// The logo mark sits in the empty centre cell, as in the hero.
const mark = `<svg x="${(CX - logoWidth / 2).toFixed(2)}" y="${(CY - logoHeight / 2).toFixed(2)}" width="${logoWidth.toFixed(2)}" height="${logoHeight.toFixed(2)}" viewBox="0 0 376 429">${innerSvg('public/logo-mark.svg')}</svg>`

const WORDMARK_HEIGHT = 44
const wordmark = `<svg x="64" y="52" width="${((WORDMARK_HEIGHT * 1249) / 429).toFixed(2)}" height="${WORDMARK_HEIGHT}" viewBox="0 0 1249 429">${innerSvg('public/wolfware-logo-og.svg')}</svg>`

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label="Wolfware. Software infrastructure, from the language up.">
<style>
.r{opacity:0;animation:wfr 8s ease-in-out infinite both}
@keyframes wfr{0%,13%,100%{opacity:0}5%{opacity:.4}}
@media (prefers-reduced-motion:reduce){.r{animation:none}}
</style>
<defs>
<clipPath id="wf-clip"><rect width="${WIDTH}" height="${HEIGHT}" rx="20"/></clipPath>
<radialGradient id="wf-glow" cx="${CX}" cy="${CY}" r="420" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${CYAN}" stop-opacity="0.16"/><stop offset="1" stop-color="${CYAN}" stop-opacity="0"/></radialGradient>
<linearGradient id="wf-fade" x1="0" x2="${WIDTH}" y1="0" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0.5" stop-color="#fff" stop-opacity="0"/><stop offset="0.66" stop-color="#fff" stop-opacity="1"/></linearGradient>
<mask id="wf-mask"><rect width="${WIDTH}" height="${HEIGHT}" fill="url(#wf-fade)"/></mask>
</defs>
<g clip-path="url(#wf-clip)">
<rect width="${WIDTH}" height="${HEIGHT}" fill="${NAVY}"/>
<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#wf-glow)"/>
<g mask="url(#wf-mask)">${comb}</g>
${mark}
<rect y="${HEIGHT - 1}" width="${WIDTH}" height="1" fill="${CYAN}" fill-opacity="0.2"/>
</g>
${wordmark}
${text(semibold, 'Software infrastructure,', 64, 206, 56, 'fill="#ffffff"')}
${text(semibold, 'from the language up.', 64, 274, 56, `fill="${CYAN}"`)}
${text(light, 'Developer tools in Rust, built in the open.', 64, 330, 22, 'fill="#ffffff" fill-opacity="0.7"')}
</svg>
`

writeFileSync(out, svg)
console.log(`wrote ${out} (${Math.round(svg.length / 1024)} KiB)`)
