'use client';
import { useRef } from 'react';
import { useCosmicCanvas } from './useCosmicCanvas';
import { Rocket, Shield, Star, BarChart3 } from 'lucide-react';

const AchievementsSection = () => {
  const canvasRef = useRef(null);
  useCosmicCanvas(canvasRef);
  

  const achievements = [
    {
      year: "2024",
      title: "SPACE Platform Launch",
      description: "Launched our revolutionary space mission planning platform",
      icon: <Rocket className="w-8 h-8" />,
      image: "🚀"
    },
    {
      year: "2024",
      title: "First Debris Prediction",
      description: "Successfully predicted and prevented first space collision",
      icon: <Shield className="w-8 h-8" />,
      image: "🛡️"
    },
    {
      year: "2025",
      title: "Lunar Mission Support",
      description: "Provided mission planning for historic lunar base establishment",
      icon: <Star className="w-8 h-8" />,
      image: "🌙"
    },
    {
      year: "2025",
      title: "10,000 Debris Tracked",
      description: "Reached milestone of tracking 10,000 pieces of space debris",
      icon: <BarChart3 className="w-8 h-8" />,
      image: "📊"
    }
  ];

  return (
    <section className="relative py-20 bg-gradient-to-br from-black via-blue-900 to-purple-900 overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full" 
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.1) 0%, rgba(30, 41, 59, 0.05) 50%, transparent 100%)' }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Cosmic <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Milestones</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Charting our journey through the cosmos, one breakthrough at a time
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500" />
            
            {achievements.map((achievement, index) => (
              <div key={index} className="relative flex items-center mb-12 group">
                {/* Timeline dot */}
                <div className="absolute left-6 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg shadow-purple-500/50 group-hover:scale-125 transition-transform" />
                
                {/* Content */}
                <div className="ml-20 flex-1">
                  <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 hover:border-purple-400/40 transition-all group-hover:scale-105">
                    <div className="flex items-start gap-6">
                      <div className="text-6xl">{achievement.image}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <span className="text-purple-400 font-bold text-lg">{achievement.year}</span>
                          <div className="text-purple-400">{achievement.icon}</div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">{achievement.title}</h3>
                        <p className="text-gray-300 leading-relaxed">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
