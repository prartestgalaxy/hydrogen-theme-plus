export function setRecentlyViewed(productId) {
  // SSR Safety: Only run in the browser
  if (typeof window === 'undefined' || !productId) return;
  
  const storageKey = 'recently-viewed';
  const viewed = JSON.parse(localStorage.getItem(storageKey) || '[]');
  
  // Remove if already exists (to move it to the front of the list)
  const filtered = viewed.filter(id => id !== productId);
  
  // Add to the beginning and limit to 12 items
  const updated = [productId, ...filtered].slice(0, 12);
  
  localStorage.setItem(storageKey, JSON.stringify(updated));
}

export function getRecentlyViewed() {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('recently-viewed') || '[]');
}