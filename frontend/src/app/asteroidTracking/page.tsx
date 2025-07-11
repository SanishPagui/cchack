"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Search,
  AlertTriangle,
  Zap,
  Ruler,
  Clock,
} from "lucide-react";
import { format, addDays, subDays } from "date-fns";

interface Asteroid {
  id: string;
  name: string;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: Array<{
    close_approach_date: string;
    relative_velocity: {
      kilometers_per_hour: string;
    };
    miss_distance: {
      kilometers: string;
    };
  }>;
}

interface NeoFeedResponse {
  near_earth_objects: {
    [date: string]: Asteroid[];
  };
  element_count: number;
}

export default function AsteroidTracker() {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchAsteroids = async (date: Date) => {
    setLoading(true);
    setError(null);

    try {
      const startDate = format(date, "yyyy-MM-dd");
      const endDate = format(addDays(date, 7), "yyyy-MM-dd");

      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${process.env.NEXT_PUBLIC_NASA_API_KEY}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch asteroid data");
      }

      const data: NeoFeedResponse = await response.json();

      // Flatten all asteroids from all dates
      const allAsteroids = Object.values(data.near_earth_objects).flat();
      setAsteroids(allAsteroids);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsteroids(selectedDate);
  }, [selectedDate]);

  const filteredAsteroids = asteroids.filter((asteroid) =>
    asteroid.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hazardousCount = asteroids.filter(
    (a) => a.is_potentially_hazardous_asteroid
  ).length;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Asteroid Tracker</h1>
                <p className="text-gray-400 text-sm">
                  Near Earth Object Monitoring
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Total Objects</p>
                <p className="text-xl font-bold">{asteroids.length}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Potentially Hazardous</p>
                <p className="text-xl font-bold text-red-400">
                  {hazardousCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search asteroids..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setSelectedDate(subDays(selectedDate, 7))}
              className="border-gray-700 text-gray-900 hover:bg-gray-800"
            >
              Previous Week
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedDate(new Date())}
              className="border-gray-700 text-gray-900 hover:bg-gray-800"
            >
              Today
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedDate(addDays(selectedDate, 7))}
              className="border-gray-700 text-gray-900 hover:bg-gray-800"
            >
              Next Week
            </Button>
          </div>
        </div>

        {/* Date Range Display */}
        <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-800">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400">Showing data from:</span>
            <span className="text-white font-medium">
              {format(selectedDate, "MMM dd, yyyy")} -{" "}
              {format(addDays(selectedDate, 7), "MMM dd, yyyy")}
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span className="ml-3 text-gray-400">Loading asteroid data...</span>
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

        {/* Asteroid Grid */}
        {!loading && !error && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAsteroids.map((asteroid) => (
              <Card
                key={asteroid.id}
                className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg leading-tight">
                        {asteroid.name.replace(/[()]/g, "")}
                      </CardTitle>
                      <CardDescription className="text-gray-400 mt-1">
                        ID: {asteroid.id}
                      </CardDescription>
                    </div>
                    {asteroid.is_potentially_hazardous_asteroid && (
                      <Badge
                        variant="destructive"
                        className="bg-red-900 text-red-100 border-red-800"
                      >
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Hazardous
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Size */}
                  <div className="flex items-center space-x-2">
                    <Ruler className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Diameter:</span>
                    <span className="text-white text-sm">
                      {asteroid.estimated_diameter.kilometers.estimated_diameter_min.toFixed(
                        2
                      )}{" "}
                      -{" "}
                      {asteroid.estimated_diameter.kilometers.estimated_diameter_max.toFixed(
                        2
                      )}{" "}
                      km
                    </span>
                  </div>

                  <Separator className="bg-gray-800" />

                  {/* Close Approach Data */}
                  {asteroid.close_approach_data
                    .slice(0, 1)
                    .map((approach, index) => (
                      <div key={index} className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-400">
                            Close Approach:
                          </span>
                          <span className="text-white text-sm">
                            {format(
                              new Date(approach.close_approach_date),
                              "MMM dd, yyyy"
                            )}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Velocity</p>
                            <p className="text-white font-medium">
                              {Number.parseInt(
                                approach.relative_velocity.kilometers_per_hour
                              ).toLocaleString()}{" "}
                              km/h
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">Miss Distance</p>
                            <p className="text-white font-medium">
                              {Number.parseInt(
                                approach.miss_distance.kilometers
                              ).toLocaleString()}{" "}
                              km
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && filteredAsteroids.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <p className="text-gray-400">
              No asteroids found matching "{searchTerm}"
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <p>Data provided by NASA Near Earth Object Web Service (NeoWs)</p>
            <p>Last updated: {format(new Date(), "MMM dd, yyyy HH:mm")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
