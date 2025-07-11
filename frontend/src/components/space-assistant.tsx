"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, MessageCircle, Send, Loader2, Sparkles, User, Bot } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface SpaceAssistantProps {
  className?: string
}

export function SpaceAssistant({ className = "" }: SpaceAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your space exploration assistant. Ask me anything about astronomy, space missions, planets, or cosmic phenomena!",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Removed apiStatus state as it's now assumed to be working
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages, isLoading])

  /**
   * Handles sending a new message to the Gemini API via our API route
   * @param userMessage - The user's input message
   */
  const handleSendMessage = async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return // Removed apiStatus check as it's assumed working

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    }

    // Add user message to chat
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsLoading(true)
    setError(null) // Clear previous errors

    try {
      // Call our API route to interact with Gemini
      const response = await fetch("/api/space-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          context: "space and astronomy", // Provide context for the AI
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // If response is not OK, throw an error with the message from the API route
        throw new Error(data.error || `API request failed with status ${response.status}`)
      }

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "I apologize, but I couldn't generate a response. Please try again.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMsg])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage) // Set error state for display

      // Add an error message to the chat for user feedback
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I'm sorry, I encountered an error: ${errorMessage}. Please try again later.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handles form submission for sending messages
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage(input)
  }

  /**
   * Formats timestamp for display
   */
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  /**
   * Provides a list of quick questions for initial interaction
   */
  const getQuickQuestions = () => [
    "What is a black hole?",
    "Tell me about Mars exploration",
    "How do rockets work?",
    "What are exoplanets?",
    "Explain the Big Bang theory",
  ]

  return (
    <>
      {/* Floating Action Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-white text-black shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all duration-300 ${className}`}
        aria-label="Open space assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          // Position the modal to the bottom right
          className="fixed inset-0 z-50 flex items-end justify-end p-4"
          onClick={() => setIsOpen(false)}
        >
          {/* Modal Content */}
          <Card
            // Apply glassy look: semi-transparent background, blur, subtle border
            // Increased size: max-w-lg (from md) and h-[700px] (from 600px)
            className="w-full max-w-lg h-[700px] bg-gray-900/80 backdrop-blur-lg border border-gray-700 flex flex-col rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <CardHeader className="flex-shrink-0 border-b border-gray-800/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-400" />
                  SPOT Ai
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white hover:bg-gray-800/50"
                  aria-label="Close assistant"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-300">Ask me anything about space, astronomy, or NASA missions!</p>
            </CardHeader>

            {/* Messages Area */}
            <CardContent className="flex-1 p-0 overflow-hidden">
              <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {/* Avatar */}
                      {message.role === "assistant" && (
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.role === "user" ? "bg-white text-black" : "bg-gray-800/70 text-white"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-1 ${message.role === "user" ? "text-gray-600" : "text-gray-400"}`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>

                      {/* User Avatar */}
                      {message.role === "user" && (
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Loading Indicator */}
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-gray-800/70 text-white rounded-lg px-4 py-2">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quick Questions - only show if no messages yet and not loading */}
                  {messages.length === 1 && !isLoading && (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-400 px-2">Try asking:</p>
                      <div className="flex flex-wrap gap-2">
                        {getQuickQuestions().map((question, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSendMessage(question)}
                            className="text-xs border-gray-700/50 text-gray-900 hover:bg-gray-800/50 hover:text-white"
                            disabled={isLoading}
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>

            {/* Input Area */}
            <div className="flex-shrink-0 border-t border-gray-800/50 p-4">
              {error && (
                <div className="mb-3 p-2 bg-red-900/20 border border-red-800 rounded text-red-400 text-sm">
                  Error: {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about space, planets, missions..."
                  className="flex-1 bg-gray-800/70 border-gray-700/50 text-white placeholder-gray-400 focus:border-blue-500"
                  disabled={isLoading}
                  maxLength={500}
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-white text-black hover:bg-gray-200 disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>

              <p className="text-xs text-gray-500 mt-2">SPOT Ai • Powered by Gemini • {input.length}/500 characters</p>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
