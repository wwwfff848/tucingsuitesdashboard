"use client"

import { useState, useRef, useMemo } from "react"
import { type Booking, ServiceType } from "@/lib/types"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

interface BookingCalendarProps {
  bookings: Booking[]
  onDateRangeSelect: (startDate: Date, endDate: Date) => void
  onDoubleClickDate: (date: Date) => void
}

export function BookingCalendar({ bookings, onDateRangeSelect, onDoubleClickDate }: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [firstSelectedDate, setFirstSelectedDate] = useState<Date | null>(null)
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Get current month and year
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Get days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

  // Days of the week
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  // Create a map of bookings by ID for consistent positioning
  const bookingPositions = useMemo(() => {
    const positions = new Map<string, number>()
    let position = 0

    // First assign positions to boarding bookings
    bookings
      .filter((booking) => booking.serviceType === ServiceType.Boarding)
      .forEach((booking) => {
        if (!positions.has(booking.id)) {
          positions.set(booking.id, position++)
        }
      })

    // Then assign positions to grooming bookings
    bookings
      .filter((booking) => booking.serviceType === ServiceType.Grooming)
      .forEach((booking) => {
        if (!positions.has(booking.id)) {
          positions.set(booking.id, position++)
        }
      })

    return positions
  }, [bookings])

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
    setFirstSelectedDate(null)
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
    setFirstSelectedDate(null)
  }

  // Handle date click with single/double click detection
  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day)

    if (clickTimeoutRef.current) {
      // Double click detected
      clearTimeout(clickTimeoutRef.current)
      clickTimeoutRef.current = null
      onDoubleClickDate(clickedDate)
      setFirstSelectedDate(null)
      return
    }

    // Single click - wait to see if there's a double click
    clickTimeoutRef.current = setTimeout(() => {
      clickTimeoutRef.current = null

      // If this is the first date selection
      if (!firstSelectedDate) {
        setFirstSelectedDate(clickedDate)
      } else {
        // This is the second date selection
        // Ensure the dates are in chronological order
        const startDate = firstSelectedDate < clickedDate ? firstSelectedDate : clickedDate
        const endDate = firstSelectedDate < clickedDate ? clickedDate : firstSelectedDate

        onDateRangeSelect(startDate, endDate)
        setFirstSelectedDate(null)
      }
    }, 250) // 250ms is a common double-click threshold
  }

  // Handle mouse enter for date range preview
  const handleDateMouseEnter = (day: number) => {
    if (firstSelectedDate) {
      setHoverDate(new Date(currentYear, currentMonth, day))
    }
  }

  // Handle mouse leave
  const handleDateMouseLeave = () => {
    setHoverDate(null)
  }

  // Function to get bookings for a specific date
  const getBookingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]

    const dateBookings = bookings.filter((booking) => {
      // For boarding (multi-day), check if the date falls within the booking period
      if (booking.serviceType === ServiceType.Boarding && booking.endDate) {
        const startDate = new Date(booking.startDate).toISOString().split("T")[0]
        const endDate = new Date(booking.endDate).toISOString().split("T")[0]
        return dateStr >= startDate && dateStr <= endDate
      }

      // For grooming (single day), just check if it's on the date
      return new Date(booking.startDate).toISOString().split("T")[0] === dateStr
    })

    // Sort bookings: boarding first, then by position for consistent display
    return dateBookings.sort((a, b) => {
      // Boarding bookings always come first
      if (a.serviceType === ServiceType.Boarding && b.serviceType !== ServiceType.Boarding) {
        return -1
      }
      if (a.serviceType !== ServiceType.Boarding && b.serviceType === ServiceType.Boarding) {
        return 1
      }

      // Then sort by the position in the bookingPositions map for consistency
      const posA = bookingPositions.get(a.id) || 0
      const posB = bookingPositions.get(b.id) || 0
      return posA - posB
    })
  }

  // Check if a date is today
  const isToday = (day: number) => {
    const today = new Date()
    return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
  }

  // Check if a date is the first selected date
  const isFirstSelected = (day: number) => {
    if (!firstSelectedDate) return false
    return (
      day === firstSelectedDate.getDate() &&
      currentMonth === firstSelectedDate.getMonth() &&
      currentYear === firstSelectedDate.getFullYear()
    )
  }

  // Check if a date is in the range between first selected and hover date
  const isInSelectedRange = (day: number) => {
    if (!firstSelectedDate || !hoverDate) return false

    const currentDate = new Date(currentYear, currentMonth, day)
    const startDate = firstSelectedDate < hoverDate ? firstSelectedDate : hoverDate
    const endDate = firstSelectedDate < hoverDate ? hoverDate : firstSelectedDate

    return currentDate >= startDate && currentDate <= endDate
  }

  // Generate calendar grid
  const calendarDays = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-28 p-1 border border-border/50 bg-muted/20"></div>)
  }

  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateBookings = getBookingsForDate(new Date(currentYear, currentMonth, day))

    calendarDays.push(
      <div
        key={`day-${day}`}
        className={`h-28 border border-border/50 relative cursor-pointer transition-all
          ${isFirstSelected(day) ? "ring-2 ring-primary ring-inset bg-primary/10" : ""}
          ${isInSelectedRange(day) && !isFirstSelected(day) ? "bg-primary/5" : ""}
          hover:bg-muted/20 hover:shadow-md hover:scale-[1.02] hover:z-10`}
        onClick={() => handleDateClick(day)}
        onMouseEnter={() => handleDateMouseEnter(day)}
        onMouseLeave={handleDateMouseLeave}
        title={
          firstSelectedDate
            ? "Click to select end date for boarding"
            : "Click twice to select dates for boarding, or double-click for grooming"
        }
      >
        {/* Day header with day number */}
        <div className="p-1">
          <span
            className={`text-sm font-medium ${isToday(day) ? "bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center" : ""}`}
          >
            {day}
          </span>
        </div>

        {/* Booking slots - fixed position and height */}
        <div className="absolute bottom-0 left-0 right-0 space-y-0.5 p-1">
          {/* Show up to 3 bookings */}
          {dateBookings.slice(0, 3).map((booking, idx) => (
            <div
              key={booking.id}
              className={`truncate px-1 py-0.5 text-white text-xs font-medium ${
                booking.serviceType === ServiceType.Boarding ? "bg-green-500" : "bg-blue-500"
              }`}
            >
              {booking.catName}
            </div>
          ))}

          {/* Add empty placeholder slots to maintain consistent height */}
          {dateBookings.length === 0 && (
            <>
              <div className="h-[22px] invisible">placeholder</div>
              <div className="h-[22px] invisible">placeholder</div>
              <div className="h-[22px] invisible">placeholder</div>
            </>
          )}
          {dateBookings.length === 1 && (
            <>
              <div className="h-[22px] invisible">placeholder</div>
              <div className="h-[22px] invisible">placeholder</div>
            </>
          )}
          {dateBookings.length === 2 && <div className="h-[22px] invisible">placeholder</div>}
        </div>
      </div>,
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Booking Calendar</CardTitle>
            <CardDescription>
              {firstSelectedDate
                ? "Select end date for boarding service"
                : "Double-click for grooming or select two dates for boarding"}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="font-medium min-w-28 text-center">
              {monthNames[currentMonth]} {currentYear}
            </div>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Calendar header - days of week */}
        <div className="grid grid-cols-7 mb-1">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center font-medium text-sm py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-px mb-4">{calendarDays}</div>

        <div className="mt-4 flex items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-sm">Boarding</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-sm">Grooming</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
