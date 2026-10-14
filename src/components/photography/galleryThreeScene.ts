import * as THREE from 'three';
export function createGalleryLightsScene(canvas: HTMLCanvasElement, lightTheme: boolean, onFailure: () => void) {
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = colorCanvas.height = 1;
  const colorContext = colorCanvas.getContext('2d', { willReadFrequently: true })!;
  function color(oklch: string) {
    colorContext.clearRect(0, 0, 1, 1);
    colorContext.fillStyle = oklch;
    colorContext.fillRect(0, 0, 1, 1);
    const [r, g, b] = colorContext.getImageData(0, 0, 1, 1).data;
    return new THREE.Color().setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);
  }
  const scene = new THREE.Scene();
  scene.background = null;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.transmissionResolutionScale = 1;
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
  camera.position.z = 100;
  // Procedural exhibition softboxes supply reflections without external HDR assets.
  const environment = new THREE.Scene();
  environment.background = color('oklch(24% 0.015 70)');
  function panel(w: number, h: number, x: number, y: number, z: number, rotation: number, strength: number) {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: color('oklch(97% 0.025 85)').multiplyScalar(strength), side: THREE.DoubleSide }));
    mesh.position.set(x, y, z);
    mesh.rotation.y = rotation;
    environment.add(mesh);
  }
  panel(0.8, 4, -2, 1, 2, Math.PI / 4, 4);
  panel(0.35, 3, 2, 0.4, 1, -Math.PI / 3, 2.6);
  panel(3, 0.45, 0, 3, 0, 0, 2.2);
  panel(0.4, 3, 0.7, 0, -2, 0, 1.2);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTarget = pmrem.fromScene(environment, 0.04, 0.1, 20);
  scene.environment = envTarget.texture;
  pmrem.dispose();
  const lamp = new THREE.Group();
  scene.add(lamp);
  const keyLight = new THREE.DirectionalLight(color('oklch(94% 0.045 85)'), 1.8);
  keyLight.position.set(-3, 4, 5);
  scene.add(keyLight);
  const fillLight = new THREE.HemisphereLight(color('oklch(87% 0.025 85)'), color('oklch(30% 0.02 65)'), 0.5);
  scene.add(fillLight);
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: color('oklch(100% 0 0)'), roughness: 0.025, metalness: 0,
    transparent: true, transmission: 0.98, thickness: 0.008, ior: 1.46, envMapIntensity: 1.35,
    attenuationDistance: Infinity, side: THREE.FrontSide,
  });
  const angleEnd = Math.asin(0.7);
  const latheProfile = Array.from({ length: (40) + 1 }, (_, i) => {
    const angle = -Math.PI / 2 + (angleEnd + Math.PI / 2) * i / (40);
    return new THREE.Vector2(Math.max(0.001, 0.5 * Math.cos(angle)), 0.1 + 0.5 * Math.sin(angle));
  });
  const join = latheProfile.at(-1)!;
  const shoulder = new THREE.CubicBezierCurve3(new THREE.Vector3(join.x, join.y, 0), new THREE.Vector3(0.289, 0.52, 0), new THREE.Vector3(0.15, 0.65, 0), new THREE.Vector3(0.15, 0.8, 0));
  latheProfile.push(...shoulder.getPoints(20).slice(1).map(p => new THREE.Vector2(p.x, p.y)), new THREE.Vector2(0.15, 0.87), new THREE.Vector2(0.15, 0.94));
  const glass = new THREE.Mesh(new THREE.LatheGeometry(latheProfile, 48), glassMaterial);
  lamp.add(glass);
  const socketMaterial = new THREE.MeshStandardMaterial({
    color: color('oklch(22% 0.006 65)'), metalness: 0.2, roughness: 0.32,
  });
  const metal = new THREE.MeshStandardMaterial({ color: color('oklch(62% 0.012 80)'), metalness: 0.8, roughness: 0.32 });
  function cylinder(radius: number, length: number, y: number, material: THREE.Material, parent = lamp) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 32), material);
    mesh.position.y = y;
    parent.add(mesh);
    return mesh;
  }
  // The socket covers the screw base; only the bottom contact rim is exposed.
  cylinder(0.152, 0.035, 0.945, metal);
  cylinder(0.174, 0.24, 1.075, socketMaterial);
  const domeProfile = [new THREE.Vector2(0.174, 1.17), new THREE.Vector2(0.2, 1.2), new THREE.Vector2(0.195, 1.26), new THREE.Vector2(0.16, 1.32), new THREE.Vector2(0.105, 1.36), new THREE.Vector2(0.08, 1.37)];
  const domeCurve = new THREE.SplineCurve(domeProfile);
  lamp.add(new THREE.Mesh(new THREE.LatheGeometry(domeCurve.getPoints(24), 32), socketMaterial));
  for (const [radius, y] of [[0.186, 1.17], [0.2, 1.23]]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.014, 8, 32), socketMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
    lamp.add(ring);
  }
  cylinder(0.076, 0.1, 1.4, socketMaterial);
  const strainRelief = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.065, 0.17, 24), socketMaterial);
  strainRelief.position.y = 1.505;
  lamp.add(strainRelief);
  const stemMaterial = new THREE.MeshPhysicalMaterial({ color: color('oklch(100% 0 0)'), roughness: 0.05, transmission: 1, thickness: 0.006, ior: 1.46 });
  cylinder(0.032, 0.42, 0.69, stemMaterial);
  const bead = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 12), stemMaterial);
  bead.scale.set(1, 1.7, 1);
  bead.position.y = 0.58;
  lamp.add(bead);
  const supportMaterial = new THREE.MeshStandardMaterial({ color: color('oklch(52% 0.016 75)'), metalness: 0.75, roughness: 0.3 });
  function tube(points: THREE.Vector3[], radius: number, material: THREE.Material, segments = 64) {
    const path = new THREE.CatmullRomCurve3(points);
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(path, Math.ceil(segments / 2), radius, 6, false), material);
    lamp.add(mesh);
    return mesh;
  }
  // Two leads attach to opposite ends of the spiral, rather than floating beside it.
  tube([new THREE.Vector3(-0.016, 0.87, 0), new THREE.Vector3(-0.038, 0.46, 0), new THREE.Vector3(-0.09, 0.49, 0), new THREE.Vector3(0.13, 0.4, 0)], 0.005, supportMaterial);
  tube([new THREE.Vector3(0.016, 0.87, 0), new THREE.Vector3(0.06, 0.38, -0.04), new THREE.Vector3(0.08, -0.14, -0.05), new THREE.Vector3(0.13, -0.22, 0)], 0.005, supportMaterial);
  const filamentMaterial = new THREE.MeshStandardMaterial({ color: color('oklch(87% 0.115 80)'), emissive: color('oklch(77% 0.14 65)'), emissiveIntensity: 2.5, roughness: 0.5 });
  const spiral: THREE.Vector3[] = [];
  for (let i = 0; i <= 420; i++) {
    const t = i / 420, angle = t * Math.PI * 2 * 7;
    spiral.push(new THREE.Vector3(Math.cos(angle) * 0.13, (0.4) - t * (0.62), Math.sin(angle) * 0.13));
  }
  tube(spiral, 0.0055, filamentMaterial, 420);
  const warmLight = new THREE.PointLight(color('oklch(83% 0.12 75)'), 2200, 0, 2);
  warmLight.position.y = 0.1;
  lamp.add(warmLight);
  const placements = [{ x: 10, drop: 46 }, { x: 23, drop: 82 }, { x: 36, drop: 54 }, { x: 50, drop: 98 }, { x: 64, drop: 42 }, { x: 77, drop: 76 }, { x: 90, drop: 52 }];
  scene.remove(lamp);
  const cableMaterial = new THREE.MeshStandardMaterial({ color: color(lightTheme ? 'oklch(44% 0.025 65)' : 'oklch(37% 0.025 65)'), roughness: 0.8 });
  const scale = 70 / (1.59 + 0.4);
  const pendants = placements.map((placement, index) => {
    const anchor = new THREE.Group();
    const model = lamp.clone(true);
    const filament = filamentMaterial.clone();
    let light = warmLight;
    model.traverse(obj => { if (obj instanceof THREE.Mesh && obj.material === filamentMaterial)
      obj.material = filament; if (obj instanceof THREE.PointLight)
      light = obj; });
    model.scale.setScalar(scale);
    const line = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 1, 8), cableMaterial);
    anchor.add(model, line);
    scene.add(anchor);
    return { anchor, model, line, filament, light, placement, index };
  });
  let cable: THREE.Mesh<THREE.TubeGeometry, THREE.MeshStandardMaterial> | undefined;
  let frame = 0, last = 0, reduced = false, visible = false, disposed = false;
  function render(time: number) {
    const seconds = time / 1000;
    for (const item of pendants) {
      const phase = item.index * 0.8;
      item.anchor.rotation.z = reduced ? 0 : Math.sin(seconds / (5 + item.index * 0.35) + phase) * THREE.MathUtils.degToRad(1.2);
      const brightness = reduced ? 1 : 0.9 + 0.1 * Math.sin(seconds / (4 + item.index * 0.5) + phase);
      item.filament.emissiveIntensity = 2.5 * brightness;
      item.light.intensity = 2200 * brightness;
    }
    renderer.render(scene, camera);
  }
  function tick(time: number) {
    frame = 0;
    if (disposed || document.hidden || reduced || !visible)
      return;
    if (time - last >= 1000 / 30) {
      render(time);
      last = time - (time - last) % (1000 / 30);
    }
    frame = requestAnimationFrame(tick);
  }
  function refresh() {
    cancelAnimationFrame(frame);
    frame = 0;
    if (disposed || document.hidden || !visible)
      return;
    render(performance.now());
    if (!reduced)
      frame = requestAnimationFrame(tick);
  }
  function resize(width: number, height: number) {
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(width, height, false);
    camera.left = -width / 2;
    camera.right = width / 2;
    camera.top = height / 2;
    camera.bottom = -height / 2;
    camera.updateProjectionMatrix();
    if (cable) {
      scene.remove(cable);
      cable.geometry.dispose();
    }
    const points = Array.from({ length: 65 }, (_, i) => { const t = i / 64; return new THREE.Vector3(t * width - width / 2, height / 2 - (12 + 176 * t * (1 - t)), 0); });
    cable = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 64, 0.7, 6, false), cableMaterial);
    scene.add(cable);
    for (const item of pendants) {
      const { x, drop } = item.placement, t = x / 100;
      item.anchor.visible = width > 560 || [1, 3, 5].includes(item.index);
      item.anchor.position.set(t * width - width / 2, height / 2 - (12 + 176 * t * (1 - t)), 0);
      item.model.position.y = -drop - 1.59 * scale;
      item.line.scale.y = drop;
      item.line.position.y = -drop / 2;
    }
    refresh();
  }
  const contextLost = (event: Event) => { event.preventDefault(); onFailure(); };
  canvas.addEventListener('webglcontextlost', contextLost);
  document.addEventListener('visibilitychange', refresh);
  return {
    resize,
    setReduced(value: boolean) { reduced = value; refresh(); },
    setVisible(value: boolean) { visible = value; refresh(); },
    dispose() {
      if (disposed)
        return;
      disposed = true;
      cancelAnimationFrame(frame);
      document.removeEventListener('visibilitychange', refresh);
      canvas.removeEventListener('webglcontextlost', contextLost);
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      for (const root of [scene, lamp, environment])
        root.traverse(obj => {
          if (obj instanceof THREE.Mesh) {
            geometries.add(obj.geometry);
            for (const material of Array.isArray(obj.material) ? obj.material : [obj.material])
              materials.add(material);
          }
        });
      for (const geometry of geometries)
        geometry.dispose();
      for (const material of materials)
        material.dispose();
      envTarget.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      scene.clear();
    },
  };
}
