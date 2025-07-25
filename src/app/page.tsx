"use client";

import Header from "@/component/customer/Header";
import Greeting from "@/app/_components/Greeting";
import About from "@/app/_components/About";
import Project from "@/app/_components/Project";
import Journey from "@/app/_components/Journey";
import Contact from "@/app/_components/Contact";
import Footer from "@/component/customer/Footer";
export default function Home() {
  return (
    <>
      <Header />
      <main className="bg-[#0a1628] min-h-screen">
        <Greeting />
        <About />
        <Project />
        <Journey />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
