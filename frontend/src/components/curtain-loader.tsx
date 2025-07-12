"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface CurtainLoaderProps {
  isLoading: boolean
  children: React.ReactNode
  duration?: number
  curtainColor?: string
  className?: string
}

export function CurtainLoader({
  isLoading,
  children,
  duration = 2000,
  curtainColor = "from-gray-900 via-black to-gray-900",
  className,
}: CurtainLoaderProps) {
  const [showContent, setShowContent] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      // Start the curtain opening animation
      const timer = setTimeout(() => {
        setShowContent(true)
      }, 100)

      // Complete the animation and hide curtains
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
    }
  }, [isLoading, duration])

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Content */}
      <div className={cn("transition-opacity duration-500", showContent ? "opacity-100" : "opacity-0")}>{children}</div>

      {/* Curtain Overlay */}
      {!animationComplete && (
        <div className="fixed inset-0 z-50 flex">
          {/* Left Curtain Panel */}
          <div
            className={cn(
              `w-1/2 h-full bg-gradient-to-r ${curtainColor} transform transition-transform duration-1000 ease-in-out`,
              showContent ? "-translate-x-full" : "translate-x-0",
            )}
            style={{
              boxShadow: showContent ? "-20px 0 40px rgba(0,0,0,0.8)" : "none",
            }}
          >
            {/* Curtain Texture Lines */}
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="absolute w-px bg-white/10 h-full" style={{ left: `${(i + 1) * 5}%` }} />
              ))}
            </div>

            {/* Curtain Rod Shadow */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-black/50 to-transparent" />
          </div>

          {/* Right Curtain Panel */}
          <div
            className={cn(
              `w-1/2 h-full bg-gradient-to-l ${curtainColor} transform transition-transform duration-1000 ease-in-out`,
              showContent ? "translate-x-full" : "translate-x-0",
            )}
            style={{
              boxShadow: showContent ? "20px 0 40px rgba(0,0,0,0.8)" : "none",
            }}
          >
            {/* Curtain Texture Lines */}
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="absolute w-px bg-white/10 h-full" style={{ left: `${(i + 1) * 5}%` }} />
              ))}
            </div>

            {/* Curtain Rod Shadow */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-black/50 to-transparent" />
          </div>

          {/* Center Seam */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-black/30 transform -translate-x-1/2 z-10" />

          {/* Loading Content in Center */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-center text-white">
                <div className="relative">
                  {/* Spinning Stars */}
                  <div className="animate-spin w-16 h-16 mx-auto mb-4">
                    <div className="absolute inset-0">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2 bg-white rounded-full"
                          style={{
                            top: "50%",
                            left: "50%",
                            transform: `rotate(${i * 45}deg) translateY(-24px) translate(-50%, -50%)`,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Loading Text */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                      Loading Space Data
                    </h3>
                    <div className="flex items-center justify-center space-x-1">
                      <div
                        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
