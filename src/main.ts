import './style.css';
import { KatanaMenu } from './components/KatanaMenu';
import { externalLinks } from './components/ExternalLinks';

KatanaMenu(document.querySelector('#katana-menu')!);
externalLinks();
// Keep navigation independent of the heavier renderer and model download.
import('./components/AsciiModel').then(({ AsciiModel }) => AsciiModel(document.querySelector('#model')!)).catch(() => {
  document.querySelector('.model-status')!.textContent = 'The 3D viewer could not start. Please reload to try again.';
});
