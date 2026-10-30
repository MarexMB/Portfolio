import './style.css';
import { KatanaMenu } from './components/KatanaMenu';

KatanaMenu(document.querySelector('#katana-menu')!);
// Keep navigation independent of the heavier renderer and model download.
import('./components/AsciiModel').then(({ AsciiModel }) => AsciiModel(document.querySelector('#model')!)).catch(() => {
  document.querySelector('.model-status')!.textContent = 'The 3D viewer could not start. Please reload to try again.';
});
