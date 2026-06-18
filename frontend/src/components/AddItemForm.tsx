import { Loader2, Plus } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { cn } from '@/lib/utils'
import type { CreateItemPayload } from '@/types/wishlist'

interface AddItemFormProps {
  onAdd: (payload: CreateItemPayload) => void
  isLoading?: boolean
}

const emptyForm = {
  title: '',
  description: '',
  price: '',
  imageUrl: '',
  url: '',
  quantity: 1,
}

export function AddItemForm({ onAdd, isLoading = false }: AddItemFormProps) {
  const [form, setForm] = useState(emptyForm)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const title = form.title.trim()
    const price = Number.parseFloat(form.price.replace(',', '.'))
    if (!title || Number.isNaN(price)) return

    onAdd({
      title,
      description: form.description.trim() || undefined,
      price,
      imageUrl: form.imageUrl.trim() || undefined,
      url: form.url.trim() || undefined,
      quantity: form.quantity,
    })
    setForm(emptyForm)
  }

  return (
    <section className="mx-auto max-w-3xl px-4 pt-10 sm:px-6 sm:pt-14">
      <div className="text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-charcoal sm:text-3xl">
          Добавить товар
        </h2>
        <p className="mt-2 text-sm text-stone sm:text-base">
          Заполните карточку вручную — название, цену и по желанию ссылку и фото
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-3xl border border-stone/10 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal">Название *</label>
          <input
            type="text"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Например, смеситель для кухни"
            className={cn(
              'w-full rounded-2xl border border-stone/20 bg-white px-4 py-3',
              'text-sm text-charcoal placeholder:text-stone/60',
              'focus:border-terracotta/40 focus:ring-2 focus:ring-terracotta/20 focus:outline-none',
            )}
            disabled={isLoading}
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-charcoal">Цена, ₽ *</label>
            <input
              type="text"
              inputMode="decimal"
              value={form.price}
              onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
              placeholder="12 990"
              className={cn(
                'w-full rounded-2xl border border-stone/20 bg-white px-4 py-3',
                'text-sm text-charcoal placeholder:text-stone/60',
                'focus:border-terracotta/40 focus:ring-2 focus:ring-terracotta/20 focus:outline-none',
              )}
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-charcoal">Количество</label>
            <input
              type="number"
              min={1}
              max={999}
              value={form.quantity}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  quantity: Math.max(1, Number.parseInt(event.target.value, 10) || 1),
                }))
              }
              className={cn(
                'w-full rounded-2xl border border-stone/20 bg-white px-4 py-3',
                'text-sm text-charcoal',
                'focus:border-terracotta/40 focus:ring-2 focus:ring-terracotta/20 focus:outline-none',
              )}
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal">Описание</label>
          <textarea
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            placeholder="Цвет, размер, магазин..."
            rows={2}
            className={cn(
              'w-full resize-none rounded-2xl border border-stone/20 bg-white px-4 py-3',
              'text-sm text-charcoal placeholder:text-stone/60',
              'focus:border-terracotta/40 focus:ring-2 focus:ring-terracotta/20 focus:outline-none',
            )}
            disabled={isLoading}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-charcoal">Ссылка на товар</label>
            <input
              type="url"
              value={form.url}
              onChange={(event) => setForm((prev) => ({ ...prev, url: event.target.value }))}
              placeholder="https://..."
              className={cn(
                'w-full rounded-2xl border border-stone/20 bg-white px-4 py-3',
                'text-sm text-charcoal placeholder:text-stone/60',
                'focus:border-terracotta/40 focus:ring-2 focus:ring-terracotta/20 focus:outline-none',
              )}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-charcoal">Ссылка на фото</label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
              placeholder="https://..."
              className={cn(
                'w-full rounded-2xl border border-stone/20 bg-white px-4 py-3',
                'text-sm text-charcoal placeholder:text-stone/60',
                'focus:border-terracotta/40 focus:ring-2 focus:ring-terracotta/20 focus:outline-none',
              )}
              disabled={isLoading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !form.title.trim() || !form.price.trim()}
          className={cn(
            'inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5',
            'bg-terracotta text-sm font-medium text-white shadow-md shadow-terracotta/25',
            'transition hover:bg-terracotta-dark disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          Добавить в список
        </button>
      </form>
    </section>
  )
}
