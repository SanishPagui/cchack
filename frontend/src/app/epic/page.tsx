"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCosmicCanvas } from "../components/useCosmicCanvas"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Globe,
  Calendar,
  Camera,
  Sun,
  Moon,
  Download,
  Eye,
  Palette,
  Satellite,
  MapPin,
} from "lucide-react"
import { format } from "date-fns"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

interface EpicImage {
  identifier: string
  caption: string
  image: string
  version: string
  centroid_coordinates: {
    lat: number
    lon: number
  }
  dscovr_j2000_position: {
    x: number
    y: number
    z: number
  }
  lunar_j2000_position: {
    x: number
    y: number
    z: number
  }
  sun_j2000_position: {
    x: number
    y: number
    z: number
  }
  attitude_quaternions: {
    q0: number
    q1: number
    q2: number
    q3: number
  }
  date: string
  coords: {
    centroid_coordinates: {
      lat: number
      lon: number
    }
    dscovr_j2000_position: {
      x: number
      y: number
      z: number
    }
    lunar_j2000_position: {
      x: number
      y: number
      z: number
    }
    sun_j2000_position: {
      x: number
      y: number
      z: number
    }
    attitude_quaternions: {
      q0: number
      q1: number
      q2: number
      q3: number
    }
  }
}

const IMAGE_TYPES = {
  natural: "Natural Color",
  enhanced: "Enhanced Color",
}

