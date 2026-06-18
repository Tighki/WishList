import { PackageOpen } from 'lucide-react'

interface EmptyStateProps {
  readOnly?: boolean
}

export function EmptyState({ readOnly = false }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-stone/25 bg-white/60 px-6 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-sand text-stone">
        <PackageOpen className="size-8" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-charcoal">
        Список пока пуст
      </h3>
      <p className="mt-2 max-w-sm text-sm text-stone">
        {readOnly
          ? 'Владелец ещё не добавил товары в этот вишлист'
          : 'Добавьте первый товар вручную — карточка появится здесь'}
      </p>
    </div>
  )
}
