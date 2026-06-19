import { Loader2, UserPlus, Users, X } from 'lucide-react'
import { type FormEvent, useEffect, useRef, useState } from 'react'
import { ApiError, wishlistApi } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { WishlistMember } from '@/types/wishlist'

interface InviteMembersButtonProps {
  slug: string
  members: WishlistMember[]
  onMembersChange: (members: WishlistMember[]) => void
}

export function InviteMembersButton({
  slug,
  members,
  onMembersChange,
}: InviteMembersButtonProps) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [isInviting, setIsInviting] = useState(false)
  const [removingUserId, setRemovingUserId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [open])

  async function handleInvite(event: FormEvent) {
    event.preventDefault()
    if (!email.trim()) return

    setIsInviting(true)
    setError(null)
    try {
      const member = await wishlistApi.inviteMember(slug, email.trim())
      onMembersChange([...members, member])
      setEmail('')
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Не удалось пригласить'
      setError(message)
    } finally {
      setIsInviting(false)
    }
  }

  async function handleRemove(userId: string) {
    setRemovingUserId(userId)
    setError(null)
    try {
      await wishlistApi.removeMember(slug, userId)
      onMembersChange(members.filter((member) => member.userId !== userId))
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Не удалось удалить участника'
      setError(message)
    } finally {
      setRemovingUserId(null)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition',
          'border-stone/15 bg-white text-charcoal hover:border-terracotta/30 hover:bg-terracotta/5',
        )}
      >
        <Users className="size-4" />
        Участники
        {members.length > 0 && (
          <span className="rounded-full bg-terracotta/10 px-2 py-0.5 text-xs text-terracotta">
            {members.length}
          </span>
        )}
      </button>

      {open && (
        <div
          className={cn(
            'absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-stone/10',
            'bg-white p-4 shadow-lg shadow-charcoal/10',
          )}
        >
          <h3 className="text-sm font-semibold text-charcoal">Пригласить в вишлист</h3>
          <p className="mt-1 text-xs text-stone">
            Пользователь должен быть зарегистрирован. Ему появится вишлист в «Мои вишлисты».
          </p>

          <form onSubmit={(event) => void handleInvite(event)} className="mt-4 flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="email@example.com"
              className={cn(
                'min-w-0 flex-1 rounded-xl border border-stone/20 px-3 py-2.5 text-sm',
                'focus:border-terracotta/40 focus:ring-2 focus:ring-terracotta/20 focus:outline-none',
              )}
              disabled={isInviting}
            />
            <button
              type="submit"
              disabled={isInviting || !email.trim()}
              className={cn(
                'inline-flex items-center justify-center rounded-xl bg-terracotta px-3 py-2.5',
                'text-white transition hover:bg-terracotta-dark disabled:opacity-50',
              )}
              aria-label="Пригласить"
            >
              {isInviting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <UserPlus className="size-4" />
              )}
            </button>
          </form>

          {error && (
            <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </p>
          )}

          {members.length > 0 && (
            <div className="mt-4 border-t border-stone/10 pt-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-stone">
                Участники
              </p>
              <ul className="space-y-2">
                {members.map((member) => (
                  <li
                    key={member.id}
                    className="flex items-center justify-between gap-2 rounded-xl bg-sand/40 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-charcoal">{member.name}</p>
                      <p className="truncate text-xs text-stone">{member.email}</p>
                    </div>
                    <button
                      type="button"
                      disabled={removingUserId === member.userId}
                      onClick={() => void handleRemove(member.userId)}
                      className="shrink-0 rounded-lg p-1.5 text-stone transition hover:bg-red-50 hover:text-red-600"
                      aria-label="Удалить участника"
                    >
                      {removingUserId === member.userId ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <X className="size-4" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
