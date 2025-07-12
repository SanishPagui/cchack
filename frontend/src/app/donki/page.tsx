"use client"

import { useState, useEffect,useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sun, AlertTriangle, Activity, Radio, Waves, Clock, MapPin, TrendingUp, Shield, Satellite } from "lucide-react"
import { format, subDays } from "date-fns"
import {useCosmicCanvas} from "../components/useCosmicCanvas";

interface SolarFlare {
  flrID: string
  instruments: Array<{
    displayName: string
  }>
  beginTime: string
  peakTime: string
  endTime: string
  classType: string
  sourceLocation: string
  activeRegionNum: number
}

interface CoronalMassEjection {
  activityID: string
  catalog: string
  startTime: string
  sourceLocation: string
  activeRegionNum: number
  note: string
  instruments: Array<{
    displayName: string
  }>
  cmeAnalyses: Array<{
    time21_5: string
    latitude: number
    longitude: number
    halfAngle: number
    speed: number
    type: string
  }>
}

interface GeomagneticStorm {
  gstID: string
  startTime: string
  allKpIndex: Array<{
    observedTime: string
    kpIndex: number
    source: string
  }>
  linkedEvents: Array<{
    activityID: string
  }>
}

interface RadioBlackout {
  rbeID: string
  beginTime: string
  estimatedEndTime: string
  classType: string
  scale: string
  instruments: Array<{
    displayName: string
  }>
}

