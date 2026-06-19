import type { CreateItemPayload, Wishlist, WishlistItem, WishlistSummary } from '@/types/wishlist'
import type { User } from '@/types/user'
import { getAuthToken } from '@/lib/auth'

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

interface ApiWishlistSummary extends ApiWishlist {
  itemCount: number
  total: number
}

interface ApiUser {
  id: string
  email: string
  name: string
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

function mapWishlistSummary(wishlist: ApiWishlistSummary): WishlistSummary {
  return {
    id: wishlist.id,
    slug: wishlist.slug,
    title: wishlist.title,
    createdAt: wishlist.createdAt,
    itemCount: wishlist.itemCount,
    total: wishlist.total,
  }
}

function mapUser(user: ApiUser): User {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
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

type RequestOptions = RequestInit & {
  auth?: boolean
  editToken?: string
}

async function request<T>(path: string, init?: RequestOptions): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (init?.auth !== false) {
    const token = getAuthToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  if (init?.editToken) {
    headers['X-Edit-Token'] = init.editToken
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...headers,
      ...(init?.headers as Record<string, string> | undefined),
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

export const authApi = {
  async register(input: {
    email: string
    password: string
    name?: string
  }): Promise<{ user: User; accessToken: string }> {
    const data = await request<{ user: ApiUser; accessToken: string }>('/auth/register', {
      method: 'POST',
      auth: false,
      body: JSON.stringify(input),
    })
    return { user: mapUser(data.user), accessToken: data.accessToken }
  },

  async login(input: {
    email: string
    password: string
  }): Promise<{ user: User; accessToken: string }> {
    const data = await request<{ user: ApiUser; accessToken: string }>('/auth/login', {
      method: 'POST',
      auth: false,
      body: JSON.stringify(input),
    })
    return { user: mapUser(data.user), accessToken: data.accessToken }
  },

  async me(): Promise<User> {
    const data = await request<{ user: ApiUser }>('/auth/me')
    return mapUser(data.user)
  },
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

  async getMyWishlists(): Promise<WishlistSummary[]> {
    const data = await request<{ wishlists: ApiWishlistSummary[] }>('/wishlists/mine')
    return data.wishlists.map(mapWishlistSummary)
  },

  async updateWishlist(
    slug: string,
    patch: { title: string },
    editToken?: string,
  ): Promise<Wishlist> {
    const data = await request<{ wishlist: ApiWishlist }>(`/wishlists/${slug}`, {
      method: 'PATCH',
      editToken,
      body: JSON.stringify(patch),
    })
    return mapWishlist(data.wishlist)
  },

  async getWishlist(
    slug: string,
    editToken?: string,
  ): Promise<{ wishlist: Wishlist; items: WishlistItem[]; canEdit: boolean }> {
    const data = await request<{
      wishlist: ApiWishlist
      items: ApiItem[]
      canEdit?: boolean
    }>(`/wishlists/${slug}`, {
      editToken,
    })
    return {
      wishlist: mapWishlist(data.wishlist),
      items: data.items.map(mapItem),
      canEdit: Boolean(data.canEdit),
    }
  },

  async addItem(
    slug: string,
    payload: CreateItemPayload,
    editToken?: string,
  ): Promise<WishlistItem> {
    const data = await request<{ item: ApiItem }>(`/wishlists/${slug}/items`, {
      method: 'POST',
      editToken,
      body: JSON.stringify(payload),
    })
    return mapItem(data.item)
  },

  async updateItem(
    slug: string,
    id: string,
    patch: { quantity?: number; purchased?: boolean },
    editToken?: string,
  ): Promise<WishlistItem> {
    const data = await request<{ item: ApiItem }>(`/wishlists/${slug}/items/${id}`, {
      method: 'PATCH',
      editToken,
      body: JSON.stringify(patch),
    })
    return mapItem(data.item)
  },

  async removeItem(slug: string, id: string, editToken?: string): Promise<void> {
    await request<void>(`/wishlists/${slug}/items/${id}`, {
      method: 'DELETE',
      editToken,
    })
  },
}

export { ApiError }
