'use client';
import { useRef } from 'react';
import { useCosmicCanvas } from './useCosmicCanvas';
import { ArrowRight, ExternalLink } from 'lucide-react';

const BlogSection = () => {
  const canvasRef = useRef(null);
  useCosmicCanvas(canvasRef);

  const blogPosts = [/* … */];

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

export default BlogSection;
