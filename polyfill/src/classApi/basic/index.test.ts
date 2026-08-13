import { describe, expect, it } from 'vitest'
import { NativeTemporal } from '../../nativeSwitch'
import { Temporal as TemporalBasicImpl } from './implementation'
import { Intl as IntlBasic, Temporal as TemporalBasic } from './index'

// basic/index.ts already selects. Its /full twin did not, and the omission survived
// because neither entry had a test asserting the selection. Cover both, so the two
// families stay symmetric.
const hasNativeTemporal = Boolean(NativeTemporal)

describe('basic entrypoint native precedence', () => {
  it.runIf(hasNativeTemporal)('defers to native Temporal', () => {
    expect(TemporalBasic).toBe(NativeTemporal)
  })

  it.runIf(hasNativeTemporal)('uses the host Intl alongside it', () => {
    expect(IntlBasic).toBe(globalThis.Intl)
  })

  it.runIf(hasNativeTemporal)(
    'leaves /implementation forced non-native',
    () => {
      expect(TemporalBasicImpl).not.toBe(NativeTemporal)
    },
  )

  it.runIf(!hasNativeTemporal)(
    'falls back to the bundled implementation',
    () => {
      expect(TemporalBasic).toBe(TemporalBasicImpl)
    },
  )
})
