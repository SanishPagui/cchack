"use client"

import { useRef } from "react"
import { useCosmicCanvas } from "../components/useCosmicCanvas"
import { Particles } from "@/components/magicui/particles"

export default function AboutPage() {
  const canvasRef = useRef(null)
  useCosmicCanvas(canvasRef)

  return (
    <div className="relative min-h-screen text-white bg-black overflow-hidden">
      {/* Enhanced Cosmic Background */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full min-h-screen pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(147, 51, 234, 0.15) 0%, rgba(30, 41, 59, 0.08) 40%, transparent 70%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, rgba(30, 41, 59, 0.05) 50%, transparent 80%)",
        }}
      />
      <Particles className="absolute inset-0 z-0" quantity={400} ease={60} color="#ffffff" refresh />
      
      {/* Floating orbs for depth */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24 md:py-32 max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="mb-16 space-y-6">
          <div className="inline-block p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full backdrop-blur-sm border border-purple-500/30 mb-4">
            <span className="text-4xl">🚀</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-300 to-blue-400 bg-clip-text text-transparent animate-pulse">
            Space Explorer
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Your gateway to the cosmos — powered by real-time NASA data and endless curiosity
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 w-full mb-16">
          {/* Mission Card */}
          <div className="group p-6 bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl hover:bg-gray-800/50 hover:border-purple-500/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">🌌</div>
              <h2 className="text-2xl font-semibold text-white">Our Mission</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Making space data accessible and visually engaging for everyone — from casual stargazers to aspiring astrophysicists. 
              We inspire curiosity, learning, and a deeper connection to the cosmos.
            </p>
          </div>

          {/* Features Card */}
          <div className="group p-6 bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl hover:bg-gray-800/50 hover:border-blue-500/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">🛰️</div>
              <h2 className="text-2xl font-semibold text-white">What You Can Explore</h2>
            </div>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Real-time asteroid tracking & threat analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Solar flares, CMEs, and geomagnetic storms</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Mars Rover image gallery and metadata</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Daily astronomy photos with expert context</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span>Earth imagery from deep-space satellites</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span>Natural disaster alerts from space</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fun Facts Section */}
        <div className="w-full mb-16">
          <div className="p-8 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl">
            <div className="flex items-center gap-3 mb-6 justify-center">
              <div className="text-3xl">🧠</div>
              <h2 className="text-2xl font-semibold text-white">Mind-Blowing Space Facts</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="flex items-start gap-3 p-4 bg-gray-800/30 rounded-lg">
                <div className="text-xl">🔇</div>
                <p className="text-gray-300">Space is completely silent — there's no atmosphere for sound to travel.</p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-800/30 rounded-lg">
                <div className="text-xl">🔥</div>
                <p className="text-gray-300">Venus is hotter than Mercury, despite being farther from the Sun.</p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-800/30 rounded-lg">
                <div className="text-xl">⭐</div>
                <p className="text-gray-300">There are more stars in the universe than grains of sand on Earth.</p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-800/30 rounded-lg">
                <div className="text-xl">🚀</div>
                <p className="text-gray-300">NASA's Voyager 1 has traveled over 24 billion km from Earth — and it's still going!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-16 text-center">
          <p className="text-gray-400 text-lg mb-4">Built with cutting-edge technology</p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full text-sm font-medium text-purple-200 border border-purple-500/30">React</span>
            <span className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full text-sm font-medium text-blue-200 border border-blue-500/30">TailwindCSS</span>
            <span className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full text-sm font-medium text-green-200 border border-green-500/30">NASA APIs</span>
            <span className="px-4 py-2 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-full text-sm font-medium text-pink-200 border border-pink-500/30">Love ❤️</span>
          </div>
        </div>

        {/* Enhanced Back Button */}
        <button
          onClick={() => window.location.href = "/"}
          className="group inline-flex items-center gap-3 px-8 py-4 text-base font-medium text-gray-300 bg-gray-900/50 backdrop-blur-sm border border-gray-600/50 rounded-xl hover:text-white hover:bg-gray-800/80 hover:border-gray-500/70 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/10"
        >
          <span className="text-xl transition-transform duration-300 group-hover:-translate-x-1">←</span>
          Back to Home
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    </div>
  )
}