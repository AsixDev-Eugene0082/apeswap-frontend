import { currencyEquals, Percent, Zap } from '@ape.swap/sdk'
import { ONE_HUNDRED_PERCENT, ZERO_PERCENT } from 'config/constants'

export function isZapBetter(
  zapA: Zap | undefined | null,
  zapB: Zap | undefined | null,
  minimumDelta: Percent = ZERO_PERCENT,
): boolean | undefined {
  if (zapA && !zapB) return false
  if (zapB && !zapA) return true
  if (!zapA || !zapB) return undefined

  if (
    !currencyEquals(zapA.inputAmount.currency, zapB.inputAmount.currency) ||
    !currencyEquals(zapB.outputAmount.currency, zapB.outputAmount.currency)
  ) {
    throw new Error('Zaps are not comparable')
  }
  if (minimumDelta.equalTo(ZERO_PERCENT)) {
    return zapA.executionPrice.lessThan(zapB.executionPrice)
  }
  return zapA.executionPrice.raw.multiply(minimumDelta.add(ONE_HUNDRED_PERCENT)).lessThan(zapB.executionPrice)
}

export default isZapBetter
