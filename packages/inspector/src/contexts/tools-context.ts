import { createContext } from 'react'

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

export const defaultToolsContext = {
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

export const toolsContext = createContext<ToolsContext>(defaultToolsContext)

export const toolsContextUtils = createContext<ToolsContextUtils>(defaultToolsContextUtils)
