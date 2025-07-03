/**
 * Type guard to filter out null or undefined values from an array.
 * Useful in conjunction with `Array.prototype.filter()`.
 * @param value The value to check.
 * @returns True if the value is not null or undefined, false otherwise.
 * @example
 * const arr = [1, null, 2, undefined, 3];
 * const filteredArr = arr.filter(notEmpty); // filteredArr will be [1, 2, 3]
 */
export function notEmpty<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}
