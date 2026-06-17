import type { WishlistItem } from '@/types/wishlist'

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

interface ApiItem {
  id: string
  url: string
  title: string
  description: string
  price: number
  quantity: number
  imageUrl: string
  purchased: boolean
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
    url: item.url,
    title: item.title,
    description: item.description,
    price: item.price,
    quantity: item.quantity > 0 ? item.quantity : 1,
    imageUrl: item.imageUrl,
    purchased: item.purchased,
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
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

export const wishlistApi = {
  async getItems(): Promise<WishlistItem[]> {
    const data = await request<{ items: ApiItem[] }>('/items')
    return data.items.map(mapItem)
  },

  async addItem(url: string, quantity = 1): Promise<WishlistItem> {
    const data = await request<{ item: ApiItem }>('/items', {
      method: 'POST',
      body: JSON.stringify({ url, quantity }),
    })
    return mapItem(data.item)
  },

  async updateQuantity(id: string, quantity: number): Promise<WishlistItem> {
    const data = await request<{ item: ApiItem }>(`/items/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    })
    return mapItem(data.item)
  },

  async removeItem(id: string): Promise<void> {
    await request<void>(`/items/${id}`, { method: 'DELETE' })
  },
}

export { ApiError }
