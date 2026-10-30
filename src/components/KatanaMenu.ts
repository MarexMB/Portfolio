import { pages } from '../config';

// Simplified manga-inspired fittings, drawn specifically for the menu.
const fittings: Record<string, { wrap: string; base: string; metal: string; sheath: string; guard: string; detail: string }> = {
  magatsumi: {
    wrap: '#c9c2b2', base: '#373333', metal: '#b5a27b', sheath: '#d2cabc',
    guard: '<path d="M259 40C239 31 241 12 251 16Q260 4 267 17C281 10 282 29 264 40C282 50 279 69 268 63Q260 76 251 64C237 70 240 49 259 40Z" fill="#a79571" stroke="#d0c1a0"/><path d="M260 18v44m-8-40 16 36m0-36-16 36" stroke="#514939" fill="none"/>',
    detail: '<path d="m45 27 12 25m17-25 12 26m17-26 12 26m17-27 12 27m17-27 12 27m17-28 12 28" stroke="#9e988e" stroke-width="3"/><path d="M25 36q34-15 63 4t61-2 69 2" fill="none" stroke="#64605b" stroke-width="1.5"/><path d="M202 25v31m7-31v31m7-31v31" stroke="#40353b" stroke-width="4"/>'
  },
  enten: {
    wrap: '#28282b', base: '#9b9c96', metal: '#8c928b', sheath: '#101214',
    guard: '<path d="M256 15h10v10h9v8h-9v14h9v8h-9v10h-10V55h-9v-8h9V33h-9v-8h9Z" fill="#606e64" stroke="#9ca99b"/><path d="M261 20v40" stroke="#b7beb0"/>',
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
    return `
    <a class="sword-link sword-${page.sword}" href="${page.href}" aria-label="${page.title}">
      <svg viewBox="0 0 560 80" aria-hidden="true">
        <defs>
          <linearGradient id="steel-${i}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#8e9499"/><stop offset=".48" stop-color="#ececeb"/><stop offset=".52" stop-color="#bec1c3"/><stop offset="1" stop-color="#727980"/></linearGradient>
          <pattern id="wrap-${i}" width="16" height="24" patternUnits="userSpaceOnUse"><rect width="16" height="24" fill="${design.base}"/><path d="M0 0 8 12 0 24M16 0 8 12 16 24" fill="none" stroke="${design.wrap}" stroke-width="6"/></pattern>
        </defs>
        <g class="sword">
          <path d="M17 43Q25 30 47 28L254 28V52L45 50Z" fill="url(#steel-${i})"/>
          <path d="M17 43 45 50 254 52" fill="none" stroke="#f6f4ef"/>
          <text class="blade-label" x="142" y="45" text-anchor="middle">${page.title}</text>
          <rect x="246" y="27" width="12" height="26" rx="1" fill="${design.metal}"/>
          ${design.guard}
          <rect x="265" y="29" width="75" height="22" rx="4" fill="url(#wrap-${i})" stroke="#77706a"/>
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
