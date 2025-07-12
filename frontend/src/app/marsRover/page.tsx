"use client"

import { useState, useEffect, useRef } from "react"
import {useCosmicCanvas} from "../components/useCosmicCanvas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Calendar, MapPin, Search, Download, Eye, Sun } from "lucide-react"
import { format } from "date-fns"

interface RoverPhoto {
  id: number
  sol: number
  camera: {
    id: number
    name: string
    rover_id: number
    full_name: string
  }
  img_src: string
  earth_date: string
  rover: {
    id: number
    name: string
    landing_date: string
    launch_date: string
    status: string
    max_sol: number
    max_date: string
    total_photos: number
  }
}

interface RoverManifest {
  name: string
  landing_date: string
  launch_date: string
  status: string
  max_sol: number
  max_date: string
  total_photos: number
  photos: Array<{
    sol: number
    earth_date: string
    total_photos: number
    cameras: string[]
  }>
}

const ROVERS = ["curiosity", "opportunity", "spirit", "perseverance"]
const CAMERAS = {
  FHAZ: "Front Hazard Avoidance Camera",
  RHAZ: "Rear Hazard Avoidance Camera",
  MAST: "Mast Camera",
  CHEMCAM: "Chemistry and Camera Complex",
  MAHLI: "Mars Hand Lens Imager",
  MARDI: "Mars Descent Imager",
  NAVCAM: "Navigation Camera",
  PANCAM: "Panoramic Camera",
  MINITES: "Miniature Thermal Emission Spectrometer",
}

