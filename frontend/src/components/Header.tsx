import { Home, Sparkles } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface HeaderProps {
  total: number
  itemCount: number
}

export function Header({ total, itemCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-stone/10 bg-cream/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-terracotta/10 text-terracotta">
            <Home className="size-5" />
          </div>
          <div className="text-left">
            <h1 className="text-lg font-semibold tracking-tight text-charcoal sm:text-xl">
              WishList
            </h1>
            <p className="text-xs text-stone sm:text-sm">Вишлист для ремонта</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-xs text-stone">{itemCount} товаров</p>
            <p className="text-sm font-medium text-charcoal">Итого к покупке</p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-charcoal px-4 py-2.5 text-white shadow-lg shadow-charcoal/10">
            <Sparkles className="size-4 text-terracotta" />
            <span className="text-base font-semibold sm:text-lg">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
