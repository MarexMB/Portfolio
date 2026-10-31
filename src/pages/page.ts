import '../style.css';
import { pages } from '../config';
import { externalLinks } from '../components/ExternalLinks';
externalLinks();
document.querySelector('.page-nav')!.innerHTML = pages
  .filter(page => !location.pathname.endsWith(page.href.slice(1)))
  .map(page => `<a href="${page.href}">${page.title}</a>`)
  .join('');
