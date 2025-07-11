"use client";
import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { Globe } from "@/components/magicui/globe";
import { Particles } from "@/components/magicui/particles";
import { useTheme } from "next-themes";
import { Meteors } from "@/components/magicui/meteors";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { ArrowRight, Link, Rocket, Satellite, Star } from "lucide-react";

export default function Page() {
  const { resolvedTheme } = useTheme();
  return (
    <div className="overflow-hidden h-screen w-screen bg-black bg-cover bg-center bg-no-repeat">
      
      <div className="relative h-full w-full overflow-hidden flex items-center justify-between px-8 lg:px-24">
        {/* Left Content */}
        <div className="z-10 max-w-2xl">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-sm mb-6">
              <Star className="w-4 h-4" />
              Explore the Cosmos
            </div>

            <h1 className="text-6xl lg:text-8xl font-bold bg-gradient-to-b from-white to-gray-300/80 bg-clip-text text-transparent leading-tight">
              AstroGuide
            </h1>

            <p className="text-xl lg:text-2xl text-gray-300 mt-6 leading-relaxed">
              Your comprehensive space exploration platform. Track asteroids,
              monitor space weather, and discover the wonders of the universe
              with real-time NASA data.
            </p>
          </div>

          <div className="flex gap-12 mt-8">
              <RainbowButton className="group" onClick={() => { window.location.href = "./links"; }}>
                <Rocket className="w-5 h-5 mr-2" />
                Start Exploring
                <ArrowRight className="w-4 h-4 ml-2" />
              </RainbowButton>
            <ShimmerButton
              className="shadow-2xl"
              background="#ffffff"
              shimmerColor="#000000"
              onClick={() => { window.location.href = "./"; }}
            >
              <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-black dark:text-black lg:text-lg">
                No Get to Know
              </span>
            </ShimmerButton>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">10K+</div>
              <div className="text-sm text-gray-400">Asteroids Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-sm text-gray-400">Live Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">Real-time</div>
              <div className="text-sm text-gray-400">Data</div>
            </div>
          </div>
        </div>
        <Meteors number={30} className="absolute inset-0 z-[1]" />
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
    </div>
  );
}
