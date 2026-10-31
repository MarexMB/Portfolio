import { pages } from '../config';

// Simplified manga-inspired fittings, drawn specifically for the menu.
const fittings: Record<string, { wrap: string; base: string; metal: string; sheath: string; guard: string; detail: string }> = {
  magatsumi: {
    wrap: '#eee9dd', base: '#171719', metal: '#c2a04c', sheath: '#101113',
    guard: '<path d="M259 40C239 31 241 12 251 16Q260 4 267 17C281 10 282 29 264 40C282 50 279 69 268 63Q260 76 251 64C237 70 240 49 259 40Z" fill="#c2a04c" stroke="#ebce79"/><path d="M260 18v44m-8-40 16 36m0-36-16 36" stroke="#75602d" fill="none"/>',
    detail: '<path d="m45 27 12 25m17-25 12 26m17-26 12 26m17-27 12 27m17-27 12 27m17-28 12 28" stroke="#343236" stroke-width="1.5"/><path d="M25 36q34-15 63 4t61-2 69 2" fill="none" stroke="#444046" stroke-width="1.5"/><path d="M202 25v31m7-31v31m7-31v31" stroke="#40353b" stroke-width="4"/>'
  },
  enten: {
    wrap: '#141416', base: '#e6e3d9', metal: '#c2a04c', sheath: '#101214',
    guard: '<path d="M256 15h10v10h9v8h-9v14h9v8h-9v10h-10V55h-9v-8h9V33h-9v-8h9Z" fill="#c2a04c" stroke="#ebce79"/><path d="M261 20v40" stroke="#f0d791"/>',
    detail: '<path d="M26 29 231 28M26 49 231 51" stroke="#555c60" fill="none"/><path d="M207 26v28m5-28v28m5-28v28" stroke="#363b3e" stroke-width="3"/><path d="M210 54q20 13 30 3" fill="none" stroke="#555b5d" stroke-width="3"/>'
  },
  tobimune: {
    wrap: '#181a20', base: '#c6c4b9', metal: '#777a83', sheath: '#22242c',
    guard: '<path d="M260 40q-21-13-13-26 13 2 16 16 5-18 17-18 3 19-15 28 19 9 15 28-13-1-17-17-4 16-16 15-8-14 13-26Z" fill="#20232b" stroke="#888a93"/><path d="m250 19 11 21-11 21m26-43-13 22 13 22" fill="none" stroke="#515662"/>',
    detail: '<path d="M26 30 230 29" stroke="#787b86" opacity=".6"/><path d="M190 28v26m6-26v26m6-26v26m6-26v26" stroke="#a9a8a3" stroke-width="3"/><path d="M197 54q8 19 26 15l-9-7 15 1" fill="none" stroke="#777c8a" stroke-width="2"/>'
  }
};

export function KatanaMenu(container: HTMLElement) {
  container.innerHTML = pages.map((page, i) => {
    const design = fittings[page.sword] ?? fittings.enten;
    const bladeOutline = 'M17 43Q25 30 47 28L254 28V52L45 50Z';
    const temperLine = page.sword === 'tobimune'
      ? 'M17 43H254'
      : 'M17 43L35 44Q43 40 50 45T66 45T82 46T98 46T114 46T130 47T146 47T162 47T178 48T194 48T210 48T226 49L254 49';
    const steel = page.sword === 'magatsumi'
      ? { upper: '#b9bec4', lower: '#cdd1d5' }
      : page.sword === 'enten'
        ? { upper: '#969ea7', lower: '#e7e9eb' }
        : { upper: '#929ba5', lower: '#e1e5e9' };
    return `
    <a class="sword-link sword-${page.sword}" href="${page.href}" aria-label="${page.title}">
      <svg viewBox="0 0 560 80" aria-hidden="true">
        <defs>
          <clipPath id="blade-clip-${i}"><path d="${bladeOutline}"/></clipPath>
          <pattern id="wrap-${i}" width="16" height="24" patternUnits="userSpaceOnUse"><rect width="16" height="24" fill="${design.base}"/><path d="M0 0 8 12 0 24M16 0 8 12 16 24" fill="none" stroke="${design.wrap}" stroke-width="6"/></pattern>
        </defs>
        <g class="sword">
          <path d="${bladeOutline}" fill="${steel.upper}"/>
          <g clip-path="url(#blade-clip-${i})">
            <path d="${temperLine}L254 55H17Z" fill="${steel.lower}"/>
            <path d="${temperLine}" fill="none" stroke="#f6f4ef" stroke-width=".65" opacity=".5"/>
          </g>
          <path d="M17 43 45 50 254 52" fill="none" stroke="#f6f4ef"/>
          <path d="m40 33 4 14M228 34h9m-7 3h5m-7 3h9" fill="none" stroke="#59616a" stroke-width=".7" opacity=".5"/>
          <text class="blade-label" x="142" y="45" text-anchor="middle">${page.title}</text>
          <rect x="246" y="27" width="12" height="26" rx="1" fill="${design.metal}"/>
          ${design.guard}
          ${page.sword === 'tobimune'
            ? `<rect x="265" y="29" width="75" height="22" rx="4" fill="url(#wrap-${i})" stroke="#77706a"/>`
            : `<rect x="265" y="29" width="75" height="22" rx="4" fill="${design.wrap}" stroke="#77706a"/>
               <path d="m271 30 7 20m7-20 7 20m7-20 7 20m7-20 7 20m7-20 7 20" stroke="${design.base}" opacity=".18" fill="none"/>
               <path d="m273 40 5-4 5 4-5 4Zm14 0 5-4 5 4-5 4Zm14 0 5-4 5 4-5 4Zm14 0 5-4 5 4-5 4Z" fill="${design.base}"/>`}
          <rect x="335" y="28" width="7" height="24" rx="2" fill="${design.metal}"/>
        </g>
        <g class="sheath">
          <path d="M17 26Q7 27 9 39Q10 51 26 53L245 55V25Z" fill="${design.sheath}" stroke="#727074"/>
          <path d="M25 30 238 29" fill="none" stroke="#777174" stroke-opacity=".5"/>
          <path d="M28 49 237 51" fill="none" stroke="#080808" stroke-width="3"/>
          <rect x="237" y="24" width="9" height="32" rx="2" fill="${design.metal}"/>
          ${design.detail}
        </g>
      </svg>
    </a>`;
  }).join('');
  container.querySelectorAll<HTMLAnchorElement>('a').forEach(link => {
    link.addEventListener('click', event => {
      if (matchMedia('(hover: none)').matches && !link.classList.contains('drawn')) {
        event.preventDefault();
        container.querySelectorAll('.drawn').forEach(el => el.classList.remove('drawn'));
        link.classList.add('drawn');
      }
    });
    link.addEventListener('keydown', event => {
      if (event.key === 'Escape') { link.classList.remove('drawn'); link.blur(); }
    });
  });
}
