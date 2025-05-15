"use client"

import { useState } from "react"
import { Dashboard } from "@/components/dashboard"
import { PasswordProtection } from "@/components/password-protection"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  if (!isAuthenticated) {
    return <PasswordProtection onAuthenticated={() => setIsAuthenticated(true)} />
  }

  return <Dashboard />
}
