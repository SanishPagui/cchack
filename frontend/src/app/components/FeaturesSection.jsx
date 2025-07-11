'use client';
import { useRef, useState } from 'react';
import { Rocket, Shield, Satellite, BarChart3, ArrowRight } from 'lucide-react';
import { useCosmicCanvas } from './useCosmicCanvas';

const FeaturesSection = () => {
  const canvasRef = useRef(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  useCosmicCanvas(canvasRef);

  const features = [
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Mission Planning",
      description: "Advanced AI-driven mission planning with real-time trajectory optimization and risk assessment.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Space Debris Monitoring",
      description: "Real-time tracking of orbital debris with collision avoidance algorithms and automated alerts.",
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: <Satellite className="w-8 h-8" />,
      title: "Satellite Optimization",
      description: "Maximize coverage and efficiency of satellite constellations with predictive analytics.",
      color: "from-pink-500 to-red-500"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Space Weather Analysis",
      description: "Monitor solar activity and space weather patterns to protect missions and equipment.",
      color: "from-cyan-500 to-blue-500"
    }
  ];

  return (
    <section className="relative py-20 bg-gradient-to-br from-black via-gray-900 to-purple-900 overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full" 
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.1) 0%, rgba(30, 41, 59, 0.05) 50%, transparent 100%)' }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Mission <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Control</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Cutting-edge space technology solutions that push the boundaries of what's possible in the cosmos
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative p-8 rounded-2xl backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 transform hover:scale-105 ${
                hoveredCard === index ? 'shadow-2xl shadow-purple-500/20' : ''
              }`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10 rounded-2xl`} />
              
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-6`}>
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
