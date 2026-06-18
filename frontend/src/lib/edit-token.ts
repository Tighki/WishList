const STORAGE_PREFIX = 'wishlist-edit-token:'

export function saveEditToken(slug: string, token: string): void {
  localStorage.setItem(`${STORAGE_PREFIX}${slug}`, token)
}

export function getEditToken(slug: string): string | null {
  return localStorage.getItem(`${STORAGE_PREFIX}${slug}`)
}

export function getShareUrl(slug: string): string {
  return `${window.location.origin}/w/${slug}`
}
