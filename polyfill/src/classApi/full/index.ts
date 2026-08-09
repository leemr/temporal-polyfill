import { NativeTemporal } from '../../nativeSwitch'
import * as Impl from './implementation'

// Mirrors basic/index.ts. The expanded calendar set is a reason to ship a bigger
// implementation, not a reason to shadow a host that already has Temporal --
// full/shim.ts already defers, so /full/global does too.
export const Temporal = NativeTemporal || Impl.Temporal

const IntlExport = NativeTemporal ? Intl : Impl.Intl
export { IntlExport as Intl }

export const toTemporalInstant = NativeTemporal
  ? (Date.prototype as any).toTemporalInstant
  : Impl.toTemporalInstant
