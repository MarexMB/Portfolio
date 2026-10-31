import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// The same Three.js ASCII technique used by Bucov/my-site, with a downloaded
// GLB model, responsive framing, and a slow automatic rotation.
export async function AsciiModel(container: HTMLElement) {
  const status = container.querySelector<HTMLElement>('.model-status')!;
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    status.textContent = 'This browser could not start WebGL.';
    return;
  }
  renderer.setPixelRatio(1);
  renderer.setClearColor(0x090909, 1);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  scene.add(new THREE.AmbientLight(0xffffff, 1.7));
  const key = new THREE.DirectionalLight(0xffffff, 3.5);
  key.position.set(3, 5, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xb84b50, 2);
  rim.position.set(-3, 1, -2);
  scene.add(rim);
  const effect = new AsciiEffect(renderer, ' .,:;i1tfLCG08@', {
    invert: true,
    resolution: 0.2
  });
  effect.domElement.style.color = '#c6c3bc';
  effect.domElement.style.backgroundColor = '#090909';
  effect.domElement.setAttribute('aria-hidden', 'true');
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.append(effect.domElement);
  const controls = new OrbitControls(camera, container);
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableDamping = false;
  controls.rotateSpeed = 0.65;
  let model: THREE.Group | undefined;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let animationFrame = 0;
  let lastFrame = 0;
  let interacting = false;
  let suspended = false;
  let disposed = false;
  function stopRotation() {
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    lastFrame = 0;
  }
  function animate(time: number) {
    animationFrame = requestAnimationFrame(animate);
    if (!lastFrame) {
      lastFrame = time;
      return;
    }
    const elapsed = time - lastFrame;
    // Cap ASCII redraws at 30 fps; rotation speed is independent of refresh rate.
    if (elapsed < 1000 / 30 || !model) return;
    const seconds = Math.min(elapsed / 1000, 0.1);
    lastFrame = time;
    model.rotation.x += seconds * 0.036;
    model.rotation.y += seconds * 0.036;
    model.rotation.z += seconds * 0.054;
    effect.render(scene, camera);
  }
  function syncRotation() {
    stopRotation();
    if (
      model &&
      !disposed &&
      !suspended &&
      !document.hidden &&
      !reducedMotion.matches &&
      !interacting
    ) {
      animationFrame = requestAnimationFrame(animate);
    }
  }
  controls.addEventListener('start', () => {
    interacting = true;
    syncRotation();
  });
  controls.addEventListener('end', () => {
    interacting = false;
    syncRotation();
  });
  reducedMotion.addEventListener('change', syncRotation);
  let queued = false;
  function render() {
    if (queued || !model || document.hidden || disposed) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      if (!disposed) effect.render(scene, camera);
    });
  }
  function resize() {
    const { width, height } = container.getBoundingClientRect();
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    effect.setSize(width, height);
    renderer.setSize(width, height);
    render();
  }
  function reset() {
    model?.rotation.set(0, 0, -0.34);
    camera.position.set(0, 0, 6.2);
    controls.target.set(0, 0, 0);
    controls.update();
    render();
  }
  controls.addEventListener('change', render);
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  document.addEventListener('visibilitychange', render);
  document.addEventListener('visibilitychange', syncRotation);
  window.addEventListener('pageshow', () => {
    suspended = false;
    syncRotation();
  });
  container.addEventListener('keydown', event => {
    if (!model) return;
    if (event.key === 'Home') {
      model.rotation.set(0, 0, -0.34);
      reset();
      event.preventDefault();
      return;
    }
    if (
      !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)
    )
      return;
    event.preventDefault();
    model.rotation.y +=
      event.key === 'ArrowLeft' ? -0.12 : event.key === 'ArrowRight' ? 0.12 : 0;
    model.rotation.x +=
      event.key === 'ArrowUp' ? -0.12 : event.key === 'ArrowDown' ? 0.12 : 0;
    render();
  });
  try {
    const gltf = await new GLTFLoader().loadAsync(
      `${import.meta.env.BASE_URL}models/katana.glb`
    );
    const asset = gltf.scene;
    asset.rotation.y = Math.PI / 2;
    const box = new THREE.Box3().setFromObject(asset);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = 3 / Math.max(size.x, size.y, size.z);
    asset.scale.multiplyScalar(scale);
    asset.position.copy(center.multiplyScalar(-scale));
    model = new THREE.Group();
    model.add(asset);
    model.rotation.z = -0.34;
    scene.add(model);
    status.remove();
    resize();
    reset();
    syncRotation();
  } catch {
    effect.domElement.remove();
    status.textContent = 'The katana could not load. Reload to try again.';
  }
  window.addEventListener('pagehide', event => {
    suspended = true;
    stopRotation();
    if (event.persisted) return;
    disposed = true;
    reducedMotion.removeEventListener('change', syncRotation);
    document.removeEventListener('visibilitychange', syncRotation);
    document.removeEventListener('visibilitychange', render);
    observer.disconnect();
    controls.dispose();
    renderer.dispose();
    scene.traverse(object => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];
        materials.forEach(material => {
          Object.values(material).forEach(value => {
            if (value instanceof THREE.Texture) value.dispose();
          });
          material.dispose();
        });
      }
    });
  });
}
