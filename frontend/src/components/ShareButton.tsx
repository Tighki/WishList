import { Check, Eye, Link2, Pencil } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { getShareUrl } from '@/lib/edit-token'
import { cn, copyToClipboard } from '@/lib/utils'

interface ShareButtonProps {
  slug: string
  editToken?: string | null
}

type ShareMode = 'view' | 'edit'
type CopiedMode = ShareMode | null

const COPY_MESSAGES: Record<ShareMode, string> = {
  view: 'Ссылка для просмотра скопирована',
  edit: 'Ссылка для редактирования скопирована',
}

export function ShareButton({ slug, editToken }: ShareButtonProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState<CopiedMode>(null)
  const [copyError, setCopyError] = useState(false)
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

  useEffect(() => {
    if (!copied && !copyError) return

    const timer = window.setTimeout(() => {
      setCopied(null)
      setCopyError(false)
    }, 2500)

    return () => window.clearTimeout(timer)
  }, [copied, copyError])

  async function handleCopy(mode: ShareMode) {
    const url =
      mode === 'edit' && editToken
        ? getShareUrl(slug, 'edit', editToken)
        : getShareUrl(slug, 'view')

    const success = await copyToClipboard(url)
    setOpen(false)

    if (success) {
      setCopyError(false)
      setCopied(mode)
      return
    }

    setCopied(null)
    setCopyError(true)
  }

  return (
    <>
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className={cn(
            'inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition',
            'border-stone/15 bg-white text-charcoal hover:border-terracotta/30 hover:bg-terracotta/5',
          )}
        >
          <Link2 className="size-4" />
          Поделиться
        </button>

        {open && (
          <div
            className={cn(
              'absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-stone/10',
              'bg-white p-2 shadow-lg shadow-charcoal/10',
            )}
          >
            <button
              type="button"
              onClick={() => void handleCopy('view')}
              className="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-sand/50"
            >
              <Eye className="mt-0.5 size-4 shrink-0 text-stone" />
              <span>
                <span className="block text-sm font-medium text-charcoal">Только просмотр</span>
                <span className="mt-0.5 block text-xs text-stone">
                  Получатель увидит список, но не сможет его менять
                </span>
              </span>
            </button>

            <button
              type="button"
              disabled={!editToken}
              onClick={() => void handleCopy('edit')}
              className={cn(
                'flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition',
                editToken ? 'hover:bg-sand/50' : 'cursor-not-allowed opacity-50',
              )}
            >
              <Pencil className="mt-0.5 size-4 shrink-0 text-stone" />
              <span>
                <span className="block text-sm font-medium text-charcoal">Можно редактировать</span>
                <span className="mt-0.5 block text-xs text-stone">
                  Получатель сможет добавлять и удалять товары
                </span>
              </span>
            </button>
          </div>
        )}
      </div>

      {copied && (
        <div
          role="status"
          className={cn(
            'fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-2',
            'rounded-2xl border border-sage/30 bg-charcoal px-4 py-3 text-sm font-medium text-white',
            'shadow-lg shadow-charcoal/20',
          )}
        >
          <Check className="size-4 text-sage" />
          {COPY_MESSAGES[copied]}
        </div>
      )}

      {copyError && (
        <div
          role="alert"
          className={cn(
            'fixed bottom-6 left-1/2 z-[100] -translate-x-1/2',
            'rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700',
            'shadow-lg shadow-charcoal/10',
          )}
        >
          Не удалось скопировать ссылку
        </div>
      )}
    </>
  )
}
