import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Low-poly lotus that mirrors the geometric logo: faceted petals with dark outlines.
// Opens once on load, then drifts. Follows the pointer slightly.
// Pauses off-screen / in background tabs; renders one still frame for reduced motion.

const RINGS = [
  { count: 8, color: 0xf48fb1, length: 1.25, width: 0.42, tilt: 1.12, y: 0.0, phase: 0.0 },
  { count: 7, color: 0xf06292, length: 1.15, width: 0.4, tilt: 0.8, y: 0.06, phase: 0.45 },
  { count: 5, color: 0xec407a, length: 1.0, width: 0.38, tilt: 0.45, y: 0.12, phase: 0.2 },
  { count: 3, color: 0xc2185b, length: 0.8, width: 0.32, tilt: 0.12, y: 0.18, phase: 0.6 },
];

const easeOutBack = (x) => {
  const c1 = 1.4;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

const makePetalGeometry = (length, width) => {
  // Flattened, faceted ellipsoid with its base at the origin and tip along +Y.
  const g = new THREE.SphereGeometry(1, 6, 5);
  g.scale(width, length / 2, width * 0.22);
  g.translate(0, length / 2, 0);
  return g;
};

const LotusScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    } catch {
      return undefined; // No WebGL: the section simply stays empty.
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.display = 'block';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    camera.position.set(0, 2.6, 5.4);
    camera.lookAt(0, 0.7, 0);

    scene.add(new THREE.HemisphereLight(0xfff1f5, 0x6d1040, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(2.5, 5, 3);
    scene.add(key);

    const outlineMat = new THREE.LineBasicMaterial({ color: 0x2b1230 });
    const lotus = new THREE.Group();
    scene.add(lotus);

    const disposables = [outlineMat];
    const petals = []; // { pivot, tilt, delay }

    RINGS.forEach((ring, ri) => {
      const geo = makePetalGeometry(ring.length, ring.width);
      const edges = new THREE.EdgesGeometry(geo, 20);
      const mat = new THREE.MeshStandardMaterial({
        color: ring.color,
        flatShading: true,
        roughness: 0.55,
        metalness: 0.0,
        side: THREE.DoubleSide,
      });
      disposables.push(geo, edges, mat);

      for (let i = 0; i < ring.count; i += 1) {
        const pivot = new THREE.Group();
        pivot.position.y = ring.y;
        pivot.rotation.order = 'YXZ';
        pivot.rotation.y = (i / ring.count) * Math.PI * 2 + ring.phase;

        const mesh = new THREE.Mesh(geo, mat);
        mesh.add(new THREE.LineSegments(edges, outlineMat));
        pivot.add(mesh);
        lotus.add(pivot);
        petals.push({ pivot, tilt: ring.tilt, delay: ri * 0.18 + i * 0.015 });
      }
    });

    // Water ring under the lotus
    const ringGeo = new THREE.RingGeometry(1.7, 1.78, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x2b1230, transparent: true, opacity: 0.18, side: THREE.DoubleSide });
    const water = new THREE.Mesh(ringGeo, ringMat);
    water.rotation.x = -Math.PI / 2;
    water.position.y = -0.05;
    scene.add(water);
    disposables.push(ringGeo, ringMat);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    const pointer = { x: 0, y: 0 };
    const onPointer = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    const OPEN_SECONDS = 2.4;
    const applyOpen = (progress) => {
      petals.forEach(({ pivot, tilt, delay }) => {
        const local = Math.min(1, Math.max(0, (progress * (OPEN_SECONDS + 0.6) - delay) / OPEN_SECONDS));
        const eased = easeOutBack(local);
        // 0 = closed bud (nearly upright), 1 = fully open
        pivot.rotation.x = 0.05 + (tilt - 0.05) * eased;
        const s = 0.55 + 0.45 * Math.min(1, local * 1.4);
        pivot.scale.setScalar(s);
      });
    };

    const clock = new THREE.Clock();
    let raf = 0;
    let running = false;
    let opened = reduceMotion ? 1 : 0;
    let spin = 0;

    const frame = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      if (opened < 1) {
        opened = Math.min(1, opened + dt / (OPEN_SECONDS + 0.6));
        applyOpen(opened);
      }
      spin += dt * 0.22;
      lotus.rotation.y = spin + pointer.x * 0.5;
      lotus.rotation.x += (pointer.y * 0.12 - lotus.rotation.x) * 0.06;
      lotus.position.y = Math.sin(clock.elapsedTime * 0.9) * 0.04;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || reduceMotion) return;
      running = true;
      clock.getDelta();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    applyOpen(opened);
    lotus.rotation.y = 0.5;
    renderer.render(scene, camera);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !document.hidden) start(); else stop();
    });
    io.observe(mount);
    const onVisibility = () => {
      if (document.hidden) stop(); else if (visible) start();
    };
    document.addEventListener('visibilitychange', onVisibility);
    start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointer);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
};

export default LotusScene;
