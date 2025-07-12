"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Rocket, Star, Satellite } from "lucide-react"

interface SpaceCurtainLoaderProps {
  isLoading: boolean
  children: React.ReactNode
  duration?: number
  loadingText?: string
  className?: string
}

export function SpaceCurtainLoader({
  isLoading,
  children,
  duration = 2500,
  loadingText = "Initializing Space Systems",
  className,
}: SpaceCurtainLoaderProps) {
  const [showContent, setShowContent] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [loadingPhase, setLoadingPhase] = useState(0)

  const loadingMessages = [
    "Connecting to NASA APIs...",
    "Fetching cosmic data...",
    "Calculating orbital mechanics...",
    "Preparing space interface...",
    "Systems ready!",
  ]

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowContent(true)
      }, 200)

      const completeTimer = setTimeout(() => {
        setAnimationComplete(true)
      }, duration)

      return () => {
        clearTimeout(timer)
        clearTimeout(completeTimer)
      }
    } else {
      setShowContent(false)
      setAnimationComplete(false)

      // Cycle through loading messages
      const messageInterval = setInterval(() => {
        setLoadingPhase((prev) => (prev + 1) % loadingMessages.length)
      }, 500)

      return () => clearInterval(messageInterval)
    }
  }, [isLoading, duration])

  return (
    <div className={cn("relative overflow-hidden min-h-screen", className)}>
      {/* Content */}
      <div className={cn("transition-opacity duration-700", showContent ? "opacity-100" : "opacity-0")}>{children}</div>

      {/* Space Curtain Overlay */}
      {!animationComplete && (
        <div className="fixed inset-0 z-50">
          {/* Starfield Background */}
          <div className="absolute inset-0 bg-black overflow-hidden">
            {Array.from({ length: 100 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>

          {/* Left Curtain Panel */}
          <div
            className={cn(
              "absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-gray-900 via-slate-900 to-gray-800 transform transition-all duration-1500 ease-out",
              showContent ? "-translate-x-full scale-x-110" : "translate-x-0",
            )}
            style={{
              background: showContent
                ? "linear-gradient(to right, #0f172a, #1e293b, #374151)"
                : "linear-gradient(to right, #111827, #1f2937, #374151)",
              boxShadow: showContent ? "-30px 0 60px rgba(0,0,0,0.9)" : "none",
            }}
          >
            {/* Metallic Curtain Texture */}
            <div className="absolute inset-0">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent"
                  style={{ left: `${(i + 1) * 6.67}%` }}
                />
              ))}
            </div>

            {/* Curtain Hardware */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-gray-700 to-gray-800 shadow-lg">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-gray-600 rounded-full top-1"
                  style={{ left: `${10 + i * 8}%` }}
                />
              ))}
            </div>
          </div>

          {/* Right Curtain Panel */}
          <div
            className={cn(
              "absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gray-900 via-slate-900 to-gray-800 transform transition-all duration-1500 ease-out",
              showContent ? "translate-x-full scale-x-110" : "translate-x-0",
            )}
            style={{
              background: showContent
                ? "linear-gradient(to left, #0f172a, #1e293b, #374151)"
                : "linear-gradient(to left, #111827, #1f2937, #374151)",
              boxShadow: showContent ? "30px 0 60px rgba(0,0,0,0.9)" : "none",
            }}
          >
            {/* Metallic Curtain Texture */}
            <div className="absolute inset-0">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent"
                  style={{ left: `${(i + 1) * 6.67}%` }}
                />
              ))}
            </div>

            {/* Curtain Hardware */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-gray-700 to-gray-800 shadow-lg">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-gray-600 rounded-full top-1"
                  style={{ left: `${10 + i * 8}%` }}
                />
              ))}
            </div>
          </div>

          {/* Center Loading Content */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-30">
              <div className="text-center text-white max-w-md mx-auto px-8">
                {/* Animated Space Icons */}
                <div className="relative mb-8">
                  <div className="flex items-center justify-center space-x-8">
                    <Rocket className="w-8 h-8 text-blue-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <Satellite className="w-8 h-8 text-purple-400 animate-bounce" style={{ animationDelay: "200ms" }} />
                    <Star className="w-8 h-8 text-yellow-400 animate-bounce" style={{ animationDelay: "400ms" }} />
                  </div>

                  {/* Orbital Ring */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-32 h-32 border-2 border-blue-500/30 rounded-full animate-spin"
                      style={{ animationDuration: "4s" }}
                    >
                      <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-400 rounded-full transform -translate-x-1/2 -translate-y-1" />
                    </div>
                  </div>
                </div>

                {/* Loading Text */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    {loadingText}
                  </h2>

                  <p className="text-gray-300 text-sm animate-pulse">{loadingMessages[loadingPhase]}</p>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${((loadingPhase + 1) / loadingMessages.length) * 100}%`,
                        boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
                      }}
                    />
                  </div>

                  {/* Floating Particles */}
                  <div className="absolute inset-0 pointer-events-none">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-blue-400 rounded-full animate-ping"
                        style={{
                          left: `${20 + Math.random() * 60}%`,
                          top: `${20 + Math.random() * 60}%`,
                          animationDelay: `${Math.random() * 2}s`,
                          animationDuration: `${1 + Math.random()}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Center Seam with Glow */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-pink-500/50 transform -translate-x-1/2 z-20">
            <div className="absolute inset-0 bg-white/20 blur-sm" />
          </div>
        </div>
      )}
    </div>
  )
}
