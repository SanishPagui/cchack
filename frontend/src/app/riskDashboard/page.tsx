"use client";

import { useEffect, useState, useRef } from "react";
import {useCosmicCanvas} from "../components/useCosmicCanvas";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

type Asteroid = {
  name: string;
  size: number;
  velocity: number;
  hazardous: boolean;
  missDistanceKm: number;
  missDistanceLunar: number;
  closeApproachTime: string;
  orbitingBody: string;
};

export default function RiskDashboard() {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY || "DEMO_KEY";
  const canvasRef = useRef(null)
  useCosmicCanvas(canvasRef);

  useEffect(() => {
    const fetchAsteroids = async () => {
      const today = new Date().toISOString().split("T")[0];
      const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${apiKey}`;

      const res = await fetch(url);
      const json = await res.json();

      const neos = json.near_earth_objects[today] || [];

      const mapped: Asteroid[] = neos.map((neo: any) => {
        const approach = neo.close_approach_data[0];
        return {
          name: neo.name,
          size: (neo.estimated_diameter.meters.estimated_diameter_max + neo.estimated_diameter.meters.estimated_diameter_min) / 2,
          velocity: parseFloat(approach?.relative_velocity.kilometers_per_hour || "0"),
          hazardous: neo.is_potentially_hazardous_asteroid,
          missDistanceKm: parseFloat(approach?.miss_distance.kilometers || "0"),
          missDistanceLunar: parseFloat(approach?.miss_distance.lunar || "0"),
          closeApproachTime: approach?.close_approach_date_full || "",
          orbitingBody: approach?.orbiting_body || "N/A",
        };
      });

      setAsteroids(mapped);
    };

    fetchAsteroids();
  }, []);

  const hazardousCount = asteroids.filter(a => a.hazardous).length;
  const safeCount = asteroids.length - hazardousCount;

  const pieData = [
    { name: "Hazardous", value: hazardousCount },
    { name: "Safe", value: safeCount },
  ];

  const COLORS = ["#FF4136", "#2ECC40"];

  return (
    <div className="h-screen w-screen bg-gray-900 text-gray-100 p-4 space-y-8 overflow-auto relative">
    {/* Back Button */}
    <button
      onClick={() => window.location.href = "/links"}
      className="absolute top-4 left-4 px-3 py-1 text-sm text-white bg-gray-700 hover:bg-gray-600 rounded-md flex items-center gap-1 z-50"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>

    {/* Background Canvas */}
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full min-h-screen pointer-events-none"
      style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.1) 0%, rgba(30, 41, 59, 0.05) 50%, transparent 100%)'
      }}
    />

    {/* Updated Header */}
    <h1 className="text-3xl font-bold text-center">☄️ Near-Earth Asteroid Risk Dashboard</h1>

      {/* Charts */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl mb-2">Asteroid Size Distribution (m)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={asteroids}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="size" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl mb-2">Velocity (km/h)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={asteroids}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="velocity" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Pie */}
      <section className="bg-gray-800 p-4 rounded shadow mx-auto max-w-md">
        <h2 className="text-xl mb-2 text-center">Hazardous vs Safe</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              label
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </section>

      {/* Table */}
      <section className="bg-gray-800 p-4 rounded shadow">
        <h2 className="text-xl mb-2">Asteroid Details</h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-sm">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-2 py-1">Name</th>
                <th className="px-2 py-1">Size (m)</th>
                <th className="px-2 py-1">Velocity (km/h)</th>
                <th className="px-2 py-1">Hazardous</th>
                <th className="px-2 py-1">Miss Dist. (km)</th>
                <th className="px-2 py-1">Miss Dist. (LD)</th>
                <th className="px-2 py-1">Time</th>
                <th className="px-2 py-1">Orbit</th>
              </tr>
            </thead>
            <tbody>
              {asteroids.map((a, idx) => (
                <tr key={idx} className="hover:bg-gray-700">
                  <td className="px-2 py-1">{a.name}</td>
                  <td className="px-2 py-1">{a.size.toFixed(1)}</td>
                  <td className="px-2 py-1">{a.velocity.toFixed(0)}</td>
                  <td className={`px-2 py-1 ${a.hazardous ? "text-red-500" : "text-green-400"}`}>
                    {a.hazardous ? "Yes" : "No"}
                  </td>
                  <td className="px-2 py-1">{a.missDistanceKm.toFixed(0)}</td>
                  <td className="px-2 py-1">{a.missDistanceLunar.toFixed(2)}</td>
                  <td className="px-2 py-1">{a.closeApproachTime}</td>
                  <td className="px-2 py-1">{a.orbitingBody}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
