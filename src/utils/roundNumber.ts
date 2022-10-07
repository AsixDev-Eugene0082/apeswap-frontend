/**
 * Rounds a number to precision amount of signifant numbers
 * @param n the number
 * @param precision how many significant numbers to show
 * @returns @number
 */
export const getFirstNonZeroDigits = (n: number, precision = 3) => {
  return n.toFixed(precision - 1 - Math.floor(Math.log(n) / Math.log(10)))
}
