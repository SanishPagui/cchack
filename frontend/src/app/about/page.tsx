"use client"

import { useRef } from "react"
import { useCosmicCanvas } from "../components/useCosmicCanvas"
import { Particles } from "@/components/magicui/particles"
import  About  from "../components/About"
import TestimonialsSection from "../components/TestimonialsSection"
import Navbar from "../components/Navbar"

export default function AboutPage() {
  const canvasRef = useRef(null)
  useCosmicCanvas(canvasRef)

  return (
    <div>
        <Navbar />
        <About/>
    </div>
  )
}