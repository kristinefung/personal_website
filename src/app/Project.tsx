import { FaCode, FaChartBar, FaMobileAlt, FaGithub, FaExternalLinkAlt } from "react-icons/fa";

const projects = [
    {
        icon: <FaCode size={64} className="text-teal-300 mx-auto mb-6" />,
        title: "E-commerce Platform",
        description:
            "A full-stack e-commerce solution with product management, cart functionality, and payment processing.",
        tech: ["React", "Node.js", "MongoDB"],
        github: "#",
        external: "#",
    },
    {
        icon: <FaChartBar size={64} className="text-teal-300 mx-auto mb-6" />,
        title: "Analytics Dashboard",
        description:
            "Interactive dashboard for visualizing and analyzing business metrics with real-time updates.",
        tech: ["Vue.js", "D3.js", "Firebase"],
        github: "#",
        external: "#",
    },
    {
        icon: <FaMobileAlt size={64} className="text-teal-300 mx-auto mb-6" />,
        title: "Mobile Fitness App",
        description:
            "Cross-platform mobile application for tracking workouts, nutrition, and personal fitness goals.",
        tech: ["React Native", "Redux", "GraphQL"],
        github: "#",
        external: "#",
    },
];

export default function Project() {
    return (
        <section className="py-24 px-16 bg-[#112240] w-full">
            <h2 className="text-4xl font-bold text-white mb-2">My Projects</h2>
            <div className="h-1 w-32 bg-teal-300 mb-10" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, idx) => (
                    <div
                        key={idx}
                        className="bg-[#0b192f] rounded-xl shadow-lg overflow-hidden flex flex-col justify-between min-h-[350px]"
                    >
                        <div className="flex-1 flex flex-col justify-center items-center p-8 pb-0">
                            {project.icon}
                        </div>
                        <div className="p-8 pt-0">
                            <div className="flex items-center mb-2">
                                <h3 className="text-xl font-bold text-white flex-1">
                                    {project.title}
                                </h3>
                                <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-300 mr-3">
                                    <FaGithub />
                                </a>
                                <a href={project.external} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-300">
                                    <FaExternalLinkAlt />
                                </a>
                            </div>
                            <p className="text-gray-300 mb-4 text-base">{project.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {project.tech.map((tech, i) => (
                                    <span
                                        key={i}
                                        className="bg-[#ffffff11] text-teal-200 px-3 py-1 rounded-md text-sm font-medium"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
} 