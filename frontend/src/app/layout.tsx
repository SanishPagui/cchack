import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LayoutWrapper } from "@/components/layout-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AstroGuide - Space Exploration Platform",
  description:
    "Comprehensive space exploration platform with real-time NASA data, asteroid tracking, space weather monitoring, and cosmic discoveries.",
  keywords: "space, astronomy, NASA, asteroids, space weather, mars rover, earth images, cosmic events",
  authors: [{ name: "AstroGuide Team" }],
  openGraph: {
    title: "AstroGuide - Space Exploration Platform",
    description: "Explore the cosmos with real-time NASA data and space monitoring tools.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  )
}