export default function MarsRoverPhotos() {
  const [photos, setPhotos] = useState<RoverPhoto[]>([])
  const [manifest, setManifest] = useState<RoverManifest | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedRover, setSelectedRover] = useState("curiosity")
  const [selectedCamera, setSelectedCamera] = useState("all")
  const [sol, setSol] = useState("1000")
  const [selectedPhoto, setSelectedPhoto] = useState<RoverPhoto | null>(null)
  const canvasRef = useRef(null)
  useCosmicCanvas(canvasRef);

  const fetchRoverManifest = async (rover: string) => {
    try {
      const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=${process.env.NEXT_PUBLIC_NASA_API_KEY}`)
      if (!response.ok) throw new Error("Failed to fetch rover manifest")
      const data = await response.json()
      setManifest(data.photo_manifest)
    } catch (err) {
      console.error("Error fetching manifest:", err)
    }
  }

  const fetchPhotos = async () => {
    setLoading(true)
    setError(null)

    try {
      let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${selectedRover}/photos?sol=${sol}&api_key=${process.env.NEXT_PUBLIC_NASA_API_KEY}`
      if (selectedCamera !== "all") {
        url += `&camera=${selectedCamera}`
      }

      const response = await fetch(url)
      if (!response.ok) {
  const errorText = await response.text()
  throw new Error(`Failed to fetch photos: ${response.status} ${response.statusText} - ${errorText}`)
}


      const data = await response.json()
      setPhotos(data.photos)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoverManifest(selectedRover)
  }, [selectedRover])

  useEffect(() => {
    fetchPhotos()
  }, [selectedRover, selectedCamera, sol])

  const getRoverStatusColor = (status: string) => {
    return status === "active" ? "bg-green-900 text-green-100" : "bg-gray-700 text-gray-100"
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <canvas 
    ref={canvasRef} 
    className="fixed top-0 left-0 w-full h-full min-h-screen pointer-events-none"
    style={{
      background: 'radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.1) 0%, rgba(30, 41, 59, 0.05) 50%, transparent 100%)'
    }}
  />
      {/* Header */}
      <header className=" border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
  {/* Back Button */}
  <button
    onClick={() => window.location.href = '/links'}
    className="absolute top-8 left-12 px-3 py-1 text-sm text-white hover:bg-gray-700 rounded-md flex items-center gap-1 z-50"
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
    Back
  </button>

  <div className="container mx-auto px-4 py-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <Camera className="w-6 h-6 text-black" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Mars Rover Photos</h1>
          <p className="text-gray-400 text-sm">Explore Mars through the eyes of NASA's rovers</p>
        </div>
      </div>
      {manifest && (
        <div className="text-right">
          <div className="flex items-center gap-2 mb-1">
            <Badge className={getRoverStatusColor(manifest.status)}>{manifest.status}</Badge>
            <span className="text-lg font-bold capitalize">{manifest.name}</span>
          </div>
          <p className="text-sm text-gray-400">
            Sol {manifest.max_sol} • {manifest.total_photos.toLocaleString()} total photos
          </p>
        </div>
      )}
    </div>
  </div>
</header>


      <div className="container mx-auto px-4 py-8">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Select value={selectedRover} onValueChange={setSelectedRover}>
            <SelectTrigger className="bg-gray-900 border-gray-700">
              <SelectValue placeholder="Select Rover" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              {ROVERS.map((rover) => (
                <SelectItem key={rover} value={rover} className="capitalize">
                  {rover}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCamera} onValueChange={setSelectedCamera}>
            <SelectTrigger className="bg-gray-900 border-gray-700">
              <SelectValue placeholder="Select Camera" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="all">All Cameras</SelectItem>
              {Object.entries(CAMERAS).map(([key, name]) => (
                <SelectItem key={key} value={key}>
                  {key} - {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Sol (Martian day)"
            value={sol}
            onChange={(e) => setSol(e.target.value)}
            className="bg-gray-900 border-gray-700"
            min="1"
            max={manifest?.max_sol || 1000}
          />

          <Button onClick={fetchPhotos} disabled={loading} className="bg-white text-black hover:bg-gray-200">
            <Search className="w-4 h-4 mr-2" />
            {loading ? "Loading..." : "Search Photos"}
          </Button>
        </div>

        {/* Rover Info */}
        {manifest && (
          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardHeader>
              <CardTitle className="text-white capitalize flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-400" />
                {manifest.name} Rover Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Launch Date
                  </p>
                  <p className="text-white font-medium">{format(new Date(manifest.launch_date), "MMM dd, yyyy")}</p>
                </div>
                <div>
                  <p className="text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Landing Date
                  </p>
                  <p className="text-white font-medium">{format(new Date(manifest.landing_date), "MMM dd, yyyy")}</p>
                </div>
                <div>
                  <p className="text-gray-400 flex items-center gap-1">
                    <Sun className="w-3 h-3" />
                    Max Sol
                  </p>
                  <p className="text-white font-medium">{manifest.max_sol}</p>
                </div>
                <div>
                  <p className="text-gray-400 flex items-center gap-1">
                    <Camera className="w-3 h-3" />
                    Total Photos
                  </p>
                  <p className="text-white font-medium">{manifest.total_photos.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span className="ml-3 text-gray-400">Loading Mars photos...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6">
            <span className="text-red-400">Error: {error}</span>
          </div>
        )}

        {/* Photos Grid */}
        {!loading && !error && photos.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {photos.map((photo) => (
              <Card
                key={photo.id}
                className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors overflow-hidden"
              >
                <div className="aspect-square relative group cursor-pointer" onClick={() => setSelectedPhoto(photo)}>
                  <img
                    src={photo.img_src || "/placeholder.svg"}
                    alt={`Mars photo from ${photo.camera.full_name}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs border-gray-700 text-gray-300">
                        {photo.camera.name}
                      </Badge>
                      <span className="text-xs text-gray-400">Sol {photo.sol}</span>
                    </div>
                    <p className="text-sm text-gray-400">{photo.camera.full_name}</p>
                    <p className="text-xs text-gray-500">{format(new Date(photo.earth_date), "MMM dd, yyyy")}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && photos.length === 0 && (
          <div className="text-center py-12">
            <Camera className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No photos found for Sol {sol}</p>
            <p className="text-gray-500 text-sm">Try a different sol number or camera</p>
          </div>
        )}

        {/* Photo Modal */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <div
              className="max-w-4xl max-h-full bg-gray-900 rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedPhoto.camera.full_name}</h3>
                  <p className="text-gray-400 text-sm">
                    Sol {selectedPhoto.sol} • {format(new Date(selectedPhoto.earth_date), "MMM dd, yyyy")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(selectedPhoto.img_src, "_blank")}
                    className="border-gray-700 text-white hover:bg-gray-800"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPhoto(null)}
                    className="border-gray-700 text-white hover:bg-gray-800"
                  >
                    Close
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <img
                  src={selectedPhoto.img_src || "/placeholder.svg"}
                  alt={`Mars photo from ${selectedPhoto.camera.full_name}`}
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <p>Images courtesy of NASA/JPL-Caltech Mars Rover missions</p>
            <p>Last updated: {format(new Date(), "MMM dd, yyyy HH:mm")}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
