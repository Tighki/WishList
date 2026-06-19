const STORAGE_PREFIX = 'wishlist-edit-token:'

export function saveEditToken(slug: string, token: string): void {
  localStorage.setItem(`${STORAGE_PREFIX}${slug}`, token)
}

export function getEditToken(slug: string): string | null {
  return localStorage.getItem(`${STORAGE_PREFIX}${slug}`)
}

export function clearEditToken(slug: string): void {
  localStorage.removeItem(`${STORAGE_PREFIX}${slug}`)
}

export function getShareUrl(slug: string, mode: 'view' | 'edit' = 'view', editToken?: string): string {
  const base = `${window.location.origin}/w/${slug}`
  if (mode === 'edit' && editToken) {
    return `${base}?edit=${encodeURIComponent(editToken)}`
  }
  return base
}
