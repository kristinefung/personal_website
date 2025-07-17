import React from "react";

const experiences = [
    {
        year: "2021 - Present",
        title: "Full Stack Developer",
        company: "xxx Innovations Inc.",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tortor neque, pretium a nisi sit amet, sagittis pulvinar orci. ",
    },
    {
        year: "2018 - 2021",
        title: "Full Stack Developer",
        company: "xxx Solutions Co.",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tortor neque, pretium a nisi sit amet, sagittis pulvinar orci. ",
    },
];

export default function Journey() {
    return (
        <section className="py-24 px-8 md:px-16 bg-[#0a1628] w-full">
            <h2 className="text-4xl font-bold text-white mb-2">My Journey</h2>
            <div className="h-1 w-32 bg-[#7fffd4] mb-10" />
            <div className="relative ml-4">
                {experiences.map((exp, idx) => (
                    <div key={idx} className="relative flex items-start mb-6">
                        {/* Timeline Line - spans full height of content */}
                        <div className="absolute left-2 top-6 bottom-0 w-1 bg-[#7fffd4] transform -translate-x-1/2" />
                        {/* Timeline Dot */}
                        <div className="relative z-10 mr-6">
                            <span className="w-4 h-4 bg-[#7fffd4] rounded-full block mt-2" />
                        </div>
                        {/* Content */}
                        <div className="mb-6">
                            <div className="text-[#7fffd4] text-xl font-mono mb-2">{exp.year}</div>
                            <div className="text-2xl md:text-2xl font-bold text-white mb-2">{exp.title}</div>
                            <div className="text-[#7fffd4] font-bold text-lg mb-2">{exp.company}</div>
                            <div className="text-gray-400 text-base max-w-3xl">{exp.description}</div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
} 