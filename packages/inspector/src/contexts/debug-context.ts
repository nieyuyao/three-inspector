import { createContext } from 'react'
import { deepClone } from '../utils/common'

export interface DebugContext {
  helpers: {
    grid: boolean
  }
}

export const DEFAULT_DEBUG_CONTEXT_VALUE = {
  helpers: {
    grid: false
  },
}

export interface DebugContextUtils {
  updateHelpers(key: string, val: boolean): void
}

export const defaultDebugContextUtils = {
  updateHelpers() {},
}

export const debugContextValue = deepClone(DEFAULT_DEBUG_CONTEXT_VALUE)

export const debugContext = createContext<DebugContext>(debugContextValue)

export const debugContextUtils = createContext<DebugContextUtils>(defaultDebugContextUtils)