export default function EpicEarthImages() {
  const [images, setImages] = useState<EpicImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [imageType, setImageType] = useState<"natural" | "enhanced">("natural")
  const [selectedImage, setSelectedImage] = useState<EpicImage | null>(null)
  const canvasRef = useRef(null)
  useCosmicCanvas(canvasRef)

  const fetchImages = async (date: Date, type: "natural" | "enhanced") => {
    setLoading(true)
    setError(null)
    try {
      const dateStr = format(date, "yyyy-MM-dd")
      const response = await fetch(
        `https://api.nasa.gov/EPIC/api/${type}/date/${dateStr}?api_key=${process.env.NEXT_PUBLIC_NASA_API_KEY}`
      )
      if (!response.ok) {
        if (response.status === 404) throw new Error("No images available for this date (Try an older date, preferably 4 days before)")
        throw new Error("Failed to fetch EPIC images")
      }
      const data = await response.json()
      setImages(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setImages([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages(selectedDate, imageType)
  }, [selectedDate, imageType])

  const getImageUrl = (image: EpicImage, size: "thumbs" | "png" = "png") => {
    const dateStr = format(new Date(image.date), "yyyy/MM/dd")
    return `https://api.nasa.gov/EPIC/archive/${imageType}/${dateStr}/${size}/${image.image}.${
      size === "thumbs" ? "jpg" : "png"
    }?api_key=${process.env.NEXT_PUBLIC_NASA_API_KEY}`
  }

  const formatDistance = (distance: number) => `${(distance / 1000).toFixed(0)} km`

  const formatCoordinates = (lat: number, lon: number) => {
    const latDir = lat >= 0 ? "N" : "S"
    const lonDir = lon >= 0 ? "E" : "W"
    return `${Math.abs(lat).toFixed(2)}°${latDir}, ${Math.abs(lon).toFixed(2)}°${lonDir}`
  }

  const calculateDistance = (pos: { x: number; y: number; z: number }) => {
    return Math.sqrt(pos.x ** 2 + pos.y ** 2 + pos.z ** 2)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full min-h-screen pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.1) 0%, rgba(30, 41, 59, 0.05) 50%, transparent 100%)",
        }}
      />

<header className=" border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
  {/* Back Button */}
  <button
      onClick={() => window.location.href = "/links"}
      className="absolute top-8 left-12 group inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg hover:bg-gray-700/90 hover:border-gray-600 hover:scale-105 active:scale-95 transition-all duration-200 z-50 shadow-lg hover:shadow-xl"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>

  <div className="container mx-auto px-4 py-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <Globe className="w-6 h-6 text-black" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">EPIC Earth Images</h1>
          <p className="text-gray-400 text-sm">Earth Polychromatic Imaging Camera</p>
        </div>
      </div>
      <div className="text-right">
        <div className="flex items-center gap-2 mb-1">
          <Satellite className="w-5 h-5 text-blue-400" />
          <span className="text-lg font-bold">DSCOVR Satellite</span>
        </div>
        <p className="text-sm text-gray-400">
          {images.length} images • {format(selectedDate, "MMM dd, yyyy")}
        </p>
      </div>
    </div>
  </div>
</header>

      <div className="container mx-auto px-4 py-8">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
          <Select value={imageType} onValueChange={(value: "natural" | "enhanced") => setImageType(value)}>
            <SelectTrigger className="bg-gray-900 border-gray-700 md:w-48">
              <SelectValue placeholder="Image Type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="natural">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4" /> Natural Color
                </div>
              </SelectItem>
              <SelectItem value="enhanced">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4" /> Enhanced Color
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="bg-gray-900 border border-gray-700 rounded-md px-4 py-2 text-white">
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => {
                if (date) setSelectedDate(date)
              }}
              dateFormat="yyyy-MM-dd"
              maxDate={new Date()}
              className="bg-transparent focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Date Display */}
        <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-gray-400">Viewing images from:</span>
              <span className="text-white font-medium">{format(selectedDate, "EEEE, MMMM dd, yyyy")}</span>
              <Badge className="bg-blue-900 text-blue-100">{IMAGE_TYPES[imageType]}</Badge>
            </div>
            <div className="text-sm text-gray-400">Images captured by DSCOVR satellite at L1 Lagrange point</div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span className="ml-3 text-gray-400">Loading Earth images...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6">
            <span className="text-red-400">Error: {error}</span>
          </div>
        )}

        {/* Images Grid */}
        {!loading && !error && images.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {images.map((image) => {
              const earthDistance = calculateDistance(image.dscovr_j2000_position)
              const moonDistance = calculateDistance(image.lunar_j2000_position)

              return (
                <Card
                  key={image.identifier}
                  className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors overflow-hidden"
                >
                  <div className="aspect-square relative group cursor-pointer" onClick={() => setSelectedImage(image)}>
                    <img
                      src={getImageUrl(image, "thumbs") || "/placeholder.svg"}
                      alt={image.caption}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Eye className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-black/70 text-white">{format(new Date(image.date), "HH:mm")}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-white font-medium text-sm leading-tight">{image.caption}</p>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            Center Point
                          </span>
                          <span className="text-white">
                            {formatCoordinates(image.centroid_coordinates.lat, image.centroid_coordinates.lon)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 flex items-center gap-1">
                            <Satellite className="w-3 h-3" />
                            Distance
                          </span>
                          <span className="text-white">{formatDistance(earthDistance)}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 flex items-center gap-1">
                            <Moon className="w-3 h-3" />
                            Moon Distance
                          </span>
                          <span className="text-white">{formatDistance(moonDistance)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && images.length === 0 && (
          <div className="text-center py-12">
            <Camera className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No images available for this date</p>
            <p className="text-gray-500 text-sm">Try an older date (preferably 4 days before the current date)</p>
          </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="max-w-6xl max-h-full bg-gray-900 rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedImage.caption}</h3>
                  <p className="text-gray-400 text-sm">
                    {format(new Date(selectedImage.date), "EEEE, MMMM dd, yyyy 'at' HH:mm:ss")} UTC
                  </p>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row">
                <div className="flex-1 p-4">
                  <img
                    src={getImageUrl(selectedImage) || "/placeholder.svg"}
                    alt={selectedImage.caption}
                    className="w-full h-auto max-h-[70vh] object-contain rounded"
                  />
                </div>

                <div className="lg:w-80 p-4 border-l border-gray-800 space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Earth Center Point
                    </h4>
                    <p className="text-gray-300 text-sm">
                      {formatCoordinates(
                        selectedImage.centroid_coordinates.lat,
                        selectedImage.centroid_coordinates.lon,
                      )}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <Satellite className="w-4 h-4" />
                      DSCOVR Position
                    </h4>
                    <div className="text-gray-300 text-sm space-y-1">
                      <p>X: {selectedImage.dscovr_j2000_position.x.toFixed(0)} km</p>
                      <p>Y: {selectedImage.dscovr_j2000_position.y.toFixed(0)} km</p>
                      <p>Z: {selectedImage.dscovr_j2000_position.z.toFixed(0)} km</p>
                      <p className="text-blue-400">
                        Distance: {formatDistance(calculateDistance(selectedImage.dscovr_j2000_position))}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      Moon Position
                    </h4>
                    <div className="text-gray-300 text-sm space-y-1">
                      <p>X: {selectedImage.lunar_j2000_position.x.toFixed(0)} km</p>
                      <p>Y: {selectedImage.lunar_j2000_position.y.toFixed(0)} km</p>
                      <p>Z: {selectedImage.lunar_j2000_position.z.toFixed(0)} km</p>
                      <p className="text-gray-400">
                        Distance: {formatDistance(calculateDistance(selectedImage.lunar_j2000_position))}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <Sun className="w-4 h-4" />
                      Sun Position
                    </h4>
                    <div className="text-gray-300 text-sm space-y-1">
                      <p>X: {selectedImage.sun_j2000_position.x.toFixed(0)} km</p>
                      <p>Y: {selectedImage.sun_j2000_position.y.toFixed(0)} km</p>
                      <p>Z: {selectedImage.sun_j2000_position.z.toFixed(0)} km</p>
                      <p className="text-yellow-400">
                        Distance: {formatDistance(calculateDistance(selectedImage.sun_j2000_position))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Panel */}
        <div className="mt-12 bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h3 className="text-xl font-bold text-white mb-4">About EPIC</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">Earth Polychromatic Imaging Camera</h4>
              <p className="text-gray-400 mb-3">
                EPIC is a 10-channel spectroradiometer aboard the DSCOVR satellite, positioned at the L1 Lagrange point
                between Earth and the Sun, approximately 1.5 million kilometers from Earth.
              </p>
              <p className="text-gray-400">
                The camera provides daily full-disk images of Earth, capturing the entire sunlit side of our planet from
                sunrise to sunset.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-green-400 mb-2">Image Types</h4>
              <p className="text-gray-400 mb-3">
                <strong>Natural Color:</strong> Images processed to show Earth as it would appear to the human eye.
              </p>
              <p className="text-gray-400">
                <strong>Enhanced Color:</strong> Images with enhanced contrast and color correction to highlight
                atmospheric and surface features more clearly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <p>Images courtesy of NASA EPIC (Earth Polychromatic Imaging Camera)</p>
            <p>DSCOVR satellite at L1 Lagrange point</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
