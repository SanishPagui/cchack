"use client"
import { useRef } from "react"
import { useCosmicCanvas } from "./useCosmicCanvas"
import { ArrowRight, ExternalLink, Clock, User } from "lucide-react"

const BlogSection = () => {
  const canvasRef = useRef(null)
  useCosmicCanvas(canvasRef)

  const blogPosts = [
    {
      title: "The Future of Space Debris Management",
      excerpt:
        "Exploring innovative approaches to tackling the growing challenge of space debris in Earth's orbit and protecting future missions.",
      date: "January 8, 2025",
      category: "Research",
      image: "🛰️",
      readTime: "5 min read",
      author: "Dr. Sarah Chen",
    },
    {
      title: "AI in Mission Planning: A New Era",
      excerpt:
        "How artificial intelligence is revolutionizing the way we plan and execute space missions, from trajectory optimization to risk assessment.",
      date: "January 5, 2025",
      category: "Technology",
      image: "🤖",
      readTime: "7 min read",
      author: "Prof. Marcus Rodriguez",
    },
    {
      title: "Solar Storm Alert Systems",
      excerpt:
        "Understanding space weather and its impact on satellite operations, astronaut safety, and Earth's technological infrastructure.",
      date: "January 2, 2025",
      category: "Space Weather",
      image: "☀️",
      readTime: "6 min read",
      author: "Dr. Elena Volkov",
    },
    {
      title: "Lunar Base Communications",
      excerpt:
        "Designing robust communication networks for permanent lunar settlements and the challenges of deep space connectivity.",
      date: "December 30, 2024",
      category: "Infrastructure",
      image: "🌙",
      readTime: "8 min read",
      author: "Dr. James Park",
    },
  ]

  return (
    <section className="relative py-20 bg-gradient-to-br from-purple-900 via-black to-blue-900 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.1) 0%, rgba(30, 41, 59, 0.05) 50%, transparent 100%)",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Cosmic{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Insights</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Stay updated with the latest discoveries, research, and developments in space exploration
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {blogPosts.map((post, index) => (
            <article key={index} className="group cursor-pointer">
              <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl overflow-hidden hover:border-purple-400/40 transition-all duration-300 transform hover:scale-105 h-full flex flex-col">
                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{post.image}</div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-purple-400 font-medium uppercase tracking-wider">
                      {post.category}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors flex-shrink-0">
                    {post.title}
                  </h3>

                  <p className="text-gray-300 text-sm mb-4 line-clamp-3 flex-1">{post.excerpt}</p>

                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {post.author}
                      </span>
                      <ExternalLink className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-xs text-gray-500">{post.date}</div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto group">
            Explore All Articles
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default BlogSection
