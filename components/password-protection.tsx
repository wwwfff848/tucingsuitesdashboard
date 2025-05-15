"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Lock } from "lucide-react"

interface PasswordProtectionProps {
  onAuthenticated: () => void
}

export function PasswordProtection({ onAuthenticated }: PasswordProtectionProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

  // Check if already authenticated
  useEffect(() => {
    const isAuth = localStorage.getItem("tucing_auth")
    if (isAuth === "true") {
      onAuthenticated()
    }
  }, [onAuthenticated])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsChecking(true)

    // Replace with your actual password
    if (password === "pocebunny") {
      localStorage.setItem("tucing_auth", "true")
      setError(false)
      onAuthenticated()
    } else {
      setError(true)
      localStorage.removeItem("tucing_auth")
    }

    setIsChecking(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Tucing Suites Calendar</CardTitle>
          <CardDescription className="text-center">Enter the password to access the booking dashboard</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={error ? "border-red-500" : ""}
              />
              {error && <p className="text-sm text-red-500">Incorrect password. Please try again.</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isChecking}>
              {isChecking ? "Checking..." : "Access Dashboard"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
