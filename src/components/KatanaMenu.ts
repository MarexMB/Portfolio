import { pages } from '../config';

export function KatanaMenu(container: HTMLElement) {
  container.innerHTML = pages.map((page, i) => `
    <a class="sword-link" href="${page.href}" aria-label="${page.title}">
      <svg viewBox="0 0 560 80" aria-hidden="true">
        <defs>
          <linearGradient id="steel-${i}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#8e9499"/><stop offset=".48" stop-color="#ececeb"/><stop offset=".52" stop-color="#bec1c3"/><stop offset="1" stop-color="#727980"/></linearGradient>
          <pattern id="wrap-${i}" width="16" height="24" patternUnits="userSpaceOnUse"><rect width="16" height="24" fill="#191919"/><path d="M0 0 8 12 0 24M16 0 8 12 16 24" fill="none" stroke="#6e6260" stroke-width="3"/></pattern>
        </defs>
        <g class="sword">
          <path d="M17 43Q25 30 47 28L254 28V52L45 50Z" fill="url(#steel-${i})"/>
          <path d="M17 43 45 50 254 52" fill="none" stroke="#f6f4ef"/>
          <text class="blade-label" x="142" y="45" text-anchor="middle">${page.title}</text>
          <rect x="246" y="27" width="12" height="26" rx="1" fill="#8d7a55"/>
          <rect x="257" y="18" width="7" height="44" rx="3" fill="#77706a"/>
          <rect x="265" y="29" width="75" height="22" rx="4" fill="url(#wrap-${i})" stroke="#77706a"/>
          <rect x="335" y="28" width="7" height="24" rx="2" fill="#8d7a55"/>
        </g>
        <g class="sheath">
          <path d="M17 26Q7 27 9 39Q10 51 26 53L245 55V25Z" fill="#19191b" stroke="#565455"/>
          <path d="M25 30 238 29" fill="none" stroke="#777174" stroke-opacity=".5"/>
          <path d="M28 49 237 51" fill="none" stroke="#080808" stroke-width="3"/>
          <rect x="237" y="24" width="9" height="32" rx="2" fill="#584442"/>
          <path d="M207 25v29m5-29v29m5-29v29" stroke="#702129" stroke-width="3"/>
          <path d="M211 55q18 12 31 7" fill="none" stroke="#702129" stroke-width="3"/>
        </g>
      </svg>
    </a>`).join('');
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
