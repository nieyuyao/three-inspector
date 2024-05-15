import { createContext } from 'react'

export interface DebugContext {
  helpers: {
    grid: boolean
  }
}

export const defaultDebugContext = {
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

export const debugContext = createContext<DebugContext>(defaultDebugContext)

export const debugContextUtils = createContext<DebugContextUtils>(defaultDebugContextUtils)
