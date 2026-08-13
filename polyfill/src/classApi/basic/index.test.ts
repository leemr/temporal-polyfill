import { describe, expect, it } from 'vitest'
import { NativeTemporal } from '../../nativeSwitch'
import { Temporal as BasicTemporalImpl } from './implementation'
import { Intl as IntlBasic, Temporal as BasicTemporal } from './index'

// basic/index.ts already selects. Its /full twin did not, and the omission survived
// because neither entry had a test asserting the selection. Cover both, so the two
// families stay symmetric.
const hasNativeTemporal = Boolean(NativeTemporal)

describe('basic entrypoint native precedence', () => {
  it.runIf(hasNativeTemporal)('defers to native Temporal', () => {
    expect(BasicTemporal).toBe(NativeTemporal)
  })

  it.runIf(hasNativeTemporal)('uses the host Intl alongside it', () => {
    expect(IntlBasic).toBe(globalThis.Intl)
  })

  it.runIf(hasNativeTemporal)(
    'leaves /implementation forced non-native',
    () => {
      expect(BasicTemporalImpl).not.toBe(NativeTemporal)
    },
  )

  it.runIf(!hasNativeTemporal)(
    'falls back to the bundled implementation',
    () => {
      expect(BasicTemporal).toBe(BasicTemporalImpl)
    },
  )
})
