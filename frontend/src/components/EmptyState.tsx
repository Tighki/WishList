import { PackageOpen } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-stone/25 bg-white/60 px-6 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-sand text-stone">
        <PackageOpen className="size-8" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-charcoal">
        Список пока пуст
      </h3>
      <p className="mt-2 max-w-sm text-sm text-stone">
        Добавьте первый товар по ссылке с Ozon — карточка появится здесь с фото и
        ценой
      </p>
    </div>
  )
}
