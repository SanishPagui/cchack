"use client";
import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { Globe } from "@/components/magicui/globe";
import { Particles } from "@/components/magicui/particles";
import { useTheme } from "next-themes";
import { Meteors } from "@/components/magicui/meteors";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { RainbowButton } from "@/components/magicui/rainbow-button";

export default function Page() {
  const { resolvedTheme } = useTheme();
  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-black bg-cover bg-center bg-no-repeat">
      <Navbar />
      <Meteors number={30} className="absolute inset-0 z-[1]" />
      <div className="relative h-[100vh] w-full overflow-hidden">
        <span className="absolute left-24 top-2/5 transform -translate-y-1/2 z-10 text-9xl font-semibold bg-gradient-to-b from-white to-gray-300/80 bg-clip-text text-transparent">
          AstroGuide
          <div className="flex gap-12 mt-8">
            <RainbowButton>Get To Know</RainbowButton>
            <ShimmerButton
              className="shadow-2xl"
              background="#ffffff"
              shimmerColor="#000000"
            >
              <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-black dark:text-black lg:text-lg">
                No Get to Know
              </span>
            </ShimmerButton>
          </div>
        </span>
        <Particles
          className="absolute inset-0 z-0"
          quantity={500}
          ease={80}
          color={"#ffffff"}
          refresh
        />
        <Globe className="absolute left-240 top-1/2 transform -translate-y-1/2 scale-[1.5] z-0" />
        <div className="pointer-events-none absolute inset-0 h-full w-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" />
      </div>
      <div>
      </div>
    </div>
  );
}

