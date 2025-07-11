import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get("name")

  if (!name) {
    return NextResponse.json({ error: "Star name is required" }, { status: 400 })
  }

  const apiKey = process.env.API_NINJAS_API_KEY

  if (!apiKey) {
    console.error("API_NINJAS_API_KEY is not configured.")
    return NextResponse.json({ error: "API_NINJAS_API_KEY is not configured" }, { status: 500 })
  }

  try {
    const url = `https://api.api-ninjas.com/v1/stars?name=${encodeURIComponent(name)}`
    const res = await fetch(url, {
      headers: {
        "X-Api-Key": apiKey,
      },
      cache: "no-store", // Ensure fresh data
    })

    if (!res.ok) {
      const errorBody = await res.text()
      console.error(`API-Ninjas stars API returned non-OK status: ${res.status} - ${errorBody}`)
      return NextResponse.json(
        { error: `Failed to fetch star data: ${res.statusText || errorBody}` },
        { status: res.status },
      )
    }

    let data: any[] // Use any[] for initial parsing flexibility
    try {
      data = await res.json() // Attempt to parse as JSON
    } catch (jsonError) {
      const rawText = await res.text() // Get the raw text if JSON parsing fails
      console.error(
        "Failed to parse API-Ninjas star response as JSON:",
        jsonError,
        "Raw response:",
        rawText.substring(0, 500) + "...",
      )
      return NextResponse.json(
        {
          error: "Received non-JSON response from API-Ninjas for stars. Check API key or request format.",
          rawResponseSnippet: rawText.substring(0, 200),
        },
        { status: 500 },
      )
    }

    if (data.length === 0) {
      return NextResponse.json({ error: "Star not found" }, { status: 404 })
    }

    return NextResponse.json(data[0]) // Return the first (and likely only) result
  } catch (error) {
    console.error("Error in /api/stars route:", error)
    return NextResponse.json(
      { error: "An unexpected server error occurred while fetching star data." },
      { status: 500 },
    )
  }
}
