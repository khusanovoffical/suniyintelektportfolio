import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Github, Linkedin, Mail, Code, Smartphone, Palette, Send, ExternalLink, Sparkles, Gamepad2 } from 'lucide-react';
import ThreeBackground from '../components/ThreeBackground';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { toast } from '../hooks/use-toast';
import { Toaster } from '../components/ui/toaster';

const Portfolio = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [typewriterText, setTypewriterText] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const projectCardsRef = useRef([]);
    const skillBarsRef = useRef([]);

    const fullBio = "I am a passionate web developer and freelancer focused on building high-performance websites and modern mobile applications. I specialize in Flutter development and love creating immersive UI/UX experiences with 3D elements.";

    // Typewriter effect
    useEffect(() => {
        let index = 0;
        const timer = setInterval(() => {
            if (index <= fullBio.length) {
                setTypewriterText(fullBio.slice(0, index));
                index++;
            } else {
                clearInterval(timer);
            }
        }, 50);
        return () => clearInterval(timer);
    }, []);

    // Magnetic hover effect
    const handleMagneticHover = (e, element) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        element.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    };

    const handleMagneticLeave = (element) => {
        element.style.transform = 'translate(0, 0)';
    };

    // 3D Tilt effect for project cards
    useEffect(() => {
        projectCardsRef.current.forEach(card => {
            if (!card) return;

            const handleMouseMove = (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            };

            const handleMouseLeave = () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            };

            card.addEventListener('mousemove', handleMouseMove);
            card.addEventListener('mouseleave', handleMouseLeave);

            return () => {
                card.removeEventListener('mousemove', handleMouseMove);
                card.removeEventListener('mouseleave', handleMouseLeave);
            };
        });
    }, []);

    // Animated skill bars
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.width = entry.target.dataset.width;
                }
            });
        }, { threshold: 0.5 });

        skillBarsRef.current.forEach(bar => {
            if (bar) observer.observe(bar);
        });

        return () => observer.disconnect();
    }, []);

    const skills = [
        { name: 'HTML5', level: 95 },
        { name: 'CSS3 (Glassmorphism/Neon)', level: 92 },
        { name: 'JavaScript (ES6+)', level: 90 },
        { name: 'Flutter', level: 88 },
        { name: 'Dart', level: 85 }
    ];

    const projects = [
        {
            title: 'Cyber-Security Dashboard',
            description: 'Real-time threat monitoring system with advanced analytics and AI-powered detection.',
            tech: ['React', 'Node.js', 'TensorFlow', 'WebSockets'],
            gradient: 'from-cyan-500 to-blue-600'
        },
        {
            title: 'Flutter Mobile App',
            description: 'Cross-platform e-commerce application with seamless UX and AR product preview.',
            tech: ['Flutter', 'Dart', 'Firebase', 'ARCore'],
            gradient: 'from-purple-500 to-pink-600'
        },
        {
            title: 'Modern Landing Page',
            description: 'High-conversion SaaS landing page with 3D animations and interactive elements.',
            tech: ['Next.js', 'Three.js', 'Tailwind', 'Framer Motion'],
            gradient: 'from-indigo-500 to-cyan-500'
        }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        toast({
            title: "Message Transmitted! 🚀",
            description: "Your message has been sent successfully. I'll get back to you soon!",
        });
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="portfolio-container">
            <ThreeBackground />
            <Toaster />

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 glassmorphic-nav">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="text-2xl font-bold neon-text-cyan">Humoyun</div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex space-x-6">
                        {['About', 'Skills', 'Projects', 'Play Zone', 'Contact'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase().replace(' ', '-')}`}
                                className="nav-link magnetic-element"
                                onMouseMove={(e) => handleMagneticHover(e, e.currentTarget)}
                                onMouseLeave={(e) => handleMagneticLeave(e.currentTarget)}
                            >
                                {item}
                            </a>
                        ))}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-cyan-400"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden glassmorphic-card mx-4 mb-4 p-4">
                        {['About', 'Skills', 'Projects', 'Play Zone', 'Contact'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase().replace(' ', '-')}`}
                                className="block py-3 text-cyan-300 hover:text-cyan-100 transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="max-w-7xl mx-auto px-6 py-32 md:py-48 text-center relative z-10">
                    <div className="inline-block mb-6">
                        <Sparkles className="inline-block mr-2 text-cyan-400 animate-pulse" size={32} />
                        <span className="text-purple-400 text-xl">Full-Stack Web Developer & UI/UX Designer</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-bold mb-8 neon-text-gradient">
                        HUMOYUN
                    </h1>
                    <div className="typewriter-container glassmorphic-card max-w-3xl mx-auto p-6 mb-12">
                        <p className="text-lg md:text-xl text-cyan-100">
                            {typewriterText}
                            <span className="typewriter-cursor">|</span>
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button
                            className="magnetic-element cyber-button"
                            onMouseMove={(e) => handleMagneticHover(e, e.currentTarget)}
                            onMouseLeave={(e) => handleMagneticLeave(e.currentTarget)}
                        >
                            <a href="#contact" className="flex items-center">
                                <Mail className="mr-2" size={20} />
                                Get In Touch
                            </a>
                        </Button>
                        <Button
                            variant="outline"
                            className="magnetic-element cyber-button-outline"
                            onMouseMove={(e) => handleMagneticHover(e, e.currentTarget)}
                            onMouseLeave={(e) => handleMagneticLeave(e.currentTarget)}
                        >
                            <a href="#projects" className="flex items-center">
                                <Code className="mr-2" size={20} />
                                View Projects
                            </a>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Skills Section */}
            <section id="skills" className="py-24 relative z-10">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="section-title">Technical Arsenal</h2>
                    <div className="glassmorphic-card p-8 md:p-12">
                        <div className="grid gap-8">
                            {skills.map((skill, index) => (
                                <div key={skill.name} className="skill-item">
                                    <div className="flex justify-between mb-3">
                                        <span className="text-lg font-semibold text-cyan-300">{skill.name}</span>
                                        <span className="text-purple-400 font-mono">{skill.level}%</span>
                                    </div>
                                    <div className="skill-bar-container">
                                        <div
                                            ref={el => skillBarsRef.current[index] = el}
                                            className="skill-bar"
                                            data-width={`${skill.level}%`}
                                            style={{ width: '0%', transition: 'width 2s ease-out' }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="py-24 relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="section-title">Featured Projects</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {projects.map((project, index) => (
                            <div
                                key={project.title}
                                ref={el => projectCardsRef.current[index] = el}
                                className="project-card glassmorphic-card p-6 cursor-pointer"
                                style={{ transition: 'transform 0.1s ease-out' }}
                            >
                                <div className={`project-card-header bg-gradient-to-br ${project.gradient} mb-4`}></div>
                                <h3 className="text-2xl font-bold mb-3 text-cyan-100">{project.title}</h3>
                                <p className="text-gray-300 mb-4">{project.description}</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.tech.map(tech => (
                                        <span key={tech} className="tech-tag">{tech}</span>
                                    ))}
                                </div>
                                <Button variant="ghost" className="w-full neon-border group">
                                    <span className="flex items-center justify-center text-cyan-400 group-hover:text-cyan-200">
                                        View Project <ExternalLink className="ml-2" size={16} />
                                    </span>
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Play Zone CTA */}
            <section id="play-zone" className="py-24 relative z-10">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="glassmorphic-card p-12">
                        <Gamepad2 className="inline-block text-cyan-400 mb-6 animate-bounce" size={64} />
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 neon-text-gradient">Enter the Play Zone</h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Test your skills with 3D Snake and Physics Shooter games built with WebGL and Three.js
                        </p>
                        <Link to="/playground">
                            <Button className="magnetic-element cyber-button text-lg px-8 py-6">
                                Launch Games
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-24 relative z-10">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="section-title">Initiate Contact</h2>
                    <div className="glassmorphic-card p-8 md:p-12">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="holographic-input-wrapper">
                                <Input
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="holographic-input"
                                    required
                                />
                            </div>
                            <div className="holographic-input-wrapper">
                                <Input
                                    type="email"
                                    placeholder="Your Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="holographic-input"
                                    required
                                />
                            </div>
                            <div className="holographic-input-wrapper">
                                <Textarea
                                    placeholder="Your Message"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="holographic-input min-h-[150px]"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full cyber-button text-lg py-6">
                                <Send className="mr-2" size={20} />
                                Transmit Message
                            </Button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 relative z-10 border-t border-cyan-900/30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-cyan-400 mb-4 md:mb-0">
                            <p className="text-lg font-semibold">© 2025 Humoyun. All rights reserved.</p>
                        </div>
                        <div className="flex space-x-6">
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                <Github size={24} />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                <Linkedin size={24} />
                            </a>
                            <a href="mailto:humoyun@example.com" className="social-link">
                                <Mail size={24} />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Portfolio;
