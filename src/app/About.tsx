import React from 'react';
import Image from 'next/image';

const technologies = [
    ['TypeScript', 'React', 'Express'],
    ['GoLang', 'Flutter', 'AWS'],
];

export default function About() {
    return (
        <section id="about" className="w-full flex flex-col md:flex-row items-center md:items-start justify-between py-12">
            <div className="flex-1 md:mr-12">
                <h2 className="text-4xl font-bold text-gray-100 mb-2">About Me</h2>
                <div className="w-24 h-1 bg-[#7fffd4] mb-8" />
                <p className="text-gray-400 text-lg mb-4">
                    Hello! I'm Kristine, a software developer with a passion for creating elegant solutions to complex problems. My journey in tech began when I was 15 years old, tinkering with HTML and CSS to build my first website.
                </p>
                <p className="text-gray-400 text-lg mb-6">
                    Here are a few technologies I've been working with recently:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-2 text-lg text-gray-100 font-mono mb-8">
                    {technologies.map((col, i) => (
                        <ul key={i} className="list-none">
                            {col.map((tech) => (
                                <li key={tech} className="flex items-center mb-1">
                                    <span className="text-[#7fffd4] mr-2">▸</span> {tech}
                                </li>
                            ))}
                        </ul>
                    ))}
                </div>
            </div>
            <div className="flex-1 flex justify-center md:justify-end mt-8 md:mt-0">
                <Image src="/square-placeholder.jpg" alt="Avatar" width={96} height={96} className="object-cover w-80 h-80" />

            </div>
        </section>
    );
} 