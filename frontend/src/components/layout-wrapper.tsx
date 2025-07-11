"use client"

import type React from "react"
import { ThemeProvider } from "next-themes"
import { SpaceAssistant } from "./space-assistant"
import { Toaster } from "../components/ui/toaster"

interface LayoutWrapperProps {
  children: React.ReactNode
}

/**
 * Layout wrapper component that includes the Space Assistant, Theme Provider, and Toaster
 * This should wrap your main content to ensure the assistant appears on all pages
 */
export function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      {children}
      <SpaceAssistant />
      <Toaster />
    </ThemeProvider>
  )
}
