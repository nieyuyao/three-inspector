import { createContext } from 'react'
import { deepClone } from '../utils/common'

export interface ToolsContext {
  measure: {
    visible: boolean
  },
  navigatorGizmo: {
    visible: boolean
  }
  gltfExporter: {
    onlyVisible: boolean,
    binary: boolean
  }
  webp: {
    frequency: number
    duration: number
  }
}

export const DEFAULT_TOOLS_CONTEXT_VALUE = {
  measure: {
    visible: false
  },
  navigatorGizmo: {
    visible: false
  },
  gltfExporter: {
    onlyVisible: false,
    binary: false
  },
  webp: {
    frequency: 200,
    duration: 3
  }
}

export const toolsContextValue = deepClone(DEFAULT_TOOLS_CONTEXT_VALUE)

export interface ToolsContextUtils {
  updateMeasure(key: string, val: boolean): void
  updateGizmo(key: string, val: boolean): void
  updateGltfExporter(key: string, val: boolean): void
  updateWebP(key: string, val: boolean): void
}

export const defaultToolsContextUtils = {
  updateMeasure() {},
  updateGizmo() {},
  updateGltfExporter() {},
  updateWebP() {}
}

export const toolsContext = createContext<ToolsContext>(toolsContextValue)

export const toolsContextUtils = createContext<ToolsContextUtils>(defaultToolsContextUtils)
