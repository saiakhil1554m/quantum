import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { useQuantumStore } from '../../store/useQuantumStore';
import { Globe } from 'lucide-react';

export const BlochSphereView: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { executionResult, numQubits, runSimulation, getActiveStatevector } = useQuantumStore();
  const [selectedQubit, setSelectedQubit] = useState(0);

  // Trigger initial simulation if result is null when opening Bloch sphere tab
  useEffect(() => {
    if (!executionResult) {
      runSimulation();
    }
  }, [executionResult, runSimulation]);

  const sv = getActiveStatevector();

  // Calculate single qubit reduced statevector Bloch coordinates (x, y, z)
  const blochCoords = useMemo(() => {
    if (!sv || sv.length === 0) {
      return { x: 0, y: 0, z: 1 }; // Default |0> state at top pole (+Z)
    }

    let rho00 = 0;
    let rho11 = 0;
    let rho01_real = 0;
    let rho01_imag = 0;

    sv.forEach((elem, idx) => {
      // Bitwise check for target qubit bit in state index idx
      const bit = (idx >> selectedQubit) & 1;
      const magSq = elem.magnitude ** 2;

      if (bit === 0) {
        rho00 += magSq;

        // Partner state with target qubit bit flipped to 1
        const partnerIdx = idx | (1 << selectedQubit);
        if (partnerIdx < sv.length) {
          const partner = sv[partnerIdx];
          const a0 = elem.real;
          const b0 = elem.imag;
          const a1 = partner.real;
          const b1 = partner.imag;

          // c0 * c1* = (a0 + i b0)(a1 - i b1) = (a0 a1 + b0 b1) + i(b0 a1 - a0 b1)
          rho01_real += a0 * a1 + b0 * b1;
          rho01_imag += b0 * a1 - a0 * b1;
        }
      } else {
        rho11 += magSq;
      }
    });

    const x = 2 * rho01_real;
    const y = -2 * rho01_imag;
    const z = rho00 - rho11;

    return { x: roundNorm(x), y: roundNorm(y), z: roundNorm(z) };
  }, [executionResult, numQubits, selectedQubit]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const getContainerSize = () => {
      const w = container.clientWidth || 360;
      const h = container.clientHeight > 50 ? container.clientHeight : 220;
      return { width: w, height: h };
    };

    const { width, height } = getContainerSize();

    // 1. Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(2.4, 1.9, 2.6);
    camera.lookAt(0, 0, 0);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0x06b6d4, 1.5);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 4. Wireframe Sphere
    const sphereGeo = new THREE.SphereGeometry(1, 24, 24);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
      shininess: 100,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphereMesh);

    // Equatorial Wire Frame Circle (XY Plane)
    const eqGeo = new THREE.RingGeometry(0.99, 1.01, 64);
    const eqMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, side: THREE.DoubleSide });
    const eqCircle = new THREE.Mesh(eqGeo, eqMat);
    eqCircle.rotation.x = Math.PI / 2;
    scene.add(eqCircle);

    // Meridian Wire Frame Circle (XZ Plane)
    const merGeo = new THREE.RingGeometry(0.99, 1.01, 64);
    const merMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, side: THREE.DoubleSide });
    const merCircle = new THREE.Mesh(merGeo, merMat);
    merCircle.rotation.y = Math.PI / 2;
    scene.add(merCircle);

    // 5. Axes Helper (X=Red, Y=Green, Z=Blue)
    const axesHelper = new THREE.AxesHelper(1.35);
    scene.add(axesHelper);

    // 6. State Vector Arrow (Yellow/Gold)
    // Mapping: Three.js Y is UP (Z in physics), physics X -> Three X, physics Y -> -Three Z
    const dir = new THREE.Vector3(blochCoords.x, blochCoords.z, -blochCoords.y);
    const length = Math.min(1.0, Math.sqrt(blochCoords.x ** 2 + blochCoords.y ** 2 + blochCoords.z ** 2) || 1.0);
    const origin = new THREE.Vector3(0, 0, 0);

    if (dir.lengthSq() > 0) {
      dir.normalize();
    } else {
      dir.set(0, 1, 0);
    }

    const arrowHelper = new THREE.ArrowHelper(dir, origin, length, 0xf59e0b, 0.22, 0.12);
    scene.add(arrowHelper);

    // 7. Core Point Marker
    const pointGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const pointMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const pointMesh = new THREE.Mesh(pointGeo, pointMat);
    pointMesh.position.copy(dir.clone().multiplyScalar(length));
    scene.add(pointMesh);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      sphereMesh.rotation.y += 0.003;
      eqCircle.rotation.z += 0.001;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const { width: nw, height: nh } = getContainerSize();
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [blochCoords]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col h-full relative">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800 shrink-0">
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">3D Bloch Sphere</h3>
        </div>

        {/* Qubit Selector */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">Target Qubit:</span>
          <select
            value={selectedQubit}
            onChange={(e) => setSelectedQubit(parseInt(e.target.value, 10))}
            className="bg-slate-950 text-cyan-300 border border-slate-800 rounded px-2 py-0.5 font-mono cursor-pointer"
          >
            {Array.from({ length: numQubits }, (_, i) => (
              <option key={i} value={i}>
                q[{i}]
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3D Canvas Mount */}
      <div className="flex-1 w-full relative min-h-[190px] flex items-center justify-center my-1 overflow-hidden">
        <div ref={mountRef} className="w-full h-full min-h-[190px] flex items-center justify-center" />
      </div>

      {/* Bloch Coordinates Footer */}
      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex items-center justify-around text-[11px] font-mono text-slate-300 shrink-0">
        <span>
          X: <strong className="text-rose-400">{blochCoords.x}</strong>
        </span>
        <span>
          Y: <strong className="text-emerald-400">{blochCoords.y}</strong>
        </span>
        <span>
          Z: <strong className="text-cyan-400">{blochCoords.z}</strong>
        </span>
      </div>
    </div>
  );
};

function roundNorm(val: number): number {
  const rounded = Number(val.toFixed(3));
  return Math.max(-1, Math.min(1, rounded));
}
