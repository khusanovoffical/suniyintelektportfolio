import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBackground = () => {
    const mountRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 50;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        mountRef.current.appendChild(renderer.domElement);

        // Particle system
        const particleCount = 1500;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 200;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 200;

            // Cyberpunk colors: cyan, purple, blue
            const colorChoice = Math.random();
            if (colorChoice < 0.33) {
                colors[i * 3] = 0.0;
                colors[i * 3 + 1] = 0.8;
                colors[i * 3 + 2] = 1.0; // Cyan
            } else if (colorChoice < 0.66) {
                colors[i * 3] = 0.6;
                colors[i * 3 + 1] = 0.2;
                colors[i * 3 + 2] = 1.0; // Purple
            } else {
                colors[i * 3] = 0.2;
                colors[i * 3 + 1] = 0.5;
                colors[i * 3 + 2] = 1.0; // Blue
            }
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.8,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particleSystem = new THREE.Points(particles, particleMaterial);
        scene.add(particleSystem);

        // Circuit lines
        const lineGeometry = new THREE.BufferGeometry();
        const linePositions = [];
        const lineColors = [];

        for (let i = 0; i < 50; i++) {
            const x = (Math.random() - 0.5) * 100;
            const y = (Math.random() - 0.5) * 100;
            const z = (Math.random() - 0.5) * 50;

            linePositions.push(x, y, z);
            linePositions.push(x + (Math.random() - 0.5) * 30, y + (Math.random() - 0.5) * 30, z);

            // Cyan glow for lines
            lineColors.push(0.0, 0.9, 1.0);
            lineColors.push(0.4, 0.2, 1.0);
        }

        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

        const lineMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });

        const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(lines);

        // Floating geometric shapes
        const shapes = [];

        // Sphere
        const sphereGeometry = new THREE.SphereGeometry(3, 32, 32);
        const sphereMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x00ffff,
            metalness: 0.9,
            roughness: 0.1,
            transparent: true,
            opacity: 0.6,
            transmission: 0.5
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(-20, 10, -20);
        scene.add(sphere);
        shapes.push(sphere);

        // Torus
        const torusGeometry = new THREE.TorusGeometry(4, 1.5, 16, 100);
        const torusMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x8b5cf6,
            metalness: 0.8,
            roughness: 0.2,
            transparent: true,
            opacity: 0.7
        });
        const torus = new THREE.Mesh(torusGeometry, torusMaterial);
        torus.position.set(20, -10, -15);
        scene.add(torus);
        shapes.push(torus);

        // Cube
        const cubeGeometry = new THREE.BoxGeometry(5, 5, 5);
        const cubeEdges = new THREE.EdgesGeometry(cubeGeometry);
        const cubeMaterial = new THREE.LineBasicMaterial({ color: 0x00d4ff, linewidth: 2 });
        const cube = new THREE.LineSegments(cubeEdges, cubeMaterial);
        cube.position.set(0, 15, -25);
        scene.add(cube);
        shapes.push(cube);

        // Lights
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0x00ffff, 1, 100);
        pointLight1.position.set(20, 20, 20);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x8b5cf6, 1, 100);
        pointLight2.position.set(-20, -20, 20);
        scene.add(pointLight2);

        // Mouse movement
        const handleMouseMove = (event) => {
            mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Animation loop
        let animationId;
        const animate = () => {
            animationId = requestAnimationFrame(animate);

            // Rotate particles
            particleSystem.rotation.y += 0.0005;
            particleSystem.rotation.x += 0.0002;

            // Rotate shapes
            shapes.forEach((shape, index) => {
                shape.rotation.x += 0.005 + index * 0.001;
                shape.rotation.y += 0.003 + index * 0.001;
                shape.rotation.z += 0.002;
            });

            // Pulse circuit lines
            const time = Date.now() * 0.001;
            lineMaterial.opacity = 0.2 + Math.sin(time * 2) * 0.1;

            // Mouse parallax
            camera.position.x += (mouseRef.current.x * 5 - camera.position.x) * 0.05;
            camera.position.y += (mouseRef.current.y * 5 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };

        animate();

        // Handle resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} className="three-background" />;
};

export default ThreeBackground;
