import { useEffect, useMemo, useState } from 'react'
import { AddItemForm } from '@/components/AddItemForm'
import { EmptyState } from '@/components/EmptyState'
import { Header } from '@/components/Header'
import { ProductCard } from '@/components/ProductCard'
import { ApiError, wishlistApi } from '@/lib/api'
import type { WishlistItem } from '@/types/wishlist'

export function WishlistDashboard() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isBootstrapping, setIsBootstrapping] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const total = useMemo(
    () =>
      items
        .filter((item) => !item.purchased)
        .reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  )

  const activeCount = useMemo(
    () =>
      items
        .filter((item) => !item.purchased)
        .reduce((sum, item) => sum + item.quantity, 0),
    [items],
  )

  useEffect(() => {
    wishlistApi
      .getItems()
      .then(setItems)
      .catch(() => setError('Не удалось загрузить вишлист. Запущен ли backend?'))
      .finally(() => setIsBootstrapping(false))
  }, [])

  async function handleAdd(url: string, quantity: number) {
    setIsLoading(true)
    setError(null)
    try {
      const item = await wishlistApi.addItem(url, quantity)
      setItems((prev) => [item, ...prev])
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Не удалось добавить товар. Проверьте ссылку и backend.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleRemove(id: string) {
    setError(null)
    try {
      await wishlistApi.removeItem(id)
      setItems((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Не удалось удалить товар'
      setError(message)
    }
  }

  async function handleQuantityChange(id: string, quantity: number) {
    setError(null)
    const previous = items
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    )

    try {
      const updated = await wishlistApi.updateQuantity(id, quantity)
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)))
    } catch (err) {
      setItems(previous)
      const message =
        err instanceof ApiError ? err.message : 'Не удалось обновить количество'
      setError(message)
    }
  }

  return (
    <div className="min-h-svh">
      <Header total={total} itemCount={activeCount} />

      <main>
        <AddItemForm onAdd={handleAdd} isLoading={isLoading} />

        {error && (
          <div className="mx-auto mt-4 max-w-3xl px-4 sm:px-6">
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          </div>
        )}

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          {isBootstrapping ? (
            <p className="text-center text-sm text-stone">Загрузка вишлиста…</p>
          ) : items.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-charcoal">Мой вишлист</h2>
                  <p className="mt-1 text-sm text-stone">
                    {items.length} {items.length === 1 ? 'позиция' : 'позиций'} в списке
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    onRemove={handleRemove}
                    onQuantityChange={handleQuantityChange}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  )
}
