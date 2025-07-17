"use client";

import React, { useState, useEffect } from "react";

const navLinks = [
    { name: "Home", href: "#section-greeting" },
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Journey", href: "#journey" },
    { name: "Contact", href: "#contact" },
];

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<string>('');

    useEffect(() => {
        const handleScroll = () => {
            const header = document.querySelector('header');
            const headerHeight = header ? header.getBoundingClientRect().height : 0;
            const scrollOffset = headerHeight + 50; // Additional offset for better UX

            // Check greeting section first
            const greetingEl = document.getElementById('section-greeting');
            if (greetingEl) {
                const rect = greetingEl.getBoundingClientRect();
                if (rect.top <= scrollOffset && rect.bottom > scrollOffset) {
                    setActiveSection('');
                    return;
                }
            }

            // Check other sections
            const sections = ['section-greeting', 'about', 'projects', 'journey', 'contact'];

            for (const sectionId of sections) {
                const element = document.getElementById(sectionId);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // Check if section is in view (top is above threshold and bottom is below)
                    if (rect.top <= scrollOffset && rect.bottom > scrollOffset) {
                        setActiveSection(sectionId);
                        return;
                    }
                }
            }

            // If we're at the very bottom, highlight the last section
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
                const lastSection = sections[sections.length - 1];
                const lastElement = document.getElementById(lastSection);
                if (lastElement) {
                    setActiveSection(lastSection);
                }
            }
        };

        // Set initial active section
        handleScroll();

        // Add scroll listener
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Cleanup
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLogoClick = () => {
        const el = document.getElementById('section-greeting');
        const header = document.querySelector('header');
        if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY;
            const headerHeight = header ? header.getBoundingClientRect().height : 0;
            window.scrollTo({
                top: y - headerHeight,
                behavior: 'smooth',
            });
        }
    };

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const targetId = href.substring(1); // Remove the # from href
        const el = document.getElementById(targetId);
        const header = document.querySelector('header');

        if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY;
            const headerHeight = header ? header.getBoundingClientRect().height : 0;
            window.scrollTo({
                top: y - headerHeight,
                behavior: 'smooth',
            });
        }

        // Close mobile menu if open
        setMenuOpen(false);
    };

    const isActive = (href: string) => {
        const sectionId = href.substring(1);
        return activeSection === sectionId;
    };

    return (
        <header className="fixed top-0 left-0 w-full flex items-center justify-between px-8 py-6 bg-[#0a1628] z-30 shadow">
            <div
                className="text-xl font-bold text-[#7fffd4] font-mono cursor-pointer"
                onClick={handleLogoClick}
            >&lt;KristineFung/&gt;</div>
            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-10">
                {navLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        onClick={(e) => handleNavClick(e, link.href)}
                        className={`transition-colors text-lg font-medium cursor-pointer ${isActive(link.href)
                            ? 'text-[#7fffd4]'
                            : 'text-gray-400 hover:text-[#7fffd4]'
                            }`}
                    >
                        {link.name}
                    </a>
                ))}
            </nav>
            {/* Hamburger Icon */}
            <button
                className="md:hidden flex flex-col justify-center items-center w-8 h-8 z-40 cursor-pointer"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Toggle menu"
            >
                <span className={`block w-6 h-0.5 bg-[#7fffd4] mb-1 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`block w-6 h-0.5 bg-[#7fffd4] mb-1 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block w-6 h-0.5 bg-[#7fffd4] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </button>
            {/* Mobile Nav Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-[250px] bg-[#0a1628] z-30 shadow-lg transform transition-transform duration-300 md:hidden flex flex-col items-center pt-24 gap-6 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                style={{ willChange: 'transform' }}
            >
                {navLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        onClick={(e) => handleNavClick(e, link.href)}
                        className={`transition-colors text-lg font-medium cursor-pointer ${isActive(link.href)
                            ? 'text-[#7fffd4]'
                            : 'text-gray-400 hover:text-[#7fffd4]'
                            }`}
                    >
                        {link.name}
                    </a>
                ))}
            </div>
            {/* Overlay */}
            {menuOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-20 md:hidden"
                    onClick={() => setMenuOpen(false)}
                />
            )}
        </header>
    );
} 