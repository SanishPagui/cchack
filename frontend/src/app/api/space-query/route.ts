import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

/**
 * Handles POST requests to process space-related queries using Gemini AI
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { message, context } = await request.json()

    // Validate required fields
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required and must be a string" }, { status: 400 })
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 })
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" })

    // Create a space-focused prompt
    const spacePrompt = `You are a knowledgeable space and astronomy assistant. Please provide accurate, informative, and engaging answers about space-related topics including:
    - Astronomy and astrophysics
    - Space missions and exploration
    - Planets, stars, and celestial bodies
    - NASA and other space agencies
    - Space technology and spacecraft
    - Cosmology and the universe

    Keep responses concise but informative (under 300 words). If the question is not space-related, politely redirect the conversation back to space topics.

    User question: ${message}`

    // Generate response using Gemini
    const result = await model.generateContent(spacePrompt)
    const response = await result.response
    const text = response.text()

    // Return the AI response
    return NextResponse.json({
      response: text,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Gemini API Error:", error)

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes("API_KEY")) {
        return NextResponse.json({ error: "Invalid or missing API key" }, { status: 401 })
      }

      if (error.message.includes("quota")) {
        return NextResponse.json({ error: "API quota exceeded. Please try again later." }, { status: 429 })
      }
    }

    // Generic error response
    return NextResponse.json({ error: "Failed to process your request. Please try again." }, { status: 500 })
  }
}

/**
 * Handles GET requests - returns API status
 */
export async function GET() {
  return NextResponse.json({
    status: "Space Query API is running",
    timestamp: new Date().toISOString(),
  })
}
