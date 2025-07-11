"use client";

//INCOMPLETE DATA

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

type ArcData = {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: [string, string];
};

export default function AsteroidGlobe() {
  const [arcsData, setArcsData] = useState<ArcData[]>([]);
  const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY || "DEMO_KEY";

  useEffect(() => {
    async function fetchAsteroids() {
      const today = new Date().toISOString().split("T")[0];
      const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${apiKey}`;

      try {
        const res = await fetch(url);
        const json = await res.json();

        const neoData = json.near_earth_objects[today] || [];

        const newArcs: ArcData[] = neoData.map((asteroid: any) => {
          const randomStartLat = Math.random() * 180 - 90;
          const randomStartLng = Math.random() * 360 - 180;
          const randomEndLat = Math.random() * 180 - 90;
          const randomEndLng = Math.random() * 360 - 180;

          return {
            startLat: randomStartLat,
            startLng: randomStartLng,
            endLat: randomEndLat,
            endLng: randomEndLng,
            color: ["orange", "red"]
          };
        });

        setArcsData(newArcs);
      } catch (err) {
        console.error("Failed to fetch NeoWs data:", err);
      }
    }

    fetchAsteroids();
  }, []);

  return (
    <div className="h-screen w-screen">
      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        arcsData={arcsData}
        arcColor={"color"}
        arcDashLength={0.4}
        arcDashGap={4}
        arcDashAnimateTime={2000}
        arcStroke={1.5}
        backgroundColor="black"
      />
    </div>
  );
}
