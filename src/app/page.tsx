"use client";

import Header from "../component/Header";
import Greeting from "./Greeting";
import About from "./About";
import Project from "./Project";
import Journey from "./Journey";

export default function Home() {
  return (
    <>
      <Header />
      <main className="bg-[#0a1628] min-h-screen">
        <Greeting />
        <About />
        <Project />
        <Journey />
      </main>
    </>
  );
}
