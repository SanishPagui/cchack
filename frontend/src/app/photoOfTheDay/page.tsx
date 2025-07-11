"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Image as ImageIcon, Video } from "lucide-react"
import {useCosmicCanvas} from "../components/useCosmicCanvas";
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

interface ApodResponse {
  date: string
  explanation: string
  media_type: "image" | "video"
  title: string
  url: string
}

export default function ApodPage() {
  const [apod, setApod] = useState<ApodResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const canvasRef = useRef(null)
  useCosmicCanvas(canvasRef);

  const fetchApod = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NEXT_PUBLIC_NASA_API_KEY}`)
      if (!res.ok) throw new Error("Failed to fetch APOD")
      const data: ApodResponse = await res.json()
      setApod(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApod()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <canvas 
    ref={canvasRef} 
    className="fixed top-0 left-0 w-full h-full min-h-screen pointer-events-none"
    style={{
      background: 'radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.1) 0%, rgba(30, 41, 59, 0.05) 50%, transparent 100%)'
    }}
  />
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Astronomy Picture of the Day</h1>
                <p className="text-gray-400 text-sm">NASA's daily cosmic image or video</p>
              </div>
            </div>
            {apod && (
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(apod.date), "MMM dd, yyyy")}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span className="ml-3 text-gray-400">Loading APOD...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6 text-red-400 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Error: {error}</span>
          </div>
        )}

        {!loading && !error && apod && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-xl">{apod.title}</CardTitle>
              <CardDescription className="text-gray-400">Date: {apod.date}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {apod.media_type === "image" ? (
                <img
                  src={apod.url}
                  alt={apod.title}
                  className="w-full rounded-lg border border-gray-800 shadow-md"
                />
              ) : (
                <div className="aspect-video w-full border border-gray-800 rounded-lg overflow-hidden">
                  <iframe
                    src={apod.url}
                    title="APOD Video"
                    className="w-full h-full"
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              <p className="text-gray-300 leading-relaxed whitespace-pre-line">{apod.explanation}</p>
            </CardContent>
          </Card>
        )}
      </main>

      <footer className="border-t border-gray-800 mt-16">
        <div className="container mx-auto px-4 py-6 text-sm text-gray-400 flex justify-between">
          <p>Data provided by NASA APOD API</p>
          <p>Last updated: {format(new Date(), "MMM dd, yyyy HH:mm")}</p>
        </div>
      </footer>
    </div>
  )
}
