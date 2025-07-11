"use client"

import type React from "react"

import { SpaceAssistant } from "./space-assistant"

interface LayoutWrapperProps {
  children: React.ReactNode
}

/**
 * Layout wrapper component that includes the Space Assistant
 * This should wrap your main content to ensure the assistant appears on all pages
 */
export function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <>
      {children}
      <SpaceAssistant />
    </>
  )
}
