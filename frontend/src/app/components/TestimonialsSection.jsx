'use client';
import { useRef } from 'react';
import { useCosmicCanvas } from './useCosmicCanvas';

const TestimonialsSection = () => {
  const canvasRef = useRef(null);
  useCosmicCanvas(canvasRef);

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Mission Director, Lunar Research Institute",
      content: "SPACE's mission planning capabilities reduced our project timeline by 40% while increasing safety margins.",
      avatar: "👩‍🚀"
    },
    {
      name: "Captain Marcus Rodriguez",
      role: "ISS Operations Commander",
      content: "The debris monitoring system has been instrumental in keeping our crew safe during critical operations.",
      avatar: "👨‍🚀"
    },
    {
      name: "Prof. Elena Volkov",
      role: "Astrophysics Department Head",
      content: "Revolutionary space weather analysis that's advancing our understanding of the cosmos.",
      avatar: "👩‍🔬"
    }
  ];

  const partners = [
    { name: "NASA", logo: "🚀" },
    { name: "ESA", logo: "🛰️" },
    { name: "ISRO", logo: "🌙" },
    { name: "SpaceX", logo: "🚀" },
    { name: "Blue Origin", logo: "🌌" },
    { name: "Roscosmos", logo: "⭐" }
  ];

  return (
    <section className="relative py-20 bg-gradient-to-br from-purple-900 via-black to-blue-900 overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full" 
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.1) 0%, rgba(30, 41, 59, 0.05) 50%, transparent 100%)' }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Explorers</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Leading space agencies and organizations worldwide trust our technology
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="relative p-8 rounded-2xl backdrop-blur-sm border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl" />
              
              <div className="relative z-10">
                <div className="text-4xl mb-4">{testimonial.avatar}</div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <h4 className="text-white font-semibold">{testimonial.name}</h4>
                  <p className="text-blue-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Partners */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-8">Our Partners</h3>
          <div className="flex justify-center items-center flex-wrap gap-12">
            {partners.map((partner, index) => (
              <div key={index} className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group">
                <span className="text-3xl group-hover:scale-110 transition-transform">{partner.logo}</span>
                <span className="text-lg font-medium">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
