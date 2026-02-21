export const APP_NAME = 'Starlinker'

export const SERVICE_CATEGORIES = [
  'Internet',
  'Security',
  'Electronics',
  'Appliances',
  'Smart Home',
] as const

export const PRODUCT_CONDITIONS = [
  'new',
  'like_new',
  'good',
  'fair',
  'refurbished',
] as const

export const BOOKING_STATUS = [
  'pending',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
] as const

export const ORDER_STATUS = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
] as const

export const DELIVERY_STATUS = [
  'pending',
  'confirmed',
  'picked_up',
  'in_transit',
  'delivered',
  'failed',
] as const
