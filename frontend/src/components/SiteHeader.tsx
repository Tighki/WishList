import { Home, LogIn, LogOut, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const { user, isLoading, logout } = useAuth()

  return (
    <header className="border-b border-stone/10 bg-cream/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-terracotta/10 text-terracotta">
            <Home className="size-5" />
          </div>
          <div>
            <p className="text-lg font-semibold text-charcoal">WishList</p>
            <p className="text-xs text-stone">Вишлист для ремонта</p>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {isLoading ? (
            <div className="h-10 w-24 animate-pulse rounded-2xl bg-sand" />
          ) : user ? (
            <>
              <Link
                to="/me"
                className={cn(
                  'inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium',
                  'bg-white text-charcoal shadow-sm ring-1 ring-stone/10 transition hover:bg-sand/50',
                )}
              >
                <User className="size-4 text-terracotta" />
                <span className="max-w-[140px] truncate">{user.name}</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                className={cn(
                  'inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium',
                  'text-stone transition hover:bg-sand/60 hover:text-charcoal',
                )}
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Выйти</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className={cn(
                'inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium',
                'bg-terracotta text-white shadow-md shadow-terracotta/25 transition hover:bg-terracotta-dark',
              )}
            >
              <LogIn className="size-4" />
              Войти
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
