import { Check, Link2 } from 'lucide-react'
import { useState } from 'react'
import { getShareUrl } from '@/lib/edit-token'
import { cn } from '@/lib/utils'

interface ShareButtonProps {
  slug: string
}

export function ShareButton({ slug }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const url = getShareUrl(slug)
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Скопируйте ссылку:', url)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition',
        copied
          ? 'border-sage/30 bg-sage/10 text-sage'
          : 'border-stone/15 bg-white text-charcoal hover:border-terracotta/30 hover:bg-terracotta/5',
      )}
    >
      {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
      {copied ? 'Ссылка скопирована' : 'Поделиться'}
    </button>
  )
}
