import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { useQuantumStore } from '../../store/useQuantumStore';
import { Globe2, Info } from 'lucide-react';

export const QSphereView: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { numQubits, getActiveStatevector, executionResult } = useQuantumStore();
  const [hoveredState, setHoveredState] = useState<{
    label: string;
    prob: number;
    phase: number;
    real: number;
    imag: number;
  } | null>(null);

  const sv = getActiveStatevector();

  const stateNodes = useMemo(() => {
    if (!sv || sv.length === 0) return [];
    const totalStates = sv.length;
    const nodes = [];

    for (let i = 0; i < totalStates; i++) {
      const elem = sv[i];
      const binaryLabel = i.toString(2).padStart(numQubits, '0');
      const prob = elem.magnitude ** 2;

      // Map binary index to spherical coordinates (latitude theta, longitude phi)
      // States with Hamming weight 0 at north pole (+Z), weight N at south pole (-Z)
      const onesCount = binaryLabel.split('').filter((c) => c === '1').length;
      const latFraction = numQubits > 0 ? onesCount / numQubits : 0.5;
      const theta = latFraction * Math.PI; // 0 (North) to PI (South)

      // Distribute evenly around azimuth for states with same hamming weight
      const phi = (i / totalStates) * 2 * Math.PI;

      // Spherical to Cartesian coordinates (Radius = 1.0)
      const r = 1.0;
      const x = r * Math.sin(theta) * Math.cos(phi);
      const y = r * Math.cos(theta); // Three.js Y is UP
      const z = r * Math.sin(theta) * Math.sin(phi);

      // Phase mapped to HSL color (angle from -PI to +PI)
      const phaseDeg = ((elem.phase * 180) / Math.PI + 360) % 360;
      const color = new THREE.Color().setHSL(phaseDeg / 360, 0.95, 0.55);

      nodes.push({
        index: i,
        label: `|${binaryLabel}⟩`,
        x,
        y,
        z,
        prob,
        phase: elem.phase,
        phaseDeg: Math.round(phaseDeg),
        real: elem.real,
        imag: elem.imag,
        magnitude: elem.magnitude,
        colorHex: `#${color.getHexString()}`,
      });
    }
    return nodes;
  }, [sv, numQubits]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const w = container.clientWidth || 360;
    const h = container.clientHeight > 50 ? container.clientHeight : 220;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.set(2.5, 1.8, 2.7);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Ambient & Directional Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const dirLight = new THREE.DirectionalLight(0xa855f7, 1.8);
    dirLight.position.set(4, 5, 4);
    scene.add(dirLight);

    // 1. Semi-transparent Wireframe Sphere Base
    const sphereGeo = new THREE.SphereGeometry(1.0, 20, 20);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphereMesh);

    // 2. Equatorial and Meridian rings
    const eqGeo = new THREE.RingGeometry(0.99, 1.01, 64);
    const eqMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, side: THREE.DoubleSide });
    const eqCircle = new THREE.Mesh(eqGeo, eqMat);
    eqCircle.rotation.x = Math.PI / 2;
    scene.add(eqCircle);

    // 3. State Nodes on Sphere Surface
    const nodeGroup = new THREE.Group();
    stateNodes.forEach((node) => {
      // Radius scaled to probability: sqrt(P) ensures visual prominence
      const nodeRadius = Math.max(0.04, Math.sqrt(node.prob) * 0.22);
      const nodeGeo = new THREE.SphereGeometry(nodeRadius, 16, 16);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: node.colorHex,
        roughness: 0.2,
        metalness: 0.4,
        emissive: node.colorHex,
        emissiveIntensity: node.prob > 0.05 ? 0.6 : 0.15,
      });

      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(node.x, node.y, node.z);
      nodeGroup.add(nodeMesh);

      // Line from center if probability > 1%
      if (node.prob > 0.01) {
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(node.x, node.y, node.z),
        ]);
        const lineMat = new THREE.LineBasicMaterial({
          color: node.colorHex,
          transparent: true,
          opacity: Math.min(1.0, node.prob * 1.5 + 0.3),
        });
        const lineMesh = new THREE.Line(lineGeo, lineMat);
        nodeGroup.add(lineMesh);
      }
    });
    scene.add(nodeGroup);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      sphereMesh.rotation.y += 0.003;
      nodeGroup.rotation.y += 0.003;
      eqCircle.rotation.z += 0.001;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const nw = container.clientWidth || 360;
      const nh = container.clientHeight > 50 ? container.clientHeight : 220;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };

    const ro = new ResizeObserver(() => handleResize());
    ro.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [stateNodes]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col h-full relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800 shrink-0">
        <div className="flex items-center space-x-2">
          <Globe2 className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            Multi-Qubit 3D Q-Sphere
          </h3>
        </div>
        <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800">
          2^{numQubits} = {stateNodes.length} Basis States
        </span>
      </div>

      {/* 3D Canvas Mount */}
      <div className="flex-1 w-full relative min-h-[170px] flex items-center justify-center overflow-hidden my-1">
        <div ref={mountRef} className="w-full h-full min-h-[170px]" />
      </div>

      {/* Phase Color Wheel Legend */}
      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-300 shrink-0">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400">Phase φ:</span>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" title="0 rad" />
            <span className="text-[9px] text-slate-400">0</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" title="π/2 rad" />
            <span className="text-[9px] text-slate-400">π/2</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" title="π rad" />
            <span className="text-[9px] text-slate-400">π</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#a855f7]" title="3π/2 rad" />
            <span className="text-[9px] text-slate-400">3π/2</span>
          </div>
        </div>

        <div className="flex items-center space-x-1 text-slate-400">
          <Info className="w-3 h-3 text-cyan-400" />
          <span>Radius ∝ √Probability</span>
        </div>
      </div>
    </div>
  );
};
