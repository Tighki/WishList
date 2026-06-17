import { Link2, Loader2, Plus } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { cn } from '@/lib/utils'

interface AddItemFormProps {
  onAdd: (url: string, quantity: number) => void
  isLoading?: boolean
}

export function AddItemForm({ onAdd, isLoading = false }: AddItemFormProps) {
  const [url, setUrl] = useState('')
  const [quantity, setQuantity] = useState(1)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = url.trim()
    if (!trimmed) return
    onAdd(trimmed, quantity)
    setUrl('')
    setQuantity(1)
  }

  return (
    <section className="mx-auto max-w-3xl px-4 pt-10 sm:px-6 sm:pt-14">
      <div className="text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-charcoal sm:text-3xl">
          Собираем список для ремонта
        </h2>
        <p className="mt-2 text-sm text-stone sm:text-base">
          Вставьте ссылку с Ozon — подтянем фото, описание и цену
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Link2 className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-stone" />
            <input
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://www.ozon.ru/product/..."
              className={cn(
                'w-full rounded-2xl border border-stone/20 bg-white py-3.5 pr-4 pl-11',
                'text-sm text-charcoal placeholder:text-stone/60',
                'shadow-sm transition focus:border-terracotta/40 focus:ring-2 focus:ring-terracotta/20 focus:outline-none',
              )}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-stone">
              <span className="whitespace-nowrap">Кол-во</span>
              <input
                type="number"
                min={1}
                max={999}
                value={quantity}
                onChange={(event) =>
                  setQuantity(Math.max(1, Number.parseInt(event.target.value, 10) || 1))
                }
                className={cn(
                  'w-16 rounded-xl border border-stone/20 bg-white px-3 py-3.5 text-center',
                  'text-sm font-medium text-charcoal',
                  'focus:border-terracotta/40 focus:ring-2 focus:ring-terracotta/20 focus:outline-none',
                )}
                disabled={isLoading}
              />
            </label>

            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className={cn(
                'inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5',
                'bg-terracotta text-sm font-medium text-white shadow-md shadow-terracotta/25',
                'transition hover:bg-terracotta-dark disabled:cursor-not-allowed disabled:opacity-50',
              )}
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Plus className="size-4" />
              )}
              Добавить
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}
