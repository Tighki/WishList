import { Check, Loader2, Pencil, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface WishlistTitleEditorProps {
  title: string
  onSave: (title: string) => Promise<void>
  className?: string
  titleClassName?: string
  hideEditButton?: boolean
  editing?: boolean
  onEditingChange?: (editing: boolean) => void
}

export function WishlistTitleEditor({
  title,
  onSave,
  className,
  titleClassName,
  hideEditButton = false,
  editing: controlledEditing,
  onEditingChange,
}: WishlistTitleEditorProps) {
  const [internalEditing, setInternalEditing] = useState(false)
  const [value, setValue] = useState(title)
  const [isSaving, setIsSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const isControlled = controlledEditing !== undefined
  const isEditing = isControlled ? controlledEditing : internalEditing

  function setEditing(next: boolean) {
    if (isControlled) {
      onEditingChange?.(next)
    } else {
      setInternalEditing(next)
    }
  }

  useEffect(() => {
    setValue(title)
  }, [title])

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  async function handleSave() {
    const nextTitle = value.trim()
    if (!nextTitle || nextTitle === title) {
      setValue(title)
      setEditing(false)
      return
    }

    setIsSaving(true)
    try {
      await onSave(nextTitle)
      setEditing(false)
    } catch {
      setValue(title)
    } finally {
      setIsSaving(false)
    }
  }

  function handleCancel() {
    setValue(title)
    setEditing(false)
  }

  if (isEditing) {
    return (
      <div
        className={cn('flex min-w-0 items-center gap-2', className)}
        onClick={(event) => event.stopPropagation()}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          maxLength={120}
          disabled={isSaving}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              void handleSave()
            }
            if (event.key === 'Escape') {
              event.preventDefault()
              handleCancel()
            }
          }}
          onClick={(event) => event.stopPropagation()}
          className={cn(
            'min-w-0 flex-1 rounded-xl border border-stone/20 bg-white px-3 py-2',
            'text-sm text-charcoal focus:border-terracotta/40 focus:ring-2 focus:ring-terracotta/20 focus:outline-none',
            titleClassName,
          )}
        />
        <button
          type="button"
          disabled={isSaving || !value.trim()}
          onClick={(event) => {
            event.stopPropagation()
            void handleSave()
          }}
          className="rounded-xl bg-terracotta p-2 text-white transition hover:bg-terracotta-dark disabled:opacity-50"
          aria-label="Сохранить"
        >
          {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
        </button>
        <button
          type="button"
          disabled={isSaving}
          onClick={(event) => {
            event.stopPropagation()
            handleCancel()
          }}
          className="rounded-xl p-2 text-stone transition hover:bg-sand/60 hover:text-charcoal"
          aria-label="Отмена"
        >
          <X className="size-4" />
        </button>
      </div>
    )
  }

  return (
    <div className={cn('flex min-w-0 items-center gap-2', className)}>
      <p className={cn('truncate font-medium text-charcoal', titleClassName)}>{title}</p>
      {!hideEditButton && (
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            setEditing(true)
          }}
          className="shrink-0 rounded-lg p-1.5 text-stone transition hover:bg-sand/60 hover:text-terracotta"
          aria-label="Переименовать"
        >
          <Pencil className="size-4" />
        </button>
      )}
    </div>
  )
}
