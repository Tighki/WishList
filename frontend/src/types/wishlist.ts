export interface Wishlist {
  id: string
  slug: string
  title: string
  createdAt: string
}

export interface WishlistItem {
  id: string
  title: string
  description: string
  price: number
  quantity: number
  imageUrl: string
  url: string
  purchased?: boolean
}

export interface CreateItemPayload {
  title: string
  description?: string
  price: number
  imageUrl?: string
  url?: string
  quantity?: number
}
