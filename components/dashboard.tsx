"use client"

import { useState } from "react"
import { BookingCalendar } from "./booking-calendar"
import { BookingTable } from "./booking-table"
import { BookingDialog } from "./booking-dialog"
import type { Booking } from "@/lib/types"
import { ServiceType } from "@/lib/types"
import { useBookingsDb } from "@/lib/use-bookings-db"

export function Dashboard() {
  const { bookings, addBooking, updateBooking, deleteBooking, loading, error } = useBookingsDb()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [editBooking, setEditBooking] = useState<Booking | null>(null)
  const [preSelectedServiceType, setPreSelectedServiceType] = useState<ServiceType | null>(null)

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setEndDate(null)
    setEditBooking(null)
    setPreSelectedServiceType(null)
    setIsDialogOpen(true)
  }

  const handleDateRangeSelect = (startDate: Date, endDate: Date) => {
    setSelectedDate(startDate)
    setEndDate(endDate)
    setEditBooking(null)
    setPreSelectedServiceType(ServiceType.Boarding)
    setIsDialogOpen(true)
  }

  const handleDoubleClickDate = (date: Date) => {
    setSelectedDate(date)
    setEndDate(null)
    setEditBooking(null)
    setPreSelectedServiceType(ServiceType.Grooming)
    setIsDialogOpen(true)
  }

  const handleEditBooking = (booking: Booking) => {
    setEditBooking(booking)
    setSelectedDate(null)
    setEndDate(null)
    setPreSelectedServiceType(null)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedDate(null)
    setEndDate(null)
    setEditBooking(null)
    setPreSelectedServiceType(null)
  }

  const handleSaveBooking = async (booking: Booking) => {
    if (editBooking) {
      await updateBooking(booking)
    } else {
      await addBooking(booking)
    }
    handleCloseDialog()
  }

  const handleDeleteBooking = async (id: string) => {
    await deleteBooking(id)
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-outfit">
      <header className="border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Tucing Suites Calendar</h1>
          </div>
        </div>
      </header>
      <main className="container px-4 py-6 space-y-6">
        {loading ? (
          <div className="flex justify-center p-8">
            <p>Loading bookings...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <BookingCalendar
              bookings={bookings}
              onDateRangeSelect={handleDateRangeSelect}
              onDoubleClickDate={handleDoubleClickDate}
            />
            <BookingTable
              bookings={bookings}
              onAddBooking={handleDateSelect}
              onEditBooking={handleEditBooking}
              onDeleteBooking={handleDeleteBooking}
            />
          </>
        )}
      </main>
      <BookingDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedDate={selectedDate}
        endDate={endDate}
        booking={editBooking}
        preSelectedServiceType={preSelectedServiceType}
        onSave={handleSaveBooking}
      />
    </div>
  )
}
