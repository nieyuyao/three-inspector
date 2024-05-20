import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { PerspectiveCamera } from 'three'
import { NavigatorGizmo } from 'threejs-navigator-gizmo'
import { ButtonComponent } from '../base/ButtonComponent'
import { GlobalContext, globalContext } from '../../contexts/global-context'
import { Measure } from '../../helpers/Measure'
import { Nullable } from '../../types'
import { CollapseComponent } from '../base/CollapseComponent'
import { Screenshot } from '../../helpers/ScreenShot'
import { SwitchComponent } from '../base/SwitchComponent'
import { VideoRecorderComponent } from '../tools/VideoRecorderComponent'
import { GLTFExporterComponent } from '../tools/GLTFExporterComponent'
import { GLTFImporterComponent } from '../tools/GLTFImporterComponent'
import { WebPExporterComponent } from '../tools/WebPExporterComponent'
import {
  defaultToolsContext,
  toolsContext,
  ToolsContext,
  ToolsContextUtils,
  defaultToolsContextUtils,
} from '../../contexts/tools-context'
import { deepClone } from '../../utils/common'

export const Tools = () => {
  const { scene, camera, canvas, measureDom, renderer } = useContext<GlobalContext>(globalContext)
  const [_, setMeasureVisible] = useState(false)
  const [__, setGizmoVisible] = useState(false)
  const measureToolRef = useRef<Nullable<Measure>>(null)
  const gizmoRef = useRef<Nullable<NavigatorGizmo>>(null)
  const gizmoAfterSceneRenderHook = useRef(
    () => {
      gizmoRef.current?.update()
    }
  )
  const [toolsState, setToolsState] = useState<ToolsContext>(deepClone(defaultToolsContext))
  const toolsUtils = useRef<ToolsContextUtils>({
    ...defaultToolsContextUtils,
    updateGizmo(key: keyof ToolsContext['navigatorGizmo'], val: any) {
      const gizmo = toolsState.navigatorGizmo
      gizmo[key] = val
      setToolsState((prevState) => {
        return {
          ...prevState,
          gizmo,
        }
      })
    }
  })

  const onMeasureVisibleChanged = useCallback(
    (visible: boolean) => {
      setMeasureVisible(visible)
      if (!scene || !camera || !canvas) {
        return
      }
      if (visible) {
        measureToolRef.current = new Measure(camera, scene, measureDom || canvas)
      } else {
        measureToolRef.current?.dispose()
        measureToolRef.current = null
      }
    },
    [scene, canvas, camera]
  )

  const onNavGizmoVisibleChanged = useCallback(
    (visible: boolean) => {
      setGizmoVisible(visible)
      toolsUtils.current.updateGizmo('visible', visible)
      if (!scene) {
        return
      }
      const enableGizmo = visible && camera && renderer
      if (enableGizmo) {
        const gizmo = new NavigatorGizmo(camera as PerspectiveCamera, renderer, {
          standalone: true,
          clearColor: 0x000000,
          clearAlpha: 0,
        })
        gizmoRef.current = gizmo
        // @ts-ignore
        scene.registerAfterRenderHook(gizmoAfterSceneRenderHook.current)
        // @ts-ignore
        scene.extraObjects.push(gizmo)
      } else {
        // @ts-ignore
        scene.unregisterAfterRenderHook(gizmoAfterSceneRenderHook.current)
        // @ts-ignore
        const gizmoIdx = scene.extraObjects.findIndex(obj => obj === gizmoRef.current)
        if (gizmoIdx > -1) {
          // @ts-ignore
          scene.extraObjects.splice(gizmoIdx, 1)
        }
        gizmoRef.current?.dispose()
        gizmoRef.current = null
      }
    },
    [scene, camera]
  )

  const screenshot = useCallback(() => {
    if (!scene) {
      return
    }
    const hook: AfterRenderHook = (renderer) => {
      renderer.domElement.toBlob((blob: Blob) => {
        if (blob) {
          Screenshot.download(blob, 'Screenshot.png')
        }
      })
      // @ts-ignore
      scene.unregisterAfterRenderHook(hook)
    }
    // @ts-ignore
    scene.registerAfterRenderHook(hook)
  }, [canvas, scene])

  useEffect(() => {
    return () => {
      // @ts-ignore
      scene.unregisterAfterRenderHook(gizmoAfterSceneRenderHook.current)
    }
  }, [])

  return (
    <toolsContext.Provider value={toolsState}>
      <SwitchComponent
        name="Measure"
        onChange={onMeasureVisibleChanged}
        checked={toolsState.measure.visible}
      />
      <SwitchComponent
        name="3D NavigatorGizmo"
        onChange={onNavGizmoVisibleChanged}
        checked={toolsState.navigatorGizmo.visible}
      />
      <CollapseComponent label="Capture" defaultOpened>
        <ButtonComponent onClick={screenshot}>Screenshot</ButtonComponent>
        <VideoRecorderComponent />
      </CollapseComponent>
      <GLTFExporterComponent />
      <GLTFImporterComponent />
      <WebPExporterComponent />
    </toolsContext.Provider>
  )
}
