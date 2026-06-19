import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AddItemForm } from '@/components/AddItemForm'
import { EmptyState } from '@/components/EmptyState'
import { Header } from '@/components/Header'
import { ProductCard } from '@/components/ProductCard'
import { ShareButton } from '@/components/ShareButton'
import { ApiError, wishlistApi } from '@/lib/api'
import { getEditToken } from '@/lib/edit-token'
import type { CreateItemPayload, Wishlist, WishlistItem } from '@/types/wishlist'

export function WishlistPage() {
  const { slug } = useParams<{ slug: string }>()
  const [wishlist, setWishlist] = useState<Wishlist | null>(null)
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isBootstrapping, setIsBootstrapping] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [canEdit, setCanEdit] = useState(false)

  const editToken = slug ? getEditToken(slug) : null

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
    if (!slug) return

    wishlistApi
      .getWishlist(slug, editToken ?? undefined)
      .then((data) => {
        setWishlist(data.wishlist)
        setItems(data.items)
        setCanEdit(data.canEdit || Boolean(editToken))
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true)
          return
        }
        setError('Не удалось загрузить вишлист. Запущен ли backend?')
      })
      .finally(() => setIsBootstrapping(false))
  }, [slug, editToken])

  async function handleAdd(payload: CreateItemPayload) {
    if (!slug || !canEdit) return

    setIsLoading(true)
    setError(null)
    try {
      const item = await wishlistApi.addItem(slug, payload, editToken ?? undefined)
      setItems((prev) => [item, ...prev])
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Не удалось добавить товар'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleRemove(id: string) {
    if (!slug || !canEdit) return

    setError(null)
    try {
      await wishlistApi.removeItem(slug, id, editToken ?? undefined)
      setItems((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Не удалось удалить товар'
      setError(message)
    }
  }

  async function handleQuantityChange(id: string, quantity: number) {
    if (!slug || !canEdit) return

    setError(null)
    const previous = items
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    )

    try {
      const updated = await wishlistApi.updateItem(
        slug,
        id,
        { quantity },
        editToken ?? undefined,
      )
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)))
    } catch (err) {
      setItems(previous)
      const message =
        err instanceof ApiError ? err.message : 'Не удалось обновить количество'
      setError(message)
    }
  }

  if (!slug) {
    return null
  }

  if (notFound) {
    return (
      <div className="flex min-h-svh items-center justify-center px-4">
        <div className="max-w-md rounded-3xl border border-stone/10 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-charcoal">Вишлист не найден</h1>
          <p className="mt-2 text-sm text-stone">Проверьте ссылку или создайте новый список</p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-2xl bg-terracotta px-5 py-3 text-sm font-medium text-white"
          >
            На главную
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-svh">
      <Header
        total={total}
        itemCount={activeCount}
        title={wishlist?.title ?? 'WishList'}
        subtitle={canEdit ? 'Ваш вишлист' : 'Просмотр вишлиста'}
        actions={slug ? <ShareButton slug={slug} /> : undefined}
      />

      <main>
        {canEdit && <AddItemForm onAdd={handleAdd} isLoading={isLoading} />}

        {!canEdit && !isBootstrapping && (
          <div className="mx-auto max-w-3xl px-4 pt-8 text-center sm:px-6">
            <p className="rounded-2xl border border-stone/10 bg-white px-4 py-3 text-sm text-stone">
              Вы смотрите чужой вишлист. Редактирование доступно только владельцу.
            </p>
          </div>
        )}

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
            <EmptyState readOnly={!canEdit} />
          ) : (
            <>
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-charcoal">
                    {wishlist?.title ?? 'Вишлист'}
                  </h2>
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
                    readOnly={!canEdit}
                    onRemove={canEdit ? handleRemove : undefined}
                    onQuantityChange={canEdit ? handleQuantityChange : undefined}
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
