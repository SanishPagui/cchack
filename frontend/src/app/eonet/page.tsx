"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {useCosmicCanvas} from "../components/useCosmicCanvas";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Flame,
  Snowflake,
  Waves,
  Mountain,
  Wind,
  Zap,
  MapPin,
  Calendar,
  AlertTriangle,
  Globe,
  Thermometer,
  Cloud,
} from "lucide-react"
import { format } from "date-fns"

interface NaturalEvent {
  id: string
  title: string
  description: string
  link: string
  categories: Array<{
    id: string
    title: string
  }>
  sources: Array<{
    id: string
    url: string
  }>
  geometry: Array<{
    magnitudeValue: number
    magnitudeUnit: string
    date: string
    type: string
    coordinates: number[]
  }>
}

interface EventCategory {
  id: string
  title: string
  description: string
  link: string
  layers: string
}

const EVENT_ICONS = {
  drought: <Thermometer className="w-5 h-5" />,
  dustHaze: <Wind className="w-5 h-5" />,
  earthquakes: <Mountain className="w-5 h-5" />,
  floods: <Waves className="w-5 h-5" />,
  landslides: <Mountain className="w-5 h-5" />,
  manmade: <Zap className="w-5 h-5" />,
  seaLakeIce: <Snowflake className="w-5 h-5" />,
  severeStorms: <Cloud className="w-5 h-5" />,
  snow: <Snowflake className="w-5 h-5" />,
  tempExtremes: <Thermometer className="w-5 h-5" />,
  volcanoes: <Mountain className="w-5 h-5" />,
  waterColor: <Waves className="w-5 h-5" />,
  wildfires: <Flame className="w-5 h-5" />,
}

const EVENT_COLORS = {
  drought: "bg-yellow-900 text-yellow-100",
  dustHaze: "bg-amber-900 text-amber-100",
  earthquakes: "bg-red-900 text-red-100",
  floods: "bg-blue-900 text-blue-100",
  landslides: "bg-orange-900 text-orange-100",
  manmade: "bg-gray-900 text-gray-100",
  seaLakeIce: "bg-cyan-900 text-cyan-100",
  severeStorms: "bg-purple-900 text-purple-100",
  snow: "bg-blue-900 text-blue-100",
  tempExtremes: "bg-red-900 text-red-100",
  volcanoes: "bg-red-900 text-red-100",
  waterColor: "bg-teal-900 text-teal-100",
  wildfires: "bg-orange-900 text-orange-100",
}