export default function SpaceWeatherTracker() {
  const [solarFlares, setSolarFlares] = useState<SolarFlare[]>([])
  const [cmes, setCmes] = useState<CoronalMassEjection[]>([])
  const [geoStorms, setGeoStorms] = useState<GeomagneticStorm[]>([])
  const [radioBlackouts, setRadioBlackouts] = useState<RadioBlackout[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("flares")
  const canvasRef = useRef(null)
  useCosmicCanvas(canvasRef);

  const fetchSpaceWeatherData = async () => {
    setLoading(true)
    setError(null)

    try {
      const endDate = new Date()
      const startDate = subDays(endDate, 30)
      const startDateStr = format(startDate, "yyyy-MM-dd")
      const endDateStr = format(endDate, "yyyy-MM-dd")

      const baseUrl = "https://api.nasa.gov/DONKI"

      // Fetch all space weather data
      const [flaresRes, cmesRes, geoStormsRes, radioRes] = await Promise.all([
        fetch(`${baseUrl}/FLR?startDate=${startDateStr}&endDate=${endDateStr}&api_key=${process.env.NEXT_PUBLIC_NASA_API_KEY}`),
        fetch(`${baseUrl}/CME?startDate=${startDateStr}&endDate=${endDateStr}&api_key=${process.env.NEXT_PUBLIC_NASA_API_KEY}`),
        fetch(`${baseUrl}/GST?startDate=${startDateStr}&endDate=${endDateStr}&api_key=${process.env.NEXT_PUBLIC_NASA_API_KEY}`),
        fetch(`${baseUrl}/RBE?startDate=${startDateStr}&endDate=${endDateStr}&api_key=${process.env.NEXT_PUBLIC_NASA_API_KEY}`),
      ])

      if (!flaresRes.ok || !cmesRes.ok || !geoStormsRes.ok || !radioRes.ok) {
        throw new Error("Failed to fetch space weather data")
      }

      const [flaresData, cmesData, geoStormsData, radioData] = await Promise.all([
        flaresRes.json(),
        cmesRes.json(),
        geoStormsRes.json(),
        radioRes.json(),
      ])

      setSolarFlares(flaresData)
      setCmes(cmesData)
      setGeoStorms(geoStormsData)
      setRadioBlackouts(radioData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSpaceWeatherData()
  }, [])

  const getFlareIntensity = (classType: string) => {
    if (classType.startsWith("X")) return { color: "bg-red-900 text-red-100", intensity: "Extreme" }
    if (classType.startsWith("M")) return { color: "bg-orange-900 text-orange-100", intensity: "Strong" }
    if (classType.startsWith("C")) return { color: "bg-yellow-900 text-yellow-100", intensity: "Moderate" }
    return { color: "bg-gray-700 text-gray-100", intensity: "Minor" }
  }

  const getKpColor = (kp: number) => {
    if (kp >= 7) return "text-red-400"
    if (kp >= 5) return "text-orange-400"
    if (kp >= 4) return "text-yellow-400"
    return "text-green-400"
  }

  return (
    <div className="min-h-screen bg-black text-white">
        <canvas 
    ref={canvasRef} 
    className="fixed top-0 left-0 w-full h-full min-h-screen pointer-events-none "
    style={{
      background: 'radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.1) 0%, rgba(30, 41, 59, 0.05) 50%, transparent 100%)'
    }}
  />
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
  <div className="relative container mx-auto px-4 py-6">
    {/* Back Button */}
   <button
      onClick={() => window.location.href = "/links"}
      className="absolute top-8 -left-32 group inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg hover:bg-gray-700/90 hover:border-gray-600 hover:scale-105 active:scale-95 transition-all duration-200 z-50 shadow-lg hover:shadow-xl"
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

    {/* Header Content */}
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <Sun className="w-6 h-6 text-black" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Space Weather Monitor</h1>
          <p className="text-gray-400 text-sm">
            DONKI - Database Of Notifications, Knowledge, Information
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-400">Solar Flares</p>
          <p className="text-xl font-bold text-orange-400">{solarFlares.length}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">CMEs</p>
          <p className="text-xl font-bold text-blue-400">{cmes.length}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Geo Storms</p>
          <p className="text-xl font-bold text-purple-400">{geoStorms.length}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Radio Blackouts</p>
          <p className="text-xl font-bold text-red-400">{radioBlackouts.length}</p>
        </div>
      </div>
    </div>
  </div>
</header>


      <div className="container mx-auto px-4 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span className="ml-3 text-gray-400">Loading space weather data...</span>
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

        {/* Main Content */}
        {!loading && !error && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-900 border-gray-800">
              <TabsTrigger value="flares" className="data-[state=active]:bg-gray-800">
                <Sun className="w-4 h-4 mr-2" />
                Solar Flares
              </TabsTrigger>
              <TabsTrigger value="cmes" className="data-[state=active]:bg-gray-800">
                <Waves className="w-4 h-4 mr-2" />
                CMEs
              </TabsTrigger>
              <TabsTrigger value="storms" className="data-[state=active]:bg-gray-800">
                <Activity className="w-4 h-4 mr-2" />
                Geo Storms
              </TabsTrigger>
              <TabsTrigger value="radio" className="data-[state=active]:bg-gray-800">
                <Radio className="w-4 h-4 mr-2" />
                Radio Blackouts
              </TabsTrigger>
            </TabsList>

            {/* Solar Flares Tab */}
            <TabsContent value="flares" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {solarFlares.map((flare) => {
                  const intensity = getFlareIntensity(flare.classType)
                  return (
                    <Card
                      key={flare.flrID}
                      className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-white text-lg flex items-center gap-2">
                              <Sun className="w-5 h-5 text-orange-400" />
                              Solar Flare {flare.classType}
                            </CardTitle>
                            <CardDescription className="text-gray-400 mt-1">
                              Active Region: {flare.activeRegionNum || "Unknown"}
                            </CardDescription>
                          </div>
                          <Badge className={intensity.color}>{intensity.intensity}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Begin Time
                            </p>
                            <p className="text-white font-medium">
                              {format(new Date(flare.beginTime), "MMM dd, HH:mm")}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              Peak Time
                            </p>
                            <p className="text-white font-medium">
                              {format(new Date(flare.peakTime), "MMM dd, HH:mm")}
                            </p>
                          </div>
                        </div>

                        <Separator className="bg-gray-800" />

                        <div>
                          <p className="text-gray-400 flex items-center gap-1 mb-2">
                            <MapPin className="w-3 h-3" />
                            Source Location
                          </p>
                          <p className="text-white text-sm">{flare.sourceLocation || "Not specified"}</p>
                        </div>

                        <div>
                          <p className="text-gray-400 flex items-center gap-1 mb-2">
                            <Satellite className="w-3 h-3" />
                            Instruments
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {flare.instruments.map((instrument, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs border-gray-700 text-gray-300">
                                {instrument.displayName}
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

            {/* CMEs Tab */}
            <TabsContent value="cmes" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cmes.map((cme) => (
                  <Card
                    key={cme.activityID}
                    className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors"
                  >
                    <CardHeader>
                      <CardTitle className="text-white text-lg flex items-center gap-2">
                        <Waves className="w-5 h-5 text-blue-400" />
                        Coronal Mass Ejection
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        {cme.catalog} • AR {cme.activeRegionNum || "Unknown"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Start Time
                        </p>
                        <p className="text-white font-medium">
                          {format(new Date(cme.startTime), "MMM dd, yyyy HH:mm")}
                        </p>
                      </div>

                      <Separator className="bg-gray-800" />

                      {cme.cmeAnalyses.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-gray-400">Analysis Data</p>
                          {cme.cmeAnalyses.slice(0, 1).map((analysis, idx) => (
                            <div key={idx} className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="text-gray-500">Speed</p>
                                <p className="text-white">{analysis.speed} km/s</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Half Angle</p>
                                <p className="text-white">{analysis.halfAngle}°</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div>
                        <p className="text-gray-400 flex items-center gap-1 mb-2">
                          <MapPin className="w-3 h-3" />
                          Source Location
                        </p>
                        <p className="text-white text-sm">{cme.sourceLocation || "Not specified"}</p>
                      </div>

                      {cme.note && (
                        <div>
                          <p className="text-gray-400 mb-1">Notes</p>
                          <p className="text-white text-sm">{cme.note}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Geomagnetic Storms Tab */}
            <TabsContent value="storms" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {geoStorms.map((storm) => (
                  <Card
                    key={storm.gstID}
                    className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors"
                  >
                    <CardHeader>
                      <CardTitle className="text-white text-lg flex items-center gap-2">
                        <Activity className="w-5 h-5 text-purple-400" />
                        Geomagnetic Storm
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Started: {format(new Date(storm.startTime), "MMM dd, yyyy HH:mm")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-gray-400 mb-2 flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Kp Index Values
                        </p>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {storm.allKpIndex.slice(0, 5).map((kp, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                              <span className="text-gray-400">{format(new Date(kp.observedTime), "MMM dd HH:mm")}</span>
                              <span className={`font-bold ${getKpColor(kp.kpIndex)}`}>Kp {kp.kpIndex}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {storm.linkedEvents.length > 0 && (
                        <div>
                          <p className="text-gray-400 mb-2">Linked Events</p>
                          <div className="space-y-1">
                            {storm.linkedEvents.map((event, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs border-gray-700 text-gray-300">
                                {event.activityID}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Radio Blackouts Tab */}
            <TabsContent value="radio" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {radioBlackouts.map((blackout) => (
                  <Card
                    key={blackout.rbeID}
                    className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-white text-lg flex items-center gap-2">
                            <Radio className="w-5 h-5 text-red-400" />
                            Radio Blackout
                          </CardTitle>
                          <CardDescription className="text-gray-400 mt-1">
                            Class {blackout.classType} • Scale {blackout.scale}
                          </CardDescription>
                        </div>
                        <Badge variant="destructive" className="bg-red-900 text-red-100">
                          {blackout.scale}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Begin Time
                          </p>
                          <p className="text-white font-medium">
                            {blackout.beginTime && !isNaN(new Date(blackout.beginTime).getTime())
                              ? format(new Date(blackout.beginTime), "MMM dd, HH:mm")
                              : "Unknown"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Est. End Time
                          </p>
                          <p className="text-white font-medium">
                            {blackout.estimatedEndTime
                              ? format(new Date(blackout.estimatedEndTime), "MMM dd, HH:mm")
                              : "Ongoing"}
                          </p>
                        </div>
                      </div>

                      <Separator className="bg-gray-800" />

                      <div>
                        <p className="text-gray-400 flex items-center gap-1 mb-2">
                          <Satellite className="w-3 h-3" />
                          Instruments
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {blackout.instruments.map((instrument, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs border-gray-700 text-gray-300">
                              {instrument.displayName}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Info Panel */}
        <div className="mt-12 bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h3 className="text-xl font-bold text-white mb-4">About Space Weather Events</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-orange-400 mb-2">Solar Flares</h4>
              <p className="text-gray-400">
                Intense bursts of radiation from the Sun's surface. X-class flares are the most intense, followed by
                M-class and C-class flares.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">Coronal Mass Ejections</h4>
              <p className="text-gray-400">
                Large expulsions of plasma and magnetic field from the Sun's corona that can affect Earth's
                magnetosphere and technology.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-purple-400 mb-2">Geomagnetic Storms</h4>
              <p className="text-gray-400">
                Disturbances in Earth's magnetosphere caused by solar wind. Measured by Kp index from 0-9, with higher
                values indicating stronger storms.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-red-400 mb-2">Radio Blackouts</h4>
              <p className="text-gray-400">
                Disruptions to radio communications caused by increased X-ray emissions from solar flares affecting
                Earth's ionosphere.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <p>Data provided by NASA DONKI (Database Of Notifications, Knowledge, Information)</p>
            <p>Last updated: {format(new Date(), "MMM dd, yyyy HH:mm")}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
