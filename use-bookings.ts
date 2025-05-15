"use client"

import { useState, useEffect } from "react"
import type { Booking } from "./types"

const STORAGE_KEY = "tucing_cat_bookings"

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load bookings from localStorage on initial render
  useEffect(() => {
    try {
      const savedBookings = localStorage.getItem(STORAGE_KEY)
      if (savedBookings) {
        setBookings(JSON.parse(savedBookings))
      }
    } catch (error) {
      console.error("Failed to load bookings from localStorage:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save bookings to localStorage whenever they change
  // Only run this effect after the initial load to prevent overwriting
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings))
      } catch (error) {
        console.error("Failed to save bookings to localStorage:", error)
      }
    }
  }, [bookings, isLoaded])

  const addBooking = (booking: Booking) => {
    setBookings((prev) => {
      const newBookings = [...prev, booking]
      return newBookings
    })
  }

  const updateBooking = (updatedBooking: Booking) => {
    setBookings((prev) => {
      const newBookings = prev.map((booking) => (booking.id === updatedBooking.id ? updatedBooking : booking))
      return newBookings
    })
  }

  const deleteBooking = (id: string) => {
    setBookings((prev) => {
      const newBookings = prev.filter((booking) => booking.id !== id)
      return newBookings
    })
  }

  // Function to manually save current state to localStorage
  const saveToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings))
      return true
    } catch (error) {
      console.error("Failed to manually save bookings:", error)
      return false
    }
  }

  // Function to export bookings as JSON
  const exportBookings = () => {
    return JSON.stringify(bookings, null, 2)
  }

  // Function to import bookings from JSON
  const importBookings = (jsonData: string) => {
    try {
      const parsedData = JSON.parse(jsonData) as Booking[]
      setBookings(parsedData)
      return true
    } catch (error) {
      console.error("Failed to import bookings:", error)
      return false
    }
  }

  return {
    bookings,
    addBooking,
    updateBooking,
    deleteBooking,
    saveToStorage,
    exportBookings,
    importBookings,
    isLoaded,
  }
}
