import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// The same Three.js ASCII technique used by Bucov/my-site, with a downloaded
// GLB model, responsive framing, and rendering only when the view changes.
export async function AsciiModel(container: HTMLElement) {
  const status = container.querySelector<HTMLElement>('.model-status')!;
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
  catch { status.textContent = 'This browser could not start WebGL.'; return; }
  renderer.setPixelRatio(1);
  renderer.setClearColor(0x090909, 1);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, .1, 100);
  scene.add(new THREE.AmbientLight(0xffffff, 1.7));
  const key = new THREE.DirectionalLight(0xffffff, 3.5);
  key.position.set(3, 5, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0xb84b50, 2);
  rim.position.set(-3, 1, -2); scene.add(rim);
  const effect = new AsciiEffect(renderer, ' .,:;i1tfLCG08@', { invert: true, resolution: .2 });
  effect.domElement.style.color = '#c6c3bc';
  effect.domElement.style.backgroundColor = '#090909';
  effect.domElement.setAttribute('aria-hidden', 'true');
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.append(effect.domElement);
  const controls = new OrbitControls(camera, container);
  controls.enablePan = false; controls.enableZoom = false;
  controls.enableDamping = false; controls.rotateSpeed = .65;
  let solid = false;
  let model: THREE.Group | undefined;
  let queued = false;
  function render() {
    if (queued || !model || document.hidden) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; solid ? renderer.render(scene, camera) : effect.render(scene, camera); });
  }
  function resize() {
    const { width, height } = container.getBoundingClientRect();
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    effect.setSize(width, height); renderer.setSize(width, height);
    render();
  }
  function reset() {
    camera.position.set(0, 0, 6.2); controls.target.set(0, 0, 0); controls.update(); render();
  }
  controls.addEventListener('change', render);
  const observer = new ResizeObserver(resize); observer.observe(container);
  document.addEventListener('visibilitychange', render);
  document.querySelector('#reset-view')!.addEventListener('click', reset);
  const mode = document.querySelector<HTMLButtonElement>('#render-mode')!;
  mode.addEventListener('click', () => {
    solid = !solid; mode.textContent = solid ? 'ASCII view' : 'solid view';
    mode.setAttribute('aria-pressed', String(solid));
    if (solid) { effect.domElement.remove(); container.append(renderer.domElement); }
    else { renderer.domElement.remove(); container.append(effect.domElement); }
    render();
  });
  container.addEventListener('keydown', event => {
    if (!model) return;
    if (event.key === 'Home') { model.rotation.set(0, 0, -.34); reset(); event.preventDefault(); return; }
    if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    model.rotation.y += event.key === 'ArrowLeft' ? -.12 : event.key === 'ArrowRight' ? .12 : 0;
    model.rotation.x += event.key === 'ArrowUp' ? -.12 : event.key === 'ArrowDown' ? .12 : 0;
    render();
  });
  try {
    const gltf = await new GLTFLoader().loadAsync(`${import.meta.env.BASE_URL}models/katana.glb`);
    const asset = gltf.scene;
    asset.rotation.y = Math.PI / 2;
    const box = new THREE.Box3().setFromObject(asset);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = 3 / Math.max(size.x, size.y, size.z);
    asset.scale.multiplyScalar(scale);
    asset.position.copy(center.multiplyScalar(-scale));
    model = new THREE.Group(); model.add(asset); model.rotation.z = -.34;
    scene.add(model); status.remove(); resize(); reset();
  } catch {
    effect.domElement.remove();
    status.textContent = 'The katana could not load. Reload to try again.';
    mode.disabled = true;
  }
  window.addEventListener('pagehide', () => {
    observer.disconnect(); controls.dispose(); renderer.dispose();
    scene.traverse(object => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach(material => {
          Object.values(material).forEach(value => { if (value instanceof THREE.Texture) value.dispose(); });
          material.dispose();
        });
      }
    });
  }, { once: true });
}
