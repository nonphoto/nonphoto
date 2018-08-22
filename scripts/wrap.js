/**
 * A variation on mod that accounts for negative numbers.
 * For example `wrap(-2, 10) === 8`.
 * @param {Number} x - The value to wrap.
 * @param {Number} n - The range to wrap to.
 * @returns {Number} - `x` wrapped to `n`.
 */
export default function wrap( x, n ) {
    return (( x % n ) + n ) % n
}
