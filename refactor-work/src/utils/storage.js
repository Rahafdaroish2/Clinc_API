// Storage can be unavailable when browser privacy settings block access.
export function readStoredValue(key, fallback) {
  try {
    if (typeof window === 'undefined') return fallback;
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}