export default function NaturalEventTracker() {
  const [events, setEvents] = useState<NaturalEvent[]>([])
  const [categories, setCategories] = useState<EventCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("open")
  const canvasRef = useRef(null)
  useCosmicCanvas(canvasRef);

  const fetchCategories = async () => {
    try {
      const response = await fetch("https://eonet.gsfc.nasa.gov/api/v3/categories")
      if (!response.ok) throw new Error("Failed to fetch categories")
      const data = await response.json()
      setCategories(data.categories)
    } catch (err) {
      console.error("Error fetching categories:", err)
    }
  }

  const fetchEvents = async () => {
    setLoading(true)
    setError(null)

    try {
      let url = `https://eonet.gsfc.nasa.gov/api/v3/events?limit=50&status=${selectedStatus}`
      if (selectedCategory !== "all") {
        url += `&category=${selectedCategory}`
      }

      const response = await fetch(url)
      if (!response.ok) throw new Error("Failed to fetch events")

      const data = await response.json()
      setEvents(data.events)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [selectedCategory, selectedStatus])

  const getEventsByCategory = () => {
    const grouped = events.reduce(
      (acc, event) => {
        event.categories.forEach((category) => {
          if (!acc[category.id]) {
            acc[category.id] = []
          }
          acc[category.id].push(event)
        })
        return acc
      },
      {} as Record<string, NaturalEvent[]>,
    )
    return grouped
  }

  const formatCoordinates = (coords: number[]) => {
    if (coords.length >= 2) {
      const [lng, lat] = coords
      return `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`
    }
    return "Unknown"
  }

  const getLatestGeometry = (event: NaturalEvent) => {
    if (event.geometry.length === 0) return null
    return event.geometry.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
  }

  const eventsByCategory = getEventsByCategory()

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
          <Globe className="w-6 h-6 text-black" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Natural Event Tracker</h1>
          <p className="text-gray-400 text-sm">EONET - Earth Observatory Natural Event Tracker</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-400">Total Events</p>
          <p className="text-xl font-bold text-blue-400">{events.length}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Categories</p>
          <p className="text-xl font-bold text-green-400">{categories.length}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Active Now</p>
          <p className="text-xl font-bold text-orange-400">
            {events.filter((e) => selectedStatus === "open").length}
          </p>
        </div>
      </div>
    </div>
  </div>
</header>


      <div className="container mx-auto px-4 py-8">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="bg-gray-900 border-gray-700 md:w-64">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="bg-gray-900 border-gray-700 md:w-48">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="open">Open Events</SelectItem>
              <SelectItem value="closed">Closed Events</SelectItem>
              <SelectItem value="all">All Events</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={fetchEvents} disabled={loading} className="bg-white text-black hover:bg-gray-200">
            {loading ? "Loading..." : "Refresh Events"}
          </Button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span className="ml-3 text-gray-400">Loading natural events...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-red-400">Error: {error}</span>
            </div>
          </div>
        )}

        {/* Events Display */}
        {!loading && !error && (
          <Tabs defaultValue="grid" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-900 border-gray-800 mb-6">
              <TabsTrigger value="grid" className="data-[state=active]:bg-gray-800">
                Grid View
              </TabsTrigger>
              <TabsTrigger value="category" className="data-[state=active]:bg-gray-800">
                By Category
              </TabsTrigger>
            </TabsList>

            {/* Grid View */}
            <TabsContent value="grid">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => {
                  const latestGeometry = getLatestGeometry(event)
                  const primaryCategory = event.categories[0]
                  const categoryId = primaryCategory?.id as keyof typeof EVENT_ICONS

                  return (
                    <Card
                      key={event.id}
                      className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-white text-lg leading-tight flex items-center gap-2">
                              {EVENT_ICONS[categoryId] || <Globe className="w-5 h-5" />}
                              {event.title}
                            </CardTitle>
                            <CardDescription className="text-gray-400 mt-1">
                              {event.description || "No description available"}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Categories */}
                        <div className="flex flex-wrap gap-1">
                          {event.categories.map((category) => {
                            const catId = category.id as keyof typeof EVENT_COLORS
                            return (
                              <Badge key={category.id} className={EVENT_COLORS[catId] || "bg-gray-700 text-gray-100"}>
                                {category.title}
                              </Badge>
                            )
                          })}
                        </div>

                        {/* Latest Location & Date */}
                        {latestGeometry && (
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-sm">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-400">Location:</span>
                              <span className="text-white">{formatCoordinates(latestGeometry.coordinates)}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-400">Latest Update:</span>
                              <span className="text-white">
                                {format(new Date(latestGeometry.date), "MMM dd, yyyy")}
                              </span>
                            </div>
                            {latestGeometry.magnitudeValue && (
                              <div className="flex items-center space-x-2 text-sm">
                                <AlertTriangle className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-400">Magnitude:</span>
                                <span className="text-white">
                                  {latestGeometry.magnitudeValue} {latestGeometry.magnitudeUnit}
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Sources */}
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Sources: {event.sources.length}</p>
                          <div className="flex flex-wrap gap-1">
                            {event.sources.slice(0, 3).map((source, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs border-gray-700 text-gray-300">
                                Source {idx + 1}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            {/* Category View */}
            <TabsContent value="category">
              <div className="space-y-8">
                {Object.entries(eventsByCategory).map(([categoryId, categoryEvents]) => {
                  const category = categories.find((c) => c.id === categoryId)
                  const catId = categoryId as keyof typeof EVENT_ICONS

                  return (
                    <div key={categoryId}>
                      <div className="flex items-center gap-3 mb-4">
                        {EVENT_ICONS[catId] || <Globe className="w-6 h-6" />}
                        <h2 className="text-2xl font-bold text-white">{category?.title || categoryId}</h2>
                        <Badge variant="outline" className="border-gray-700 text-gray-300">
                          {categoryEvents.length} events
                        </Badge>
                      </div>

                      {category?.description && <p className="text-gray-400 mb-4">{category.description}</p>}

                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {categoryEvents.map((event) => {
                          const latestGeometry = getLatestGeometry(event)

                          return (
                            <Card key={event.id} className="bg-gray-900 border-gray-800">
                              <CardHeader className="pb-3">
                                <CardTitle className="text-white text-base leading-tight">{event.title}</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                {latestGeometry && (
                                  <>
                                    <div className="flex items-center space-x-2 text-sm">
                                      <MapPin className="w-3 h-3 text-gray-400" />
                                      <span className="text-gray-400">Location:</span>
                                      <span className="text-white text-xs">
                                        {formatCoordinates(latestGeometry.coordinates)}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm">
                                      <Calendar className="w-3 h-3 text-gray-400" />
                                      <span className="text-gray-400">Date:</span>
                                      <span className="text-white text-xs">
                                        {format(new Date(latestGeometry.date), "MMM dd")}
                                      </span>
                                    </div>
                                  </>
                                )}
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* No Results */}
        {!loading && !error && events.length === 0 && (
          <div className="text-center py-12">
            <Globe className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No natural events found</p>
            <p className="text-gray-500 text-sm">Try adjusting your filters</p>
          </div>
        )}

        {/* Info Panel */}
        <div className="mt-12 bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h3 className="text-xl font-bold text-white mb-4">About Natural Events</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-orange-400 mb-2">Wildfires</h4>
              <p className="text-gray-400">
                Large fires that spread rapidly through vegetation, often caused by natural factors or human activity,
                monitored via satellite imagery.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-red-400 mb-2">Volcanoes</h4>
              <p className="text-gray-400">
                Volcanic eruptions and activity detected through thermal anomalies and ash plumes visible from
                space-based sensors.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">Severe Storms</h4>
              <p className="text-gray-400">
                Major weather systems including hurricanes, cyclones, and severe thunderstorms tracked through
                meteorological satellites.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <p>Data provided by NASA EONET (Earth Observatory Natural Event Tracker)</p>
            <p>Last updated: {format(new Date(), "MMM dd, yyyy HH:mm")}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
