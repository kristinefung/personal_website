import React from "react";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Contact() {
    return (
        <section className="py-24 px-8 md:px-16 bg-[#112240] w-full flex flex-col items-center">
            <h2 className="text-4xl font-bold text-white mb-2">Get In Touch</h2>
            <p className="text-gray-400 mb-8 text-center max-w-2xl">
                Whether you have a question or just want to say hi, I'll do my best to get back to you!
            </p>
            <form autoComplete="off" className="bg-[#0a1628] rounded-lg p-8 w-full max-w-2xl flex flex-col gap-6 shadow-lg">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <label className="block text-gray-300 mb-2" htmlFor="email">Email</label>
                        <input className="w-full p-2 rounded bg-[#1e3557] text-white focus:outline-none focus:ring-2 focus:ring-[#7fffd4]" type="email" id="email" name="email" />
                    </div>
                    <div className="flex-1">
                        <label className="block text-gray-300 mb-2" htmlFor="phone">Phone</label>
                        <input className="w-full p-2 rounded bg-[#1e3557] text-white focus:outline-none focus:ring-2 focus:ring-[#7fffd4]" type="text" id="phone" name="phone" />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <label className="block text-gray-300 mb-2" htmlFor="name">Name</label>
                        <input className="w-full p-2 rounded bg-[#1e3557] text-white focus:outline-none focus:ring-2 focus:ring-[#7fffd4]" type="text" id="name" name="name" />
                    </div>
                </div>
                <div>
                    <label className="block text-gray-300 mb-2" htmlFor="subject">Subject</label>
                    <input className="w-full p-2 rounded bg-[#1e3557] text-white focus:outline-none focus:ring-2 focus:ring-[#7fffd4]" type="text" id="subject" name="subject" />
                </div>
                <div>
                    <label className="block text-gray-300 mb-2" htmlFor="message">Message</label>
                    <textarea className="w-full p-2 rounded bg-[#1e3557] text-white h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[#7fffd4]" id="message" name="message" />
                </div>
                <div className="flex justify-center mt-4">
                    <button type="submit" className="px-8 py-3 border border-[#7fffd4] text-[#7fffd4] rounded hover:bg-[#7fffd4] hover:text-[#0a1628] transition-colors font-semibold cursor-pointer">
                        Send Message
                    </button>
                </div>
            </form>
            <div className="mt-10 flex flex-col items-center">
                <p className="text-gray-400 mb-4 text-lg">Or reach out directly:</p>
                <div className="flex gap-8">
                    <a href="#" aria-label="Email" className="text-gray-400 hover:text-[#7fffd4] text-3xl transition-colors"><FaEnvelope /></a>
                    <a href="#" aria-label="GitHub" className="text-gray-400 hover:text-[#7fffd4] text-3xl transition-colors"><FaGithub /></a>
                    <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-[#7fffd4] text-3xl transition-colors"><FaLinkedin /></a>
                </div>
            </div>
        </section>
    );
} 