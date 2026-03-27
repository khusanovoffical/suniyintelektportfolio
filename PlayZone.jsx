import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Trophy } from 'lucide-react';
import * as THREE from 'three';
import { Button } from './ui/button';
import { toast } from '../hooks/use-toast';
import { Toaster } from './ui/toaster';

const PlayZone = () => {
    const [activeGame, setActiveGame] = useState(null);
    const [snakeScore, setSnakeScore] = useState(0);
    const [shooterScore, setShooterScore] = useState(0);
    const [snakeHighScore, setSnakeHighScore] = useState(0);
    const [shooterHighScore, setShooterHighScore] = useState(0);
    const snakeCanvasRef = useRef(null);
    const shooterMountRef = useRef(null);

    // 3D Snake Game
    useEffect(() => {
        if (activeGame !== 'snake' || !snakeCanvasRef.current) return;

        const canvas = snakeCanvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = 600;
        canvas.height = 600;

        const gridSize = 20;
        const tileCount = canvas.width / gridSize;

        let snake = [{ x: 10, y: 10 }];
        let food = { x: 15, y: 15 };
        let dx = 0;
        let dy = 0;
        let score = 0;
        let gameRunning = true;

        const drawGame = () => {
            if (!gameRunning) return;

            // Clear canvas with cyberpunk background
            ctx.fillStyle = '#0a0a0f';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw grid
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.1)';
            ctx.lineWidth = 1;
            for (let i = 0; i < tileCount; i++) {
                ctx.beginPath();
                ctx.moveTo(i * gridSize, 0);
                ctx.lineTo(i * gridSize, canvas.height);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(0, i * gridSize);
                ctx.lineTo(canvas.width, i * gridSize);
                ctx.stroke();
            }

            // Move snake
            const head = { x: snake[0].x + dx, y: snake[0].y + dy };

            // Check wall collision
            if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
                gameRunning = false;
                if (score > snakeHighScore) setSnakeHighScore(score);
                toast({
                    title: "Game Over!",
                    description: `Final Score: ${score}`,
                    variant: "destructive"
                });
                return;
            }

            // Check self collision
            for (let segment of snake) {
                if (head.x === segment.x && head.y === segment.y) {
                    gameRunning = false;
                    if (score > snakeHighScore) setSnakeHighScore(score);
                    toast({
                        title: "Game Over!",
                        description: `Final Score: ${score}`,
                        variant: "destructive"
                    });
                    return;
                }
            }

            snake.unshift(head);

            // Check food collision
            if (head.x === food.x && head.y === food.y) {
                score += 10;
                setSnakeScore(score);
                food = {
                    x: Math.floor(Math.random() * tileCount),
                    y: Math.floor(Math.random() * tileCount)
                };
            } else {
                snake.pop();
            }

            // Draw snake with 3D effect
            snake.forEach((segment, index) => {
                const gradient = ctx.createLinearGradient(
                    segment.x * gridSize,
                    segment.y * gridSize,
                    (segment.x + 1) * gridSize,
                    (segment.y + 1) * gridSize
                );

                if (index === 0) {
                    gradient.addColorStop(0, '#06b6d4');
                    gradient.addColorStop(1, '#0ea5e9');
                } else {
                    gradient.addColorStop(0, '#8b5cf6');
                    gradient.addColorStop(1, '#6d28d9');
                }

                ctx.fillStyle = gradient;
                ctx.fillRect(
                    segment.x * gridSize + 2,
                    segment.y * gridSize + 2,
                    gridSize - 4,
                    gridSize - 4
                );

                // Neon glow
                ctx.shadowBlur = 15;
                ctx.shadowColor = index === 0 ? '#06b6d4' : '#8b5cf6';
            });

            // Draw food with glow
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#22d3ee';
            ctx.fillStyle = '#22d3ee';
            ctx.beginPath();
            ctx.arc(
                food.x * gridSize + gridSize / 2,
                food.y * gridSize + gridSize / 2,
                gridSize / 2 - 2,
                0,
                Math.PI * 2
            );
            ctx.fill();

            ctx.shadowBlur = 0;
        };

        const gameLoop = setInterval(drawGame, 100);

        const handleKeyPress = (e) => {
            if (!gameRunning) return;

            switch (e.key) {
                case 'ArrowUp':
                    if (dy === 0) { dx = 0; dy = -1; }
                    break;
                case 'ArrowDown':
                    if (dy === 0) { dx = 0; dy = 1; }
                    break;
                case 'ArrowLeft':
                    if (dx === 0) { dx = -1; dy = 0; }
                    break;
                case 'ArrowRight':
                    if (dx === 0) { dx = 1; dy = 0; }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            clearInterval(gameLoop);
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [activeGame, snakeHighScore]);

    // Physics Shooter Game
    useEffect(() => {
        if (activeGame !== 'shooter' || !shooterMountRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
        camera.position.z = 30;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(800, 600);
        renderer.setClearColor(0x0a0a0f);
        shooterMountRef.current.appendChild(renderer.domElement);

        // Targets
        const targets = [];
        const targetGeometry = new THREE.BoxGeometry(2, 2, 2);

        for (let i = 0; i < 5; i++) {
            const material = new THREE.MeshPhongMaterial({
                color: Math.random() * 0xffffff,
                emissive: 0x00ffff,
                emissiveIntensity: 0.2
            });
            const target = new THREE.Mesh(targetGeometry, material);
            target.position.set(
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 20,
                -20
            );
            target.userData.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1,
                0
            );
            scene.add(target);
            targets.push(target);
        }

        // Projectiles
        const projectiles = [];

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x00ffff, 1, 100);
        pointLight.position.set(0, 0, 20);
        scene.add(pointLight);

        // Shoot projectile
        const shoot = (x, y) => {
            const projectileGeometry = new THREE.SphereGeometry(0.3, 16, 16);
            const projectileMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff });
            const projectile = new THREE.Mesh(projectileGeometry, projectileMaterial);

            const mouse3D = new THREE.Vector3(
                (x / 800) * 2 - 1,
                -(y / 600) * 2 + 1,
                0.5
            );
            mouse3D.unproject(camera);

            const direction = mouse3D.sub(camera.position).normalize();
            projectile.position.copy(camera.position);
            projectile.userData.velocity = direction.multiplyScalar(0.8);

            scene.add(projectile);
            projectiles.push(projectile);
        };

        const handleClick = (e) => {
            const rect = renderer.domElement.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            shoot(x, y);
        };

        renderer.domElement.addEventListener('click', handleClick);

        // Animation
        let score = 0;
        let animationId;
        const animate = () => {
            animationId = requestAnimationFrame(animate);

            // Move targets
            targets.forEach(target => {
                target.position.add(target.userData.velocity);
                target.rotation.x += 0.01;
                target.rotation.y += 0.01;

                if (Math.abs(target.position.x) > 20) target.userData.velocity.x *= -1;
                if (Math.abs(target.position.y) > 15) target.userData.velocity.y *= -1;
            });

            // Move projectiles and check collisions
            for (let i = projectiles.length - 1; i >= 0; i--) {
                const projectile = projectiles[i];
                projectile.position.add(projectile.userData.velocity);

                // Remove if too far
                if (projectile.position.length() > 50) {
                    scene.remove(projectile);
                    projectiles.splice(i, 1);
                    continue;
                }

                // Check collision with targets
                for (let j = targets.length - 1; j >= 0; j--) {
                    const target = targets[j];
                    if (projectile.position.distanceTo(target.position) < 1.5) {
                        scene.remove(projectile);
                        projectiles.splice(i, 1);

                        target.position.set(
                            (Math.random() - 0.5) * 30,
                            (Math.random() - 0.5) * 20,
                            -20
                        );

                        score += 10;
                        setShooterScore(score);
                        if (score > shooterHighScore) setShooterHighScore(score);
                        break;
                    }
                }
            }

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationId);
            renderer.domElement.removeEventListener('click', handleClick);
            if (shooterMountRef.current && renderer.domElement) {
                shooterMountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, [activeGame, shooterHighScore]);

    const resetGame = () => {
        setSnakeScore(0);
        setShooterScore(0);
        setActiveGame(null);
        setTimeout(() => setActiveGame(activeGame === 'snake' ? 'snake' : 'shooter'), 10);
    };

    return (
        <div className="playzone-container">
            <Toaster />
            <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <Link to="/">
                            <Button variant="outline" className="cyber-button-outline">
                                <ArrowLeft className="mr-2" size={20} />
                                Back to Portfolio
                            </Button>
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-bold neon-text-gradient">Play Zone</h1>
                        <div className="w-32"></div>
                    </div>

                    {!activeGame && (
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* 3D Snake Card */}
                            <div className="glassmorphic-card p-8 text-center cursor-pointer hover:scale-105 transition-transform" onClick={() => setActiveGame('snake')}>
                                <div className="text-6xl mb-4">🐍</div>
                                <h2 className="text-3xl font-bold mb-4 text-cyan-300">3D Snake</h2>
                                <p className="text-gray-300 mb-6">Classic gameplay in glowing 3D space. Use arrow keys to control.</p>
                                <div className="flex items-center justify-center space-x-2 text-yellow-400">
                                    <Trophy size={24} />
                                    <span className="text-xl">High Score: {snakeHighScore}</span>
                                </div>
                            </div>

                            {/* Physics Shooter Card */}
                            <div className="glassmorphic-card p-8 text-center cursor-pointer hover:scale-105 transition-transform" onClick={() => setActiveGame('shooter')}>
                                <div className="text-6xl mb-4">🎯</div>
                                <h2 className="text-3xl font-bold mb-4 text-purple-300">Physics Shooter</h2>
                                <p className="text-gray-300 mb-6">Click to shoot projectiles at moving 3D targets with realistic physics.</p>
                                <div className="flex items-center justify-center space-x-2 text-yellow-400">
                                    <Trophy size={24} />
                                    <span className="text-xl">High Score: {shooterHighScore}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeGame === 'snake' && (
                        <div className="glassmorphic-card p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-bold text-cyan-300">3D Snake</h2>
                                <div className="flex items-center space-x-6">
                                    <div className="text-xl">Score: <span className="text-cyan-400 font-bold">{snakeScore}</span></div>
                                    <Button onClick={resetGame} variant="outline" className="cyber-button-outline">
                                        <RotateCcw className="mr-2" size={20} />
                                        Restart
                                    </Button>
                                    <Button onClick={() => setActiveGame(null)} variant="outline">
                                        Exit
                                    </Button>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <canvas ref={snakeCanvasRef} className="border-2 border-cyan-500 neon-border-glow rounded-lg" />
                            </div>
                            <p className="text-center text-gray-400 mt-4">Use Arrow Keys to move</p>
                        </div>
                    )}

                    {activeGame === 'shooter' && (
                        <div className="glassmorphic-card p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-bold text-purple-300">Physics Shooter</h2>
                                <div className="flex items-center space-x-6">
                                    <div className="text-xl">Score: <span className="text-purple-400 font-bold">{shooterScore}</span></div>
                                    <Button onClick={resetGame} variant="outline" className="cyber-button-outline">
                                        <RotateCcw className="mr-2" size={20} />
                                        Restart
                                    </Button>
                                    <Button onClick={() => setActiveGame(null)} variant="outline">
                                        Exit
                                    </Button>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <div ref={shooterMountRef} className="border-2 border-purple-500 neon-border-glow rounded-lg" />
                            </div>
                            <p className="text-center text-gray-400 mt-4">Click anywhere to shoot projectiles at targets</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlayZone;
