"use client";

import Header from "../component/Header";
import Greeting from "./Greeting";

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-24 px-4 bg-[#0a1628] min-h-screen">
        <Greeting />
      </main>
    </>
  );
}
