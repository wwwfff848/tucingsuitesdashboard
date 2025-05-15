"use client"

import { useState, useEffect } from "react"
import { supabase } from "./supabase-client"
import type { Booking, ServiceType } from "./types"

export function useBookingsDb() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if Supabase is properly configured
  const isMissingConfig = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Load bookings from Supabase on initial render
  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true)

        // If Supabase is not configured, fall back to localStorage
        if (isMissingConfig) {
          const savedBookings = localStorage.getItem("catBookings")
          if (savedBookings) {
            setBookings(JSON.parse(savedBookings))
          }
          return
        }

        const { data, error } = await supabase.from("bookings").select("*").order("start_date", { ascending: false })

        if (error) {
          throw error
        }

        // Transform the data to match our Booking type
        const transformedBookings: Booking[] = data.map((item) => ({
          id: item.id,
          serviceType: item.service_type as ServiceType,
          catName: item.cat_name,
          ownerName: item.owner_name,
          startDate: item.start_date,
          endDate: item.end_date || undefined,
          notes: item.notes || undefined,
          totalFees: item.total_fees || undefined,
          contactNumber: item.contact_number || undefined,
        }))

        setBookings(transformedBookings)
        setError(null)
      } catch (err: any) {
        console.error("Error fetching bookings:", err)
        setError("Failed to load bookings. Please try again.")

        // Try to fall back to localStorage if Supabase fails
        const savedBookings = localStorage.getItem("catBookings")
        if (savedBookings) {
          try {
            setBookings(JSON.parse(savedBookings))
            setError(null)
          } catch (e) {
            console.error("Failed to parse bookings from localStorage", e)
          }
        }
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [isMissingConfig])

  // Save to localStorage as a backup
  useEffect(() => {
    if (bookings.length > 0) {
      localStorage.setItem("catBookings", JSON.stringify(bookings))
    }
  }, [bookings])

  const addBooking = async (booking: Booking) => {
    try {
      setLoading(true)

      // If Supabase is not configured, fall back to localStorage
      if (isMissingConfig) {
        setBookings((prev) => [...prev, booking])
        return booking
      }

      const { data, error } = await supabase
        .from("bookings")
        .insert([
          {
            id: booking.id,
            service_type: booking.serviceType,
            cat_name: booking.catName,
            owner_name: booking.ownerName,
            start_date: booking.startDate,
            end_date: booking.endDate,
            notes: booking.notes,
            total_fees: booking.totalFees,
            contact_number: booking.contactNumber,
          },
        ])
        .select()

      if (error) {
        throw error
      }

      // Transform the returned data
      const newBooking: Booking = {
        id: data[0].id,
        serviceType: data[0].service_type as ServiceType,
        catName: data[0].cat_name,
        ownerName: data[0].owner_name,
        startDate: data[0].start_date,
        endDate: data[0].end_date || undefined,
        notes: data[0].notes || undefined,
        totalFees: data[0].total_fees || undefined,
        contactNumber: data[0].contact_number || undefined,
      }

      setBookings((prev) => [...prev, newBooking])
      return newBooking
    } catch (err: any) {
      console.error("Error adding booking:", err)
      setError("Failed to add booking. Please try again.")

      // Fall back to localStorage
      setBookings((prev) => [...prev, booking])
      return booking
    } finally {
      setLoading(false)
    }
  }

  const updateBooking = async (updatedBooking: Booking) => {
    try {
      setLoading(true)

      // If Supabase is not configured, fall back to localStorage
      if (isMissingConfig) {
        setBookings((prev) => prev.map((booking) => (booking.id === updatedBooking.id ? updatedBooking : booking)))
        return updatedBooking
      }

      const { data, error } = await supabase
        .from("bookings")
        .update({
          service_type: updatedBooking.serviceType,
          cat_name: updatedBooking.catName,
          owner_name: updatedBooking.ownerName,
          start_date: updatedBooking.startDate,
          end_date: updatedBooking.endDate,
          notes: updatedBooking.notes,
          total_fees: updatedBooking.totalFees,
          contact_number: updatedBooking.contactNumber,
        })
        .eq("id", updatedBooking.id)
        .select()

      if (error) {
        throw error
      }

      setBookings((prev) => prev.map((booking) => (booking.id === updatedBooking.id ? updatedBooking : booking)))
      return updatedBooking
    } catch (err: any) {
      console.error("Error updating booking:", err)
      setError("Failed to update booking. Please try again.")

      // Fall back to localStorage
      setBookings((prev) => prev.map((booking) => (booking.id === updatedBooking.id ? updatedBooking : booking)))
      return updatedBooking
    } finally {
      setLoading(false)
    }
  }

  const deleteBooking = async (id: string) => {
    try {
      setLoading(true)

      // If Supabase is not configured, fall back to localStorage
      if (isMissingConfig) {
        setBookings((prev) => prev.filter((booking) => booking.id !== id))
        return true
      }

      const { error } = await supabase.from("bookings").delete().eq("id", id)

      if (error) {
        throw error
      }

      setBookings((prev) => prev.filter((booking) => booking.id !== id))
      return true
    } catch (err: any) {
      console.error("Error deleting booking:", err)
      setError("Failed to delete booking. Please try again.")

      // Fall back to localStorage
      setBookings((prev) => prev.filter((booking) => booking.id !== id))
      return true
    } finally {
      setLoading(false)
    }
  }

  return {
    bookings,
    addBooking,
    updateBooking,
    deleteBooking,
    loading,
    error,
  }
}
