import { Check, Eye, Link2, Pencil } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { getShareUrl } from '@/lib/edit-token'
import { cn } from '@/lib/utils'

interface ShareButtonProps {
  slug: string
  editToken?: string | null
}

type ShareMode = 'view' | 'edit'
type CopiedMode = ShareMode | null

export function ShareButton({ slug, editToken }: ShareButtonProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState<CopiedMode>(null)
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

  async function handleCopy(mode: ShareMode) {
    const url =
      mode === 'edit' && editToken
        ? getShareUrl(slug, 'edit', editToken)
        : getShareUrl(slug, 'view')

    try {
      await navigator.clipboard.writeText(url)
      setCopied(mode)
      window.setTimeout(() => setCopied(null), 2000)
      setOpen(false)
    } catch {
      window.prompt('Скопируйте ссылку:', url)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition',
          copied
            ? 'border-sage/30 bg-sage/10 text-sage'
            : 'border-stone/15 bg-white text-charcoal hover:border-terracotta/30 hover:bg-terracotta/5',
        )}
      >
        {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
        {copied === 'view'
          ? 'Ссылка для просмотра скопирована'
          : copied === 'edit'
            ? 'Ссылка для редактирования скопирована'
            : 'Поделиться'}
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
  )
}
