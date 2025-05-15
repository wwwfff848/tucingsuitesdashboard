"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { type Booking, ServiceType } from "@/lib/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { Bath, Cat, User2, CalendarIcon, Phone, DollarSign } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Textarea } from "./ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar } from "./ui/calendar"

interface BookingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate: Date | null
  endDate: Date | null
  booking: Booking | null
  preSelectedServiceType: ServiceType | null
  onSave: (booking: Booking) => void
}

const formSchema = z.object({
  id: z.string().optional(),
  serviceType: z.nativeEnum(ServiceType),
  catName: z.string().min(1, "Cat name is required"),
  ownerName: z.string().min(1, "Owner name is required"),
  startDate: z.date(),
  endDate: z.date().optional(),
  notes: z.string().optional(),
  totalFees: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseFloat(val) : undefined)),
  contactNumber: z.string().optional(),
})

export function BookingDialog({
  open,
  onOpenChange,
  selectedDate,
  endDate,
  booking,
  preSelectedServiceType,
  onSave,
}: BookingDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceType: ServiceType.Grooming,
      catName: "",
      ownerName: "",
      notes: "",
      totalFees: "",
      contactNumber: "",
    },
  })

  // Reset form when dialog opens with new data
  useEffect(() => {
    if (open) {
      if (booking) {
        // Edit mode - populate form with booking data
        form.reset({
          id: booking.id,
          serviceType: booking.serviceType,
          catName: booking.catName,
          ownerName: booking.ownerName,
          startDate: new Date(booking.startDate),
          endDate: booking.endDate ? new Date(booking.endDate) : undefined,
          notes: booking.notes,
          totalFees: booking.totalFees !== undefined ? booking.totalFees.toString() : "",
          contactNumber: booking.contactNumber || "",
        })
      } else {
        // Create mode
        form.reset({
          serviceType: preSelectedServiceType || ServiceType.Grooming,
          catName: "",
          ownerName: "",
          startDate: selectedDate || new Date(),
          endDate: endDate || undefined,
          notes: "",
          totalFees: "",
          contactNumber: "",
        })
      }
    }
  }, [open, booking, selectedDate, endDate, preSelectedServiceType, form])

  // Watch service type to conditionally show end date
  const serviceType = form.watch("serviceType")

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave({
      id: values.id || crypto.randomUUID(),
      serviceType: values.serviceType,
      catName: values.catName,
      ownerName: values.ownerName,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate?.toISOString(),
      notes: values.notes,
      totalFees: values.totalFees,
      contactNumber: values.contactNumber,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{booking ? "Edit Booking" : "Create New Booking"}</DialogTitle>
          <DialogDescription>
            {booking ? "Update the booking details below." : "Fill in the details to create a new booking."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Service Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-6"
                      disabled={!!booking}
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem
                            value={ServiceType.Boarding}
                            id="boarding"
                            checked={field.value === ServiceType.Boarding}
                            disabled={!!booking}
                          />
                        </FormControl>
                        <FormLabel
                          htmlFor="boarding"
                          className={`flex items-center gap-2 font-normal ${booking ? "opacity-70" : ""}`}
                        >
                          <Cat className="h-4 w-4 text-green-500" />
                          <span>Boarding</span>
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem
                            value={ServiceType.Grooming}
                            id="grooming"
                            checked={field.value === ServiceType.Grooming}
                            disabled={!!booking}
                          />
                        </FormControl>
                        <FormLabel
                          htmlFor="grooming"
                          className={`flex items-center gap-2 font-normal ${booking ? "opacity-70" : ""}`}
                        >
                          <Bath className="h-4 w-4 text-blue-500" />
                          <span>Grooming</span>
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  {booking && (
                    <FormDescription className="text-amber-600">
                      Service type cannot be changed when editing a booking
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="catName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cat Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="Whiskers" {...field} className="pl-9" />
                        <Cat className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ownerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="John Doe" {...field} className="pl-9" />
                        <User2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {serviceType === ServiceType.Boarding && (
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            disabled={(date) => {
                              const startDate = form.getValues("startDate")
                              return startDate && date < startDate
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>Required for boarding services</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number (Optional)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="+60 12 345 6789" {...field} className="pl-9" />
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalFees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Fees (RM) (Optional)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="0.00" {...field} className="pl-9" type="number" step="0.01" min="0" />
                        <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any special requirements or information"
                      className="resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
