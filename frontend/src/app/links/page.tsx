"use client";

import { useRef, useEffect, RefObject } from "react";

import {
  Zap,
  AlertTriangle,
  Camera,
  Globe,
  Shield,
  Sun,
  Satellite,
  BookOpen,
  ArrowRight,
  Earth,
  Car,
  LucideSatellite,
} from "lucide-react";
import { Particles } from "@/components/magicui/particles";

// Cosmic canvas hook (simplified version)
const useCosmicCanvas = (canvasRef: RefObject<HTMLCanvasElement | null>) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const stars: { x: number; y: number; radius: number; alpha: number; speed: number; }[] = [];
    const numStars = 200;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
};

const features = [
  { 
    name: 'Asteroid Tracker', 
    path: '/asteroidTracking',
    description: 'Track near-Earth objects and potentially hazardous asteroids',
    icon: AlertTriangle,
    color: 'text-red-400'
  },
  { 
    name: 'Space Weather Tracker', 
    path: '/donki',
    description: 'Monitor solar flares, coronal mass ejections, and space weather',
    icon: Sun,
    color: 'text-yellow-400'
  },
  { 
    name: 'Mars Rover Photos', 
    path: '/marsRover',
    description: 'Explore the latest images from Mars rovers',
    icon: Car,
    color: 'text-orange-400'
  },
  { 
    name: 'EONET Events', 
    path: '/eonet',
    description: 'Track natural events and disasters from space',
    icon: Globe,
    color: 'text-green-400'
  },
  { 
    name: 'EPIC Earth Images', 
    path: '/epic',
    description: 'Explore stunning images of Earth from the EPIC camera',
    icon: Earth,
    color: 'text-purple-400'
  },
  { 
    name: 'Photo of the Day', 
    path: '/photoOfTheDay',
    description: 'Discover stunning astronomy images and explanations',
    icon: Camera,
    color: 'text-cyan-400'
  },
  { 
    name: 'Risk Dashboard', 
    path: '/riskDashboard',
    description: 'Comprehensive risk assessment and monitoring',
    icon: Shield,
    color: 'text-red-400'
  },
  { 
    name: 'Other Cool Stuff', 
    path: '/other',
    description: 'Collection of space-related tools and resources',
    icon: LucideSatellite,
    color: 'text-red-400'
  },
];

export default function FeaturesPage() {
  const canvasRef = useRef(null);
  useCosmicCanvas(canvasRef);

  return (
    <div className="min-h-screen bg-black text-white">
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full min-h-screen pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.1) 0%, rgba(30, 41, 59, 0.05) 50%, transparent 100%)'
        }}
      />
      <Particles
                className="absolute inset-0 z-0"
                quantity={500}
                ease={80}
                color={"#ffffff"}
                refresh
              />
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Space Explorer</h1>
                <p className="text-gray-400 text-sm">All Features & Tools</p>
              </div>
            </div>

            {/* Back Button */}
            <button
      onClick={() => {window.location.href = '/';}}
      className="group inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-300 bg-gray-900/50 backdrop-blur-sm border border-gray-600/50 rounded-lg hover:text-white hover:bg-gray-800/80 hover:border-gray-500 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
    >
      <span className="text-base transition-transform duration-200 group-hover:-translate-x-0.5">←</span>
      Back to Home
    </button>
          </div>
        </div>
      </header>


      <div className="container mx-auto px-4 py-8">
        {/* Introduction */}
        <div className="mb-8 p-6 bg-gray-900 rounded-lg border border-gray-800">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">🚀 Explore the Universe</h2>
            <p className="text-gray-400 text-lg">
              Discover our comprehensive suite of space exploration tools and educational resources
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="bg-gray-900 border border-white/50 rounded-lg hover:border-gray-700 transition-all duration-300 hover:scale-105 cursor-pointer group"
                onClick={() => window.location.href=feature.path} 
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-gray-700 transition-colors`}>
                        <IconComponent className={`w-6 h-6 ${feature.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white text-lg leading-tight font-semibold">
                          {feature.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-white flex items-center space-x-2 text-lg font-semibold mb-3">
              <Shield className="w-5 h-5 text-blue-400" />
              <span>Real-time Data</span>
            </h3>
            <p className="text-gray-400 text-sm">
              All features use live data from NASA APIs and other space agencies to provide 
              the most current information about space phenomena and celestial events.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-white flex items-center space-x-2 text-lg font-semibold mb-3">
              <BookOpen className="w-5 h-5 text-green-400" />
              <span>Educational Focus</span>
            </h3>
            <p className="text-gray-400 text-sm">
              Each tool includes educational content and explanations to help you understand 
              the science behind space exploration and astronomical phenomena.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <p>Powered by NASA APIs and space data services</p>
            <p>Explore • Learn • Discover</p>
          </div>
        </div>
      </footer>
    </div>
  );
}