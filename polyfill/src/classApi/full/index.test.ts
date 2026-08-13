import { describe, expect, it } from 'vitest'
import { NativeTemporal } from '../../nativeSwitch'
import { Temporal as FullTemporalImpl } from './implementation'
import { Intl as IntlFull, Temporal as FullTemporal } from './index'

// The README documents /full as "uses native if available" and /full/implementation
// as "forced non-native". Nothing asserted either claim, so the two entries were able
// to collapse into the same object without a lane going red.
const hasNativeTemporal = Boolean(NativeTemporal)

describe('full entrypoint native precedence', () => {
  it.runIf(hasNativeTemporal)('defers to native Temporal', () => {
    expect(FullTemporal).toBe(NativeTemporal)
  })

  it.runIf(hasNativeTemporal)('uses the host Intl alongside it', () => {
    expect(IntlFull).toBe(globalThis.Intl)
  })

  it.runIf(hasNativeTemporal)(
    'leaves /full/implementation forced non-native',
    () => {
      expect(FullTemporalImpl).not.toBe(NativeTemporal)
    },
  )

  it.runIf(!hasNativeTemporal)(
    'falls back to the bundled implementation',
    () => {
      expect(FullTemporal).toBe(FullTemporalImpl)
    },
  )

  // Whichever side won the selection, the expanded calendar set is why /full exists.
  it('builds an expanded calendar either way', () => {
    const date = FullTemporal.PlainDate.from('2026-08-09')
    expect(date.withCalendar('hebrew').calendarId).toBe('hebrew')
  })
})
