import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get("name")

  if (!name) {
    return NextResponse.json({ error: "Planet name is required" }, { status: 400 })
  }

  const apiKey = process.env.API_NINJAS_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "API_NINJAS_API_KEY is not configured" }, { status: 500 })
  }

  try {
    const url = `https://api.api-ninjas.com/v1/planets?name=${encodeURIComponent(name)}`
    const res = await fetch(url, {
      headers: {
        "X-Api-Key": apiKey,
      },
      cache: "no-store", // Ensure fresh data
    })

    if (!res.ok) {
      // Attempt to parse error message from API-Ninjas if available
      const errorBody = await res.text()
      console.error(`API-Ninjas error: ${res.status} - ${errorBody}`)
      return NextResponse.json(
        { error: `Failed to fetch planet data: ${res.statusText || errorBody}` },
        { status: res.status },
      )
    }

    const data = await res.json()

    // API-Ninjas returns an array, even for a single result.
    // If no planet is found, it returns an empty array.
    if (data.length === 0) {
      return NextResponse.json({ error: "Planet not found" }, { status: 404 })
    }

    return NextResponse.json(data[0]) // Return the first (and likely only) result
  } catch (error) {
    console.error("Error fetching planet data:", error)
    return NextResponse.json({ error: "An unexpected error occurred while fetching planet data." }, { status: 500 })
  }
}
