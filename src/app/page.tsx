"use client";

import Header from "../component/Header";
import Greeting from "./Greeting";
import About from "./About";

export default function Home() {
  return (
    <>
      <Header />
      <main className="px-12 bg-[#0a1628] min-h-screen">
        <Greeting />
        <About />
      </main>
    </>
  );
}
