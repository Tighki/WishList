import { Loader2, LogIn, UserPlus } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SiteHeader } from '@/components/SiteHeader'
import { useAuth } from '@/context/AuthContext'
import { ApiError } from '@/lib/api'
import { cn } from '@/lib/utils'

type AuthMode = 'login' | 'register'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(email, password, name || undefined)
      }
      navigate('/me')
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Не удалось выполнить вход'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-svh bg-cream">
      <SiteHeader />

      <main className="mx-auto flex max-w-md flex-col justify-center px-4 py-16 sm:px-6">
        <div className="rounded-3xl border border-stone/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-sand/60 p-1">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={cn(
                'rounded-xl px-4 py-2.5 text-sm font-medium transition',
                mode === 'login'
                  ? 'bg-white text-charcoal shadow-sm'
                  : 'text-stone hover:text-charcoal',
              )}
            >
              Вход
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={cn(
                'rounded-xl px-4 py-2.5 text-sm font-medium transition',
                mode === 'register'
                  ? 'bg-white text-charcoal shadow-sm'
                  : 'text-stone hover:text-charcoal',
              )}
            >
              Регистрация
            </button>
          </div>

          <h1 className="text-2xl font-semibold text-charcoal">
            {mode === 'login' ? 'С возвращением' : 'Создайте аккаунт'}
          </h1>
          <p className="mt-2 text-sm text-stone">
            {mode === 'login'
              ? 'Войдите, чтобы видеть свои вишлисты'
              : 'Зарегистрируйтесь и сохраняйте все списки в одном месте'}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === 'register' && (
              <div>
                <label className="mb-2 block text-sm font-medium text-charcoal">Имя</label>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Как к вам обращаться"
                  className={cn(
                    'w-full rounded-2xl border border-stone/20 bg-white px-4 py-3.5',
                    'text-sm text-charcoal placeholder:text-stone/60',
                    'focus:border-terracotta/40 focus:ring-2 focus:ring-terracotta/20 focus:outline-none',
                  )}
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-charcoal">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                className={cn(
                  'w-full rounded-2xl border border-stone/20 bg-white px-4 py-3.5',
                  'text-sm text-charcoal placeholder:text-stone/60',
                  'focus:border-terracotta/40 focus:ring-2 focus:ring-terracotta/20 focus:outline-none',
                )}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-charcoal">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={6}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className={cn(
                  'w-full rounded-2xl border border-stone/20 bg-white px-4 py-3.5',
                  'text-sm text-charcoal placeholder:text-stone/60',
                  'focus:border-terracotta/40 focus:ring-2 focus:ring-terracotta/20 focus:outline-none',
                )}
              />
            </div>

            {error && (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                'inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4',
                'bg-terracotta text-sm font-medium text-white shadow-md shadow-terracotta/25',
                'transition hover:bg-terracotta-dark disabled:cursor-not-allowed disabled:opacity-50',
              )}
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : mode === 'login' ? (
                <LogIn className="size-4" />
              ) : (
                <UserPlus className="size-4" />
              )}
              {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone">
            <Link to="/" className="font-medium text-terracotta hover:text-terracotta-dark">
              На главную
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
