'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Star, Satellite, Rocket, Shield, BarChart3, Users, Award, Calendar, TrendingUp, Mail, ArrowRight, ExternalLink } from 'lucide-react';

// Shared Canvas Animation Hook
const useCosmicCanvas = (canvasRef) => {
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system
    const particles = [];
    const particleCount = 150;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 2 + 0.5;
        this.opacity = Math.random() * 0.8 + 0.2;
        this.color = `hsl(${280 + Math.random() * 40}, 70%, 60%)`;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        this.opacity = Math.sin(Date.now() * 0.001 + this.x * 0.01) * 0.3 + 0.5;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw nebula-like background gradient
      const gradient = ctx.createRadialGradient(
        canvas.width * 0.5, canvas.height * 0.5, 0,
        canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.6
      );
      gradient.addColorStop(0, 'rgba(147, 51, 234, 0.15)');
      gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.08)');
      gradient.addColorStop(1, 'rgba(30, 41, 59, 0.02)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw connections between nearby particles
      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.save();
            ctx.globalAlpha = (100 - distance) / 100 * 0.2;
            ctx.strokeStyle = '#8b5cf6';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
};

// 1. Features/Services Section
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

// 2. Testimonials/Partners Section
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

// 3. CTA/Newsletter Section
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

// 4. Gallery/Achievements Section
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

// 5. Blog/Resources Section
const BlogSection = () => {
  const canvasRef = useRef(null);
  
  useCosmicCanvas(canvasRef);

  const blogPosts = [
    {
      title: "The Future of Space Debris Management",
      excerpt: "Exploring innovative approaches to tackling the growing challenge of space debris in Earth's orbit.",
      date: "July 8, 2025",
      category: "Research",
      image: "🛰️",
      readTime: "5 min read"
    },
    {
      title: "AI in Mission Planning: A New Era",
      excerpt: "How artificial intelligence is revolutionizing the way we plan and execute space missions.",
      date: "July 5, 2025",
      category: "Technology",
      image: "🤖",
      readTime: "7 min read"
    },
    {
      title: "Solar Storm Alert Systems",
      excerpt: "Understanding space weather and its impact on satellite operations and astronaut safety.",
      date: "July 2, 2025",
      category: "Space Weather",
      image: "☀️",
      readTime: "6 min read"
    },
    {
      title: "Lunar Base Communications",
      excerpt: "Designing robust communication networks for permanent lunar settlements.",
      date: "June 30, 2025",
      category: "Infrastructure",
      image: "🌙",
      readTime: "8 min read"
    }
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
            Cosmic <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Insights</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Stay updated with the latest discoveries, research, and developments in space exploration
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {blogPosts.map((post, index) => (
            <article key={index} className="group cursor-pointer">
              <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl overflow-hidden hover:border-purple-400/40 transition-all duration-300 transform hover:scale-105">
                <div className="p-6">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                    {post.image}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-purple-400 font-medium uppercase tracking-wider">
                      {post.category}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-xs text-gray-400">{post.readTime}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{post.date}</span>
                    <ExternalLink className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto">
            Explore All Articles
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

// Main Component
const SpaceHomepage = () => {
  return (
    <div className="bg-black">
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <AchievementsSection />
      <BlogSection />
    </div>
  );
};

export default SpaceHomepage;