"use client";

import React, { useState } from "react";

const navLinks = [
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Journey", href: "#journey" },
    { name: "Contact", href: "#contact" },
];

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 w-full flex items-center justify-between px-8 py-6 bg-[#0a1628] z-30 shadow">
            <div className="text-xl font-bold text-[#7fffd4] font-mono">&lt;KristineFung/&gt;</div>
            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-10">
                {navLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors text-lg font-medium"
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
                        className="text-gray-400 hover:text-white transition-colors text-lg font-medium"
                        onClick={() => setMenuOpen(false)}
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