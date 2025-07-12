"use client"

import type React from "react"
import { useState, useEffect } from "react" // Import useEffect
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  Loader2,
  AlertTriangle,
  Globe,
  Ruler,
  Scale,
  Clock,
  Orbit,
  StarIcon,
  Sun,
  MapPin,
  Gauge,
  Eye,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface Planet {
  name: string
  mass: number | null
  radius: number | null
  orbital_period: number | null
  distance_from_sun: number | null
  temperature: number | null
  planet_type: string | null
  period: number | null
  semi_major_axis: number | null
  distance_light_year: number | null
  host_star_mass: number | null
  host_star_temperature: number | null
}

interface Star {
  name: string
  constellation: string | null
  right_ascension: string | null
  declination: string | null
  apparent_magnitude: string | null
  absolute_magnitude: string | null
  distance_light_year: string | null
  spectral_class: string | null
}

interface ISSData {
  name: string
  id: number
  latitude: number
  longitude: number
  altitude: number
  velocity: number
  visibility: string
  footprint: number
  timestamp: number
  daynum: number
  solar_lat: number
  solar_lon: number
  units: string
}

export default function OtherPage() {
  // Planet states
  const [planetSearchTerm, setPlanetSearchTerm] = useState("")
  const [planet, setPlanet] = useState<Planet | null>(null)
  const [planetLoading, setPlanetLoading] = useState(false)
  const [planetError, setPlanetError] = useState<string | null>(null)

  // Star states
  const [starSearchTerm, setStarSearchTerm] = useState("")
  const [star, setStar] = useState<Star | null>(null)
  const [starLoading, setStarLoading] = useState(false)
  const [starError, setStarError] = useState<string | null>(null)

  // ISS states
  const [issData, setIssData] = useState<ISSData | null>(null)
  const [issLoading, setIssLoading] = useState(false)
  const [issError, setIssError] = useState<string | null>(null)

  // Fetch ISS data on component mount
  useEffect(() => {
    const fetchIssData = async () => {
      setIssLoading(true)
      setIssError(null)
      setIssData(null)
      try {
        const response = await fetch("/api/iss")
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch ISS data.")
        }
        setIssData(data)
      } catch (err) {
        setIssError(err instanceof Error ? err.message : "An unknown error occurred.")
      } finally {
        setIssLoading(false)
      }
    }

    fetchIssData()
    // Optional: Set up an interval to refresh ISS data every X seconds
    // const interval = setInterval(fetchIssData, 10000); // Refresh every 10 seconds
    // return () => clearInterval(interval); // Clean up on unmount
  }, []) // Empty dependency array means this runs once on mount

  const handlePlanetSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!planetSearchTerm.trim()) {
      setPlanetError("Please enter a planet name.")
      setPlanet(null)
      return
    }
    setPlanetLoading(true)
    setPlanetError(null)
    setPlanet(null)
    try {
      const response = await fetch(`/api/planets?name=${encodeURIComponent(planetSearchTerm)}`)
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch planet data.")
      }
      setPlanet(data)
    } catch (err) {
      setPlanetError(err instanceof Error ? err.message : "An unknown error occurred.")
    } finally {
      setPlanetLoading(false)
    }
  }

  const handleStarSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!starSearchTerm.trim()) {
      setStarError("Please enter a star name.")
      setStar(null)
      return
    }
    setStarLoading(true)
    setStarError(null)
    setStar(null)
    try {
      const response = await fetch(`/api/stars?name=${encodeURIComponent(starSearchTerm)}`)
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch star data.")
      }
      setStar(data)
    } catch (err) {
      setStarError(err instanceof Error ? err.message : "An unknown error occurred.")
    } finally {
      setStarLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
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

    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Explore Celestial Bodies</h1>

        {/* Planet Search Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2">
            <Globe className="w-8 h-8" /> Planets
          </h2>
          <form onSubmit={handlePlanetSearch} className="flex gap-4 mb-8 max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search for a planet (e.g., Mars, Kepler-186f)"
                value={planetSearchTerm}
                onChange={(e) => setPlanetSearchTerm(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
                disabled={planetLoading}
              />
            </div>
            <Button
              type="submit"
              className="bg-white text-black hover:bg-gray-200 disabled:opacity-50"
              disabled={planetLoading}
            >
              {planetLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
            </Button>
          </form>
          {/* Planet Loading State */}
          {planetLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <span className="ml-3 text-gray-400">Searching for planet...</span>
            </div>
          )}
          {/* Planet Error State */}
          {planetError && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6 max-w-md mx-auto">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="text-red-400">{planetError}</span>
              </div>
            </div>
          )}
          {/* Planet Details */}
          {!planetLoading && !planetError && planet && (
            <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-white text-2xl">{planet.name}</CardTitle>
                <CardDescription className="text-gray-400 mt-1">Type: {planet.planet_type || "N/A"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Scale className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Mass:</span>
                  <span className="text-white text-sm">{planet.mass !== null ? `${planet.mass} Earths` : "N/A"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Ruler className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Radius:</span>
                  <span className="text-white text-sm">
                    {planet.radius !== null ? `${planet.radius} Earths` : "N/A"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Orbit className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Orbital Period:</span>
                  <span className="text-white text-sm">
                    {planet.orbital_period !== null ? `${planet.orbital_period} Earth days` : "N/A"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Distance from Sun:</span>
                  <span className="text-white text-sm">
                    {planet.distance_from_sun !== null ? `${planet.distance_from_sun} AU` : "N/A"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Period:</span>
                  <span className="text-white text-sm">
                    {planet.period !== null ? `${planet.period} Earth days` : "N/A"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Orbit className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Semi-Major Axis:</span>
                  <span className="text-white text-sm">
                    {planet.semi_major_axis !== null ? `${planet.semi_major_axis} AU` : "N/A"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Distance (Light-Years):</span>
                  <span className="text-white text-sm">
                    {planet.distance_light_year !== null ? `${planet.distance_light_year}` : "N/A"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Scale className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Host Star Mass:</span>
                  <span className="text-white text-sm">
                    {planet.host_star_mass !== null ? `${planet.host_star_mass} Solar Masses` : "N/A"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Host Star Temperature:</span>
                  <span className="text-white text-sm">
                    {planet.host_star_temperature !== null ? `${planet.host_star_temperature} K` : "N/A"}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Separator className="my-12 bg-gray-800" />

        {/* Star Search Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2">
            <StarIcon className="w-8 h-8" /> Stars
          </h2>
          <form onSubmit={handleStarSearch} className="flex gap-4 mb-8 max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search for a star (e.g., Vega, Sirius)"
                value={starSearchTerm}
                onChange={(e) => setStarSearchTerm(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
                disabled={starLoading}
              />
            </div>
            <Button
              type="submit"
              className="bg-white text-black hover:bg-gray-200 disabled:opacity-50"
              disabled={starLoading}
            >
              {starLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
            </Button>
          </form>
          {/* Star Loading State */}
          {starLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <span className="ml-3 text-gray-400">Searching for star...</span>
            </div>
          )}
          {/* Star Error State */}
          {starError && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6 max-w-md mx-auto">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="text-red-400">{starError}</span>
              </div>
            </div>
          )}
          {/* Star Details */}
          {!starLoading && !starError && star && (
            <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-white text-2xl">{star.name}</CardTitle>
                <CardDescription className="text-gray-400 mt-1">
                  Constellation: {star.constellation || "N/A"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Sun className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Spectral Class:</span>
                  <span className="text-white text-sm">{star.spectral_class || "N/A"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Distance (Light-Years):</span>
                  <span className="text-white text-sm">{star.distance_light_year || "N/A"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Ruler className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Right Ascension:</span>
                  <span className="text-white text-sm">{star.right_ascension || "N/A"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Ruler className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Declination:</span>
                  <span className="text-white text-sm">{star.declination || "N/A"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Scale className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Apparent Magnitude:</span>
                  <span className="text-white text-sm">{star.apparent_magnitude || "N/A"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Scale className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Absolute Magnitude:</span>
                  <span className="text-white text-sm">{star.absolute_magnitude || "N/A"}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Separator className="my-12 bg-gray-800" />

        {/* ISS Location Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2">
            <Orbit className="w-8 h-8" /> International Space Station
          </h2>
          {/* ISS Loading State */}
          {issLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <span className="ml-3 text-gray-400">Fetching ISS location...</span>
            </div>
          )}
          {/* ISS Error State */}
          {issError && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6 max-w-md mx-auto">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="text-red-400">{issError}</span>
              </div>
            </div>
          )}
          {/* ISS Details */}
          {!issLoading && !issError && issData && (
            <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-white text-2xl">{issData.name.toUpperCase()}</CardTitle>
                <CardDescription className="text-gray-400 mt-1">ID: {issData.id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Latitude:</span>
                  <span className="text-white text-sm">{issData.latitude.toFixed(4)}°</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Longitude:</span>
                  <span className="text-white text-sm">{issData.longitude.toFixed(4)}°</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Ruler className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Altitude:</span>
                  <span className="text-white text-sm">
                    {issData.altitude.toFixed(2)} {issData.units}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Gauge className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Velocity:</span>
                  <span className="text-white text-sm">
                    {issData.velocity.toFixed(2)} {issData.units}/hour
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Visibility:</span>
                  <span className="text-white text-sm">{issData.visibility}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Last Updated:</span>
                  <span className="text-white text-sm">{new Date(issData.timestamp * 1000).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
