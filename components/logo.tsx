"use client"

import { useEffect, useRef } from "react"

export function TucingLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Draw a cat silhouette as a placeholder
    ctx.fillStyle = "#333"
    ctx.beginPath()

    // Head
    ctx.arc(16, 16, 12, 0, Math.PI * 2)
    ctx.fill()

    // Ears
    ctx.beginPath()
    ctx.moveTo(8, 8)
    ctx.lineTo(4, 0)
    ctx.lineTo(12, 4)
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(24, 8)
    ctx.lineTo(28, 0)
    ctx.lineTo(20, 4)
    ctx.fill()

    // Eyes
    ctx.fillStyle = "#fff"
    ctx.beginPath()
    ctx.arc(12, 14, 3, 0, Math.PI * 2)
    ctx.arc(20, 14, 3, 0, Math.PI * 2)
    ctx.fill()

    // Pupils
    ctx.fillStyle = "#000"
    ctx.beginPath()
    ctx.arc(12, 14, 1.5, 0, Math.PI * 2)
    ctx.arc(20, 14, 1.5, 0, Math.PI * 2)
    ctx.fill()

    // Nose
    ctx.fillStyle = "#ff9999"
    ctx.beginPath()
    ctx.arc(16, 18, 1.5, 0, Math.PI * 2)
    ctx.fill()

    // Whiskers
    ctx.strokeStyle = "#fff"
    ctx.lineWidth = 1

    // Left whiskers
    ctx.beginPath()
    ctx.moveTo(10, 18)
    ctx.lineTo(2, 16)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(10, 19)
    ctx.lineTo(2, 19)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(10, 20)
    ctx.lineTo(2, 22)
    ctx.stroke()

    // Right whiskers
    ctx.beginPath()
    ctx.moveTo(22, 18)
    ctx.lineTo(30, 16)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(22, 19)
    ctx.lineTo(30, 19)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(22, 20)
    ctx.lineTo(30, 22)
    ctx.stroke()
  }, [])

  return <canvas ref={canvasRef} width={32} height={32} className="rounded-full" />
}
