export enum ServiceType {
  Boarding = "boarding",
  Grooming = "grooming",
}

export interface Booking {
  id: string
  serviceType: ServiceType
  catName: string
  ownerName: string
  startDate: string
  endDate?: string
  notes?: string
}
