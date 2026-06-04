"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export interface GlobeBackgroundProps {
	onRecorderReady?: (recorder: MediaRecorder) => void;
}

const GlobeBackground = (_props: GlobeBackgroundProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (!containerRef.current || !canvasRef.current) return;

		const width = containerRef.current.clientWidth;
		const height = containerRef.current.clientHeight;

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
		camera.position.z = 3.5;

		const canvas = canvasRef.current;
		const webglContext =
			canvas.getContext("webgl2") ||
			canvas.getContext("webgl") ||
			canvas.getContext("experimental-webgl");
		if (!webglContext) return;

		const renderer = new THREE.WebGLRenderer({
			canvas,
			context: webglContext,
			antialias: true,
			alpha: true,
		});
		renderer.setSize(width, height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		const planet = new THREE.Mesh(
			new THREE.IcosahedronGeometry(1.5, 4),
			new THREE.MeshStandardMaterial({
				color: 0x111122,
				wireframe: false,
				flatShading: true,
				metalness: 0.1,
				roughness: 0.8,
			}),
		);
		scene.add(planet);

		const particlesGeometry = new THREE.BufferGeometry();
		const particlesCount = 200;
		const positions = new Float32Array(particlesCount * 3);
		for (let i = 0; i < particlesCount; i++) {
			const phi = Math.acos(-1 + (2 * i) / particlesCount);
			const theta = Math.sqrt(particlesCount * Math.PI) * phi;
			const radius = 1.7 + Math.random() * 0.3;

			positions[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
			positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
			positions[i * 3 + 2] = radius * Math.cos(phi);
		}
		particlesGeometry.setAttribute(
			"position",
			new THREE.BufferAttribute(positions, 3),
		);

		const particleSystem = new THREE.Points(
			particlesGeometry,
			new THREE.PointsMaterial({
				color: 0x00f2ff,
				size: 0.02,
				transparent: true,
				opacity: 0.8,
			}),
		);
		scene.add(particleSystem);

		const linesMesh = new THREE.LineSegments(
			new THREE.BufferGeometry(),
			new THREE.LineBasicMaterial({
				color: 0x00f2ff,
				transparent: true,
				opacity: 0.2,
			}),
		);
		scene.add(linesMesh);

		scene.add(new THREE.AmbientLight(0xffffff, 0.4));

		const mainLight = new THREE.DirectionalLight(0xffaa44, 2);
		mainLight.position.set(5, 3, 5);
		scene.add(mainLight);

		const blueLight = new THREE.PointLight(0x00ffff, 4, 10);
		blueLight.position.set(-5, -2, -5);
		scene.add(blueLight);

		const handleResize = () => {
			if (!containerRef.current) return;
			const w = containerRef.current.clientWidth;
			const h = containerRef.current.clientHeight;
			camera.aspect = w / h;
			camera.updateProjectionMatrix();
			renderer.setSize(w, h);
		};
		window.addEventListener("resize", handleResize);

		let frame = 0;
		const animate = () => {
			frame = requestAnimationFrame(animate);

			planet.rotation.y += 0.002;
			particleSystem.rotation.y += 0.002;
			linesMesh.rotation.y += 0.002;

			const scale = 1 + Math.sin(Date.now() * 0.001) * 0.02;
			planet.scale.set(scale, scale, scale);

			renderer.render(scene, camera);
		};

		animate();

		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener("resize", handleResize);
			renderer.dispose();
			particlesGeometry.dispose();
			planet.geometry.dispose();
		};
	}, []);

	return (
		<div
			ref={containerRef}
			className="w-full h-full bg-[#050510] overflow-hidden"
		>
			<canvas ref={canvasRef} style={{ display: "block" }} />
		</div>
	);
};

export default GlobeBackground;
