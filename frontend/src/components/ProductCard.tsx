import { Minus, Plus, Trash2 } from 'lucide-react'
import type { KeyboardEvent, MouseEvent } from 'react'
import { cn, formatPrice } from '@/lib/utils'
import type { WishlistItem } from '@/types/wishlist'

interface ProductCardProps {
  item: WishlistItem
  onRemove: (id: string) => void
  onQuantityChange: (id: string, quantity: number) => void
}

export function ProductCard({ item, onRemove, onQuantityChange }: ProductCardProps) {
  const lineTotal = item.price * item.quantity

  function openProduct() {
    window.open(item.url, '_blank', 'noopener,noreferrer')
  }

  function stopCardNavigation(event: MouseEvent | KeyboardEvent) {
    event.stopPropagation()
  }

  function decrease(event: MouseEvent) {
    stopCardNavigation(event)
    if (item.quantity <= 1) return
    onQuantityChange(item.id, item.quantity - 1)
  }

  function increase(event: MouseEvent) {
    stopCardNavigation(event)
    if (item.quantity >= 999) return
    onQuantityChange(item.id, item.quantity + 1)
  }

  function remove(event: MouseEvent) {
    stopCardNavigation(event)
    onRemove(item.id)
  }

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={openProduct}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          openProduct()
        }
      }}
      aria-label={`Открыть на Ozon: ${item.title}`}
      className={cn(
        'group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-stone/10 bg-white',
        'shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone/10',
        'focus-visible:ring-2 focus-visible:ring-terracotta/40 focus-visible:outline-none',
        item.purchased && 'opacity-60',
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-sand">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="size-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-sm text-stone">
            Нет фото
          </div>
        )}
        {item.quantity > 1 && (
          <span className="absolute top-3 right-3 rounded-full bg-charcoal/80 px-3 py-1 text-xs font-medium text-white">
            ×{item.quantity}
          </span>
        )}
        {item.purchased && (
          <span className="absolute top-3 left-3 rounded-full bg-sage px-3 py-1 text-xs font-medium text-white">
            Куплено
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex-1">
          <h3 className="line-clamp-2 text-sm font-semibold text-charcoal sm:text-base">
            {item.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-xs text-stone sm:text-sm">
            {item.description}
          </p>
        </div>

        <div
          className="flex items-center justify-between gap-2"
          onClick={stopCardNavigation}
          onKeyDown={stopCardNavigation}
        >
          <span className="text-xs text-stone">Количество</span>
          <div className="flex items-center gap-1 rounded-xl border border-stone/15 bg-sand/50 p-1">
            <button
              type="button"
              onClick={decrease}
              disabled={item.quantity <= 1}
              className="inline-flex size-8 items-center justify-center rounded-lg text-stone transition hover:bg-white hover:text-charcoal disabled:opacity-40"
              aria-label="Уменьшить количество"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="min-w-6 text-center text-sm font-semibold text-charcoal">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={increase}
              disabled={item.quantity >= 999}
              className="inline-flex size-8 items-center justify-center rounded-lg text-stone transition hover:bg-white hover:text-charcoal disabled:opacity-40"
              aria-label="Увеличить количество"
            >
              <Plus className="size-3.5" />
            </button>
          </div>
        </div>

        <div
          className="flex items-center justify-between gap-2 border-t border-stone/10 pt-3"
          onClick={stopCardNavigation}
          onKeyDown={stopCardNavigation}
        >
          <div>
            <span className="text-lg font-bold text-terracotta">
              {formatPrice(lineTotal)}
            </span>
            {item.quantity > 1 && (
              <p className="text-xs text-stone">
                {formatPrice(item.price)} × {item.quantity}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={remove}
            className="inline-flex size-9 items-center justify-center rounded-xl text-stone transition hover:bg-red-50 hover:text-red-600"
            aria-label="Удалить"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    </article>
  )
}
