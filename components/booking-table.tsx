"use client"

import { useState } from "react"
import { type Booking, ServiceType } from "@/lib/types"
import { Bath, Cat, MoreHorizontal, Pencil, Plus, Trash } from "lucide-react"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "./ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface BookingTableProps {
  bookings: Booking[]
  onAddBooking: (date: Date) => void
  onEditBooking: (booking: Booking) => void
  onDeleteBooking: (id: string) => void
}

export function BookingTable({ bookings, onAddBooking, onEditBooking, onDeleteBooking }: BookingTableProps) {
  const [activeTab, setActiveTab] = useState<"all" | "boarding" | "grooming">("all")

  // Sort bookings by start date (newest first)
  const sortedBookings = [...bookings].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())

  // Filter bookings based on active tab
  const filteredBookings = sortedBookings.filter((booking) => {
    if (activeTab === "all") return true
    if (activeTab === "boarding") return booking.serviceType === ServiceType.Boarding
    if (activeTab === "grooming") return booking.serviceType === ServiceType.Grooming
    return true
  })

  // Format currency
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return "-"
    return `RM ${amount.toFixed(2)}`
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>Manage all your cat boarding and grooming bookings</CardDescription>
        </div>
        <Button onClick={() => onAddBooking(new Date())}>
          <Plus className="h-4 w-4 mr-2" />
          Add Booking
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="mb-4" onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList>
            <TabsTrigger value="all">All Bookings</TabsTrigger>
            <TabsTrigger value="boarding" className="flex items-center gap-1">
              <Cat className="h-3.5 w-3.5 text-green-500" />
              <span>Boarding Only</span>
            </TabsTrigger>
            <TabsTrigger value="grooming" className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5 text-blue-500" />
              <span>Grooming Only</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Cat Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Total Fees</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {booking.serviceType === ServiceType.Boarding ? (
                          <>
                            <Cat className="h-4 w-4 text-green-500" />
                            <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                              Boarding
                            </Badge>
                          </>
                        ) : (
                          <>
                            <Bath className="h-4 w-4 text-blue-500" />
                            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                              Grooming
                            </Badge>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{booking.catName}</TableCell>
                    <TableCell>{booking.ownerName}</TableCell>
                    <TableCell>{booking.contactNumber || "-"}</TableCell>
                    <TableCell>{new Date(booking.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{booking.endDate ? new Date(booking.endDate).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>{formatCurrency(booking.totalFees)}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{booking.notes || "-"}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEditBooking(booking)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDeleteBooking(booking.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No {activeTab !== "all" ? activeTab : ""} bookings found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
