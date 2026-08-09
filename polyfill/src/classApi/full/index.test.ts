import { describe, expect, it } from 'vitest'
import { NativeTemporal } from '../../nativeSwitch'
import { Temporal as TemporalFullImpl } from './implementation'
import { Intl as IntlFull, Temporal as TemporalFull } from './index'

// The README documents /full as "uses native if available" and /full/implementation
// as "forced non-native". Nothing asserted either claim, so the two entries were able
// to collapse into the same object without a lane going red.
const hasNativeTemporal = Boolean(NativeTemporal)

describe('full entrypoint native precedence', () => {
  it.runIf(hasNativeTemporal)('defers to native Temporal', () => {
    expect(TemporalFull).toBe(NativeTemporal)
  })

  it.runIf(hasNativeTemporal)('uses the host Intl alongside it', () => {
    expect(IntlFull).toBe(globalThis.Intl)
  })

  it.runIf(hasNativeTemporal)(
    'leaves /full/implementation forced non-native',
    () => {
      expect(TemporalFullImpl).not.toBe(NativeTemporal)
    },
  )

  it.runIf(!hasNativeTemporal)(
    'falls back to the bundled implementation',
    () => {
      expect(TemporalFull).toBe(TemporalFullImpl)
    },
  )

  // Whichever side won the selection, the expanded calendar set is why /full exists.
  it('builds an expanded calendar either way', () => {
    const date = TemporalFull.PlainDate.from('2026-08-09')
    expect(date.withCalendar('hebrew').calendarId).toBe('hebrew')
  })
})
