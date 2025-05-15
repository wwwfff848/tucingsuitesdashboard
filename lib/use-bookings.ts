"use client"

import { useState, useEffect } from "react"
import type { Booking } from "./types"

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])

  // Load bookings from localStorage on initial render
  useEffect(() => {
    const savedBookings = localStorage.getItem("catBookings")
    if (savedBookings) {
      try {
        setBookings(JSON.parse(savedBookings))
      } catch (error) {
        console.error("Failed to parse bookings from localStorage", error)
      }
    }
  }, [])

  // Save bookings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("catBookings", JSON.stringify(bookings))
  }, [bookings])

  const addBooking = (booking: Booking) => {
    setBookings((prev) => [...prev, booking])
  }

  const updateBooking = (updatedBooking: Booking) => {
    setBookings((prev) => prev.map((booking) => (booking.id === updatedBooking.id ? updatedBooking : booking)))
  }

  const deleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((booking) => booking.id !== id))
  }

  return {
    bookings,
    addBooking,
    updateBooking,
    deleteBooking,
  }
}
