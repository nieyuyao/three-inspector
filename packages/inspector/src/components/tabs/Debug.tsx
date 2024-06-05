import React, { useCallback, useContext, useRef, useState } from 'react'
import { GlobalContext, globalContext } from '../../contexts/global-context'
import { InfiniteGrid } from '../../helpers/InfiniteGrid'
import { SwitchComponent } from '../base/switch/Switch'
import { CollapseComponent } from '../base/collapse/Collapse'
import {
  debugContext,
  debugContextValue,
  debugContextUtils,
  DebugContext,
  DebugContextUtils,
  defaultDebugContextUtils,
} from '../../contexts/debug-context'
import { RendererComponent } from '../debug/RendererComponent'

export const Debug = () => {
  const { scene } = useContext<GlobalContext>(globalContext)
  const [debugState, setDebugState] = useState<DebugContext>(debugContextValue)

  const debugUtils = useRef<DebugContextUtils>({
    ...defaultDebugContextUtils,
    updateHelpers: (key: keyof DebugContext['helpers'], val: boolean) => {
      const helpers = debugState.helpers
      helpers[key] = val
      setDebugState((prevState) => {
        return {
          ...prevState,
          helpers,
        }
      })
    },
  })

  const toggleGridVisible = useCallback(
    (visible: boolean) => {
      if (!scene) {
        return
      }
      debugUtils.current.updateHelpers('grid', visible)
      visible
        ? scene.add(new InfiniteGrid(0x888888))
        : scene.getObjectByName('InspectorInfiniteGrid')?.removeFromParent()
    },
    [scene]
  )

  return (
    <debugContext.Provider value={debugState}>
      <debugContextUtils.Provider value={debugUtils.current}>
        <CollapseComponent label="Helpers" defaultOpened>
          <SwitchComponent
            checked={debugState.helpers.grid}
            name="Grid"
            onChange={toggleGridVisible}
          />
        </CollapseComponent>
        <RendererComponent />
      </debugContextUtils.Provider>
    </debugContext.Provider>
  )
}
