import type { CreateItemPayload, Wishlist, WishlistItem } from '@/types/wishlist'

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

interface ApiItem {
  id: string
  title: string
  description: string
  price: number
  quantity: number
  imageUrl: string
  url: string
  purchased: boolean
  createdAt: string
}

interface ApiWishlist {
  id: string
  slug: string
  title: string
  createdAt: string
}

interface ApiErrorBody {
  error?: string
  code?: string
}

class ApiError extends Error {
  status: number
  code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

function mapItem(item: ApiItem): WishlistItem {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    price: item.price,
    quantity: item.quantity > 0 ? item.quantity : 1,
    imageUrl: item.imageUrl,
    url: item.url,
    purchased: item.purchased,
  }
}

function mapWishlist(wishlist: ApiWishlist): Wishlist {
  return {
    id: wishlist.id,
    slug: wishlist.slug,
    title: wishlist.title,
    createdAt: wishlist.createdAt,
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    let body: ApiErrorBody = {}
    try {
      body = (await response.json()) as ApiErrorBody
    } catch {
      // ignore
    }
    throw new ApiError(
      body.error ?? `Ошибка API (${response.status})`,
      response.status,
      body.code,
    )
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

function withEditToken(editToken?: string): HeadersInit | undefined {
  if (!editToken) return undefined
  return { 'X-Edit-Token': editToken }
}

export const wishlistApi = {
  async createWishlist(title?: string): Promise<{ wishlist: Wishlist; editToken: string }> {
    const data = await request<{ wishlist: ApiWishlist; editToken: string }>('/wishlists', {
      method: 'POST',
      body: JSON.stringify({ title }),
    })
    return {
      wishlist: mapWishlist(data.wishlist),
      editToken: data.editToken,
    }
  },

  async getWishlist(slug: string): Promise<{ wishlist: Wishlist; items: WishlistItem[] }> {
    const data = await request<{ wishlist: ApiWishlist; items: ApiItem[] }>(`/wishlists/${slug}`)
    return {
      wishlist: mapWishlist(data.wishlist),
      items: data.items.map(mapItem),
    }
  },

  async addItem(
    slug: string,
    payload: CreateItemPayload,
    editToken: string,
  ): Promise<WishlistItem> {
    const data = await request<{ item: ApiItem }>(`/wishlists/${slug}/items`, {
      method: 'POST',
      headers: withEditToken(editToken),
      body: JSON.stringify(payload),
    })
    return mapItem(data.item)
  },

  async updateItem(
    slug: string,
    id: string,
    patch: { quantity?: number; purchased?: boolean },
    editToken: string,
  ): Promise<WishlistItem> {
    const data = await request<{ item: ApiItem }>(`/wishlists/${slug}/items/${id}`, {
      method: 'PATCH',
      headers: withEditToken(editToken),
      body: JSON.stringify(patch),
    })
    return mapItem(data.item)
  },

  async removeItem(slug: string, id: string, editToken: string): Promise<void> {
    await request<void>(`/wishlists/${slug}/items/${id}`, {
      method: 'DELETE',
      headers: withEditToken(editToken),
    })
  },
}

export { ApiError }
