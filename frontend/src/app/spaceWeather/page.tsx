"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export default function SpaceWeather() {
  const [kpIndex, setKpIndex] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [impact, setImpact] = useState<string>("");
  const [severity, setSeverity] = useState<"green" | "orange" | "red">("green");

  useEffect(() => {
    const fetchKp = async () => {
      const res = await fetch("https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json");
      const data = await res.json();
      setKpIndex(parseFloat(data[data.length - 1][1]));
    };
    fetchKp();
    const interval = setInterval(fetchKp, 60000);
    return () => clearInterval(interval);
  }, []);

  const geocode = async () => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    if (data.length > 0) {
      const { lat, lon, display_name } = data[0];
      const latNum = parseFloat(lat);
      const lonNum = parseFloat(lon);
      setLocation({ lat: latNum, lng: lonNum, name: display_name });

      if (kpIndex !== null) {
        let suggestion = "";
        let sev: "green" | "orange" | "red" = "green";

        if (Math.abs(latNum) > 60 && kpIndex >= 5) {
          suggestion = "High-latitude: Aurora likely, secure power grids.";
          sev = "orange";
        } else if (Math.abs(latNum) > 45 && kpIndex >= 7) {
          suggestion = "Mid-latitude: Aurora possible, GPS disturbances.";
          sev = "red";
        } else if (kpIndex >= 9) {
          suggestion = "Low-latitude: Rare aurora possible.";
          sev = "red";
        } else {
          suggestion = "No significant impact expected at this location.";
          sev = "green";
        }

        setImpact(suggestion);
        setSeverity(sev);
      }
    }
  };

  const severityColor = {
    green: "bg-green-500",
    orange: "bg-orange-500",
    red: "bg-red-600",
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-900 text-white">
      <header className="p-4 flex justify-between items-center bg-gray-800 shadow-md">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter a place"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="text-black px-2 py-1 rounded"
          />
          <button
            onClick={geocode}
            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded shadow"
          >
            Check Impact
          </button>
        </div>
        <div>
          Current Kp:{" "}
          <span
            className={`px-2 py-1 rounded ${severityColor[severity]} text-sm`}
          >
            {kpIndex ?? "Loading…"}
          </span>
        </div>
      </header>

      <div className="p-4">
        {location && (
          <div className="bg-gray-800 rounded p-4 shadow-md">
            <h2 className="text-xl font-bold mb-2">{location.name}</h2>
            <p>{impact}</p>
            {severity !== "green" && (
              <p className="mt-2 text-sm text-yellow-300">
                ⚠ Mitigation tip: Monitor satellite links and secure sensitive electronics.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex-1">
        <Globe
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          backgroundColor="black"
          pointsData={location ? [location] : []}
          pointLat="lat"
          pointLng="lng"
          pointAltitude={0.01}
          pointRadius={0.4}
          pointColor={() => severity}
          pointLabel={() => location?.name ?? ""}
        />
      </div>
    </div>
  );
}
