import { Gift, Loader2, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiError, wishlistApi } from '@/lib/api'
import { saveEditToken } from '@/lib/edit-token'
import { cn } from '@/lib/utils'

export function HomePage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('Мой вишлист')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCreate() {
    setIsLoading(true)
    setError(null)
    try {
      const { wishlist, editToken } = await wishlistApi.createWishlist(title)
      saveEditToken(wishlist.slug, editToken)
      navigate(`/w/${wishlist.slug}`)
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Не удалось создать вишлист. Запущен ли backend?'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-svh bg-cream">
      <main className="mx-auto flex min-h-svh max-w-3xl flex-col justify-center px-4 py-16 sm:px-6">
        <div className="text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-terracotta/10 text-terracotta">
            <Gift className="size-8" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl">
            Соберите вишлист и поделитесь ссылкой
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-stone sm:text-base">
            Создайте список желаний, добавляйте товары вручную и отправьте ссылку
            близким — они увидят ваш вишлист без регистрации
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-stone/10 bg-white p-6 shadow-sm sm:p-8">
          <label className="mb-2 block text-sm font-medium text-charcoal">
            Название вишлиста
          </label>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className={cn(
              'w-full rounded-2xl border border-stone/20 bg-white px-4 py-3.5',
              'text-sm text-charcoal placeholder:text-stone/60',
              'focus:border-terracotta/40 focus:ring-2 focus:ring-terracotta/20 focus:outline-none',
            )}
            disabled={isLoading}
          />

          {error && (
            <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleCreate}
            disabled={isLoading || !title.trim()}
            className={cn(
              'mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4',
              'bg-terracotta text-sm font-medium text-white shadow-md shadow-terracotta/25',
              'transition hover:bg-terracotta-dark disabled:cursor-not-allowed disabled:opacity-50',
            )}
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            Создать вишлист
          </button>
        </div>
      </main>
    </div>
  )
}
