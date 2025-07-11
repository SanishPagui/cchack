"use client";

//NOT WORKING

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import * as satellite from "satellite.js";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

type SatellitePoint = {
  lat: number;
  lng: number;
  alt: number;
  name: string;
  path: { lat: number; lng: number; alt: number }[];
};

export default function DebrisTracker() {
  const [satPoints, setSatPoints] = useState<SatellitePoint[]>([]);
  console.log("satPoints", satPoints);


  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchSatellites = async () => {
      try {
        const res = await fetch("https://celestrak.org/NORAD/elements/active.txt");
        const tleText = await res.text();
        const tleLines = tleText.trim().split("\n");

        const sats: SatellitePoint[] = [];

        for (let i = 0; i < tleLines.length; i += 3) {
          const name = tleLines[i].trim();
          const tle1 = tleLines[i + 1].trim();
          const tle2 = tleLines[i + 2].trim();

          const satrec = satellite.twoline2satrec(tle1, tle2);
          const now = new Date();

          const posVelNow = satellite.propagate(satrec, now);
          if (!posVelNow || !posVelNow.position) continue;

          const gmst = satellite.gstime(now);
          const geoNow = satellite.eciToGeodetic(posVelNow.position, gmst);

          const point: SatellitePoint = {
            lat: satellite.degreesLat(geoNow.latitude),
            lng: satellite.degreesLong(geoNow.longitude),
            alt: geoNow.height * 1000,
            name,
            path: [],
          };

          // generate orbit path (every 10 min over next 90 mins)
          const pathPoints: { lat: number; lng: number; alt: number }[] = [];
          for (let mins = 0; mins <= 90; mins += 10) {
            const futureTime = new Date(now.getTime() + mins * 60 * 1000);
            const posVelFuture = satellite.propagate(satrec, futureTime);
            if (!posVelFuture || !posVelFuture.position) continue;

            const geoFuture = satellite.eciToGeodetic(posVelFuture.position, satellite.gstime(futureTime));
            pathPoints.push({
              lat: satellite.degreesLat(geoFuture.latitude),
              lng: satellite.degreesLong(geoFuture.longitude),
              alt: geoFuture.height * 1000,
            });
          }

          point.path = pathPoints;

          sats.push(point);
        }

        setSatPoints(sats);
      } catch (err) {
        console.error("Failed to fetch TLE:", err);
      }
    };

    fetchSatellites();
    interval = setInterval(fetchSatellites, 60000);

    return () => clearInterval(interval);
  }, []);

  // helper: color by altitude
  const getAltitudeColor = (alt: number) => {
    if (alt < 500000) return "red"; // <500km
    if (alt < 1000000) return "orange"; // <1000km
    return "green"; // >1000km
  };

  return (
    <div className="h-screen w-screen">
      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundColor="black"
        pointsData={satPoints}
        pointLat="lat"
        pointLng="lng"
        pointAltitude="alt"
        pointColor={(d: SatellitePoint) => getAltitudeColor(d.alt)}
        pointRadius={0.2}
        pointLabel={(d: SatellitePoint) => `${d.name}\nAltitude: ${(d.alt / 1000).toFixed(0)} km`}
        arcsData={satPoints.flatMap(sat =>
          sat.path.slice(1).map((p, idx) => ({
            startLat: sat.path[idx].lat,
            startLng: sat.path[idx].lng,
            endLat: p.lat,
            endLng: p.lng,
            color: [getAltitudeColor(sat.alt), getAltitudeColor(sat.alt)],
          }))
        )}
        arcColor="color"
        arcStroke={0.5}
        arcDashLength={0.2}
        arcDashGap={0.1}
        arcDashAnimateTime={4000}
      />
    </div>
  );
}
