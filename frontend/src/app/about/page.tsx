"use client"

import { useRef } from "react"
import { useCosmicCanvas } from "../components/useCosmicCanvas"
import { Particles } from "@/components/magicui/particles"

export default function AboutPage() {
  const canvasRef = useRef(null)
  useCosmicCanvas(canvasRef)

  return (
    <div className="relative min-h-screen text-white bg-black overflow-hidden">
      {/* Cosmic Background */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full min-h-screen pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.1) 0%, rgba(30, 41, 59, 0.05) 50%, transparent 100%)",
        }}
      />
      <Particles className="absolute inset-0 z-0" quantity={300} ease={80} color="#ffffff" refresh />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24 md:py-32 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">🚀 About Space Explorer</h1>

        <p className="text-gray-300 text-lg leading-relaxed mb-6">
          Space Explorer is your window into the universe. Powered by real-time data from NASA’s public APIs,
          this application delivers a dynamic interface to monitor asteroids, solar activity, Mars rover updates,
          Earth images, and more.
        </p>

        <p className="text-gray-400 text-sm mb-10">
          Built with ❤️ using React, TailwindCSS, and the power of the open cosmos.
        </p>

        <div className="text-left w-full space-y-6 text-gray-300 text-base leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">🌌 Our Mission</h2>
            <p>
              To make space data accessible and visually engaging for everyone — from casual stargazers to aspiring astrophysicists.
              We aim to inspire curiosity, learning, and a deeper connection to the cosmos.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">🛰️ What You Can Explore</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Real-time asteroid tracking & threat analysis</li>
              <li>Solar flares, CMEs, and geomagnetic storms</li>
              <li>Mars Rover image gallery and metadata</li>
              <li>Daily astronomy photos with expert context</li>
              <li>Earth imagery from deep-space satellites</li>
              <li>Natural disaster alerts from space</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">🧠 Fun Facts About Space</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Space is completely silent — there’s no atmosphere for sound to travel.</li>
              <li>Venus is hotter than Mercury, despite being farther from the Sun.</li>
              <li>There are more stars in the universe than grains of sand on Earth.</li>
              <li>NASA's Voyager 1 has traveled over 24 billion km from Earth — and it's still going!</li>
            </ul>
          </div>
        </div>

        <button
          onClick={() => window.location.href = "/"}
          className="mt-12 px-6 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition-colors text-sm border border-gray-600"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  )
}
