// Apply the same behavior to existing links and links added by future projects.
export function externalLinks() {
  function prepare(link: HTMLAnchorElement) {
    const url = new URL(link.href, location.href);
    if (!['http:', 'https:'].includes(url.protocol) || url.origin === location.origin) return;
    link.target = '_blank';
    link.relList.add('noopener', 'noreferrer');
  }

  document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(prepare);
  function onActivate(event: MouseEvent) {
    const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
    if (link) prepare(link);
  }
  document.addEventListener('click', onActivate, true);
  document.addEventListener('auxclick', onActivate, true);
}
