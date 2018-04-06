/**
 * Create a range limit function.
 * @param {Number} a
 * @param {Number} b
 * @returns {Function} range limit function
 */
export function range(a, b) {
  let min = Math.min(a, b)
  let max = Math.max(a, b)
  return (x) => Math.max(min, Math.min(max, x))
}