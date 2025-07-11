import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("https://api.wheretheiss.at/v1/satellites/25544")
    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.message || "Failed to fetch ISS data from external API." },
        { status: response.status },
      )
    }
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching ISS data:", error)
    return NextResponse.json({ error: "Internal server error." }, { status: 500 })
  }
}
