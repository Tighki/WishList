import { ArrowRight, Gift, Loader2, Plus, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SiteHeader } from '@/components/SiteHeader'
import { useAuth } from '@/context/AuthContext'
import { ApiError, wishlistApi } from '@/lib/api'
import { saveEditToken } from '@/lib/edit-token'
import { cn } from '@/lib/utils'
import type { Wishlist } from '@/types/wishlist'

export function MyWishlistsPage() {
  const navigate = useNavigate()
  const { user, isLoading: isAuthLoading } = useAuth()
  const [wishlists, setWishlists] = useState<Wishlist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthLoading) return
    if (!user) {
      navigate('/login', { replace: true })
      return
    }

    wishlistApi
      .getMyWishlists()
      .then(setWishlists)
      .catch((err) => {
        const message =
          err instanceof ApiError ? err.message : 'Не удалось загрузить вишлисты'
        setError(message)
      })
      .finally(() => setIsLoading(false))
  }, [user, isAuthLoading, navigate])

  async function handleCreate() {
    setIsCreating(true)
    setError(null)
    try {
      const { wishlist, editToken } = await wishlistApi.createWishlist('Мой вишлист')
      saveEditToken(wishlist.slug, editToken)
      navigate(`/w/${wishlist.slug}`)
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Не удалось создать вишлист'
      setError(message)
    } finally {
      setIsCreating(false)
    }
  }

  if (isAuthLoading || (!user && isLoading)) {
    return (
      <div className="min-h-svh bg-cream">
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 py-16 text-center text-sm text-stone">
          Загрузка…
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-cream">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-charcoal">Мои вишлисты</h1>
            <p className="mt-2 text-sm text-stone">
              Привет, {user?.name}! Здесь все ваши списки желаний.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreate}
            disabled={isCreating}
            className={cn(
              'inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3',
              'bg-terracotta text-sm font-medium text-white shadow-md shadow-terracotta/25',
              'transition hover:bg-terracotta-dark disabled:cursor-not-allowed disabled:opacity-50',
            )}
          >
            {isCreating ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}
            Новый вишлист
          </button>
        </div>

        {error && (
          <p className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {isLoading ? (
          <p className="mt-10 text-center text-sm text-stone">Загрузка вишлистов…</p>
        ) : wishlists.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-stone/20 bg-white p-10 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-terracotta/10 text-terracotta">
              <Gift className="size-7" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-charcoal">Пока пусто</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-stone">
              Создайте первый вишлист — он появится здесь и будет привязан к вашему аккаунту
            </p>
            <button
              type="button"
              onClick={handleCreate}
              disabled={isCreating}
              className={cn(
                'mt-6 inline-flex items-center gap-2 rounded-2xl px-5 py-3',
                'bg-terracotta text-sm font-medium text-white shadow-md shadow-terracotta/25',
                'transition hover:bg-terracotta-dark disabled:opacity-50',
              )}
            >
              <Sparkles className="size-4" />
              Создать вишлист
            </button>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {wishlists.map((wishlist) => (
              <Link
                key={wishlist.id}
                to={`/w/${wishlist.slug}`}
                className={cn(
                  'group flex items-center justify-between gap-4 rounded-3xl border border-stone/10',
                  'bg-white px-5 py-4 shadow-sm transition hover:border-terracotta/20 hover:shadow-md',
                )}
              >
                <div className="min-w-0">
                  <p className="truncate text-lg font-medium text-charcoal">{wishlist.title}</p>
                  <p className="mt-1 text-sm text-stone">
                    Создан {new Date(wishlist.createdAt).toLocaleDateString('ru-RU')}
                  </p>
                </div>
                <ArrowRight className="size-5 shrink-0 text-stone transition group-hover:text-terracotta" />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
