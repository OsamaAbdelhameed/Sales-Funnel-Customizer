'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface GlobeBackgroundProps {
  onRecorderReady?: (recorder: MediaRecorder) => void;
}

const GlobeBackground: React.FC<GlobeBackgroundProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 3.5;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // --- Planet ---
    const planetGeometry = new THREE.IcosahedronGeometry(1.5, 4); // Low-ish poly
    const planetMaterial = new THREE.MeshStandardMaterial({
      color: 0x111122,
      wireframe: false,
      flatShading: true,
      metalness: 0.1,
      roughness: 0.8,
    });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    scene.add(planet);

    // --- Plexus / Network ---
    const particlesCount = 200;
    const positions = new Float32Array(particlesCount * 3);
    const velocities = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount; i++) {
       // Spread particles on a sphere slightly larger than the planet
       const phi = Math.acos(-1 + (2 * i) / particlesCount);
       const theta = Math.sqrt(particlesCount * Math.PI) * phi;
       const radius = 1.7 + Math.random() * 0.3;

       positions[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
       positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
       positions[i * 3 + 2] = radius * Math.cos(phi);

       velocities[i * 3] = (Math.random() - 0.5) * 0.002;
       velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
       velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x00f2ff,
      size: 0.02,
      transparent: true,
      opacity: 0.8,
    });
    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    // Lines for Plexus
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00f2ff,
      transparent: true,
      opacity: 0.2,
    });
    
    // We'll update line indices based on distance in the animation loop
    let linesMesh = new THREE.LineSegments(new THREE.BufferGeometry(), lineMaterial);
    scene.add(linesMesh);

    // --- Lights ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffaa44, 2);
    mainLight.position.set(5, 3, 5);
    scene.add(mainLight);

    const blueLight = new THREE.PointLight(0x00ffff, 4, 10);
    blueLight.position.set(-5, -2, -5);
    scene.add(blueLight);

    // --- Resize Handler ---
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // --- Animation Loop ---
    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);

      // Rotation
      planet.rotation.y += 0.002;
      particleSystem.rotation.y += 0.002;
      linesMesh.rotation.y += 0.002;

      // Subtle pulse
      const scale = 1 + Math.sin(Date.now() * 0.001) * 0.02;
      planet.scale.set(scale, scale, scale);

      // Update particle positions slightly
      const posAttr = particlesGeometry.attributes.position;
      for (let i = 0; i < particlesCount; i++) {
        posAttr.array[i * 3] += velocities[i * 3];
        posAttr.array[i * 3 + 1] += velocities[i * 3 + 1];
        posAttr.array[i * 3 + 2] += velocities[i * 3 + 2];

        // Keep them bounded to a shell
        const x = posAttr.array[i * 3] as number;
        const y = posAttr.array[i * 3 + 1] as number;
        const z = posAttr.array[i * 3 + 2] as number;
        const dist = Math.sqrt(x*x + y*y + z*z);
        if (dist > 2.2 || dist < 1.6) {
           velocities[i * 3] *= -1;
           velocities[i * 3 + 1] *= -1;
           velocities[i * 3 + 2] *= -1;
        }
      }
      posAttr.needsUpdate = true;

      // Update Lines Plexus
      const linePositions: number[] = [];
      const threshold = 0.6;
      for (let i = 0; i < particlesCount; i++) {
         for (let j = i + 1; j < particlesCount; j++) {
            const dx = (posAttr.array[i * 3] as number) - (posAttr.array[j * 3] as number);
            const dy = (posAttr.array[i * 3 + 1] as number) - (posAttr.array[j * 3 + 1] as number);
            const dz = (posAttr.array[i * 3 + 2] as number) - (posAttr.array[j * 3 + 2] as number);
            const distSq = dx*dx + dy*dy + dz*dz;
            if (distSq < threshold * threshold) {
               linePositions.push(
                 posAttr.array[i * 3] as number, posAttr.array[i * 3 + 1] as number, posAttr.array[i * 3 + 2] as number,
                 posAttr.array[j * 3] as number, posAttr.array[j * 3 + 1] as number, posAttr.array[j * 3 + 2] as number
               );
            }
         }
      }
      linesMesh.geometry.dispose();
      linesMesh.geometry = new THREE.BufferGeometry();
      linesMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full bg-[#050510]">
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
};

export default GlobeBackground;
