'use client';
import { useRef, useState } from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { useCosmicCanvas } from './useCosmicCanvas';

const CTASection = () => {
  const canvasRef = useRef(null);
  const [email, setEmail] = useState('');

  useCosmicCanvas(canvasRef);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for joining our cosmic journey! Welcome ${email}`);
    setEmail('');
  };

  return (
    <section className="relative py-20 bg-gradient-to-br from-black via-purple-900 to-pink-900 overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full" 
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.1) 0%, rgba(30, 41, 59, 0.05) 50%, transparent 100%)' }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 text-purple-400 mb-4">
              <Star className="w-6 h-6" />
              <span className="text-sm uppercase tracking-wider">Join the Mission</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Explore</span> the Cosmos?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and be the first to know about breakthrough discoveries, mission updates, and cosmic insights.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-12">
            <div className="flex items-center gap-4">
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-purple-500/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 flex items-center gap-2"
                >
                Launch
                <ArrowRight className="w-5 h-5" />
                </button>
            </div>
            </form>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">10K+</div>
              <div className="text-gray-300">Space Explorers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-400 mb-2">500+</div>
              <div className="text-gray-300">Missions Planned</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">24/7</div>
              <div className="text-gray-300">Cosmic Monitoring</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
