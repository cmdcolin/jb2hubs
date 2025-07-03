/**
 * Hasher function type for deduplication.
 * Takes an input of type T and returns a string representation.
 */
type Hasher<T> = (input: T) => string

/**
 * Deduplicates an array of items based on a hasher function.
 * If no hasher is provided, JSON.stringify is used by default.
 * @param list The array to deduplicate.
 * @param hasher A function that returns a unique string for each item.
 * @returns A new array with duplicate items removed.
 */
export function dedupe<T>(list: T[], hasher: Hasher<T> = JSON.stringify): T[] {
  const uniqueItems: T[] = []
  const seenHashes = new Set<string>()

  for (const item of list) {
    const hashed = hasher(item)

    if (!seenHashes.has(hashed)) {
      uniqueItems.push(item)
      seenHashes.add(hashed)
    }
  }

  return uniqueItems
}
