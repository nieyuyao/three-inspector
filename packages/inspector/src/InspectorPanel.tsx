import React, { useEffect, useRef, useState } from 'react'
import {
  GlobalContext,
  GlobalUtilsContext,
  globalUtilsContext,
  globalContext,
} from './contexts/global-context'
import { type Scene, type Camera, type WebGLRenderer, type PerspectiveCamera, Mesh } from 'three'
import { Nullable } from './types'
import { IconClose } from '@arco-design/web-react/icon'
import IconPopup from './assets/icons/popup.svg?react'
import { SceneExplore } from './components/scene-explore/SceneExplore'
import { ActionTabs } from './components/tabs/ActionTabs'
import { INSPECTOR_PANEL_CLASS_NAME } from './utils/constants'
import { Outline } from './helpers/Outline'
import './inspector-panel.scss'

export interface InspectorPanelProps {
  scene: Scene
  camera: Camera
  renderer: WebGLRenderer
  targetObject: Nullable<THREE.Object3D>
  onClose: () => void
  onPopup: () => void
  container: Node
  popupMode?: boolean
  measureDom?: Nullable<HTMLElement>
  highlightSelected?: boolean
}

export const InspectorPanel = (props: InspectorPanelProps) => {
  const [globalState, setGlobalState] = useState<GlobalContext>({
    targetObject: props.targetObject,
    scene: props.scene,
    camera: props.camera,
    renderer: props.renderer,
    canvas: props.renderer.domElement,
    measureDom: props.measureDom ?? null,
  })

  const globalUtils = useRef<GlobalUtilsContext>({
    updateTargetObject: (obj: THREE.Object3D) => {
      setGlobalState((pevState) => {
        return {
          ...pevState,
          targetObject: obj,
        }
      })
    },
  })

  const closePanel = () => props.onClose()

  const openPopup = () => props.onPopup()

  useEffect(() => {
    let outline: Outline
    const hook = (renderer: WebGLRenderer, _: Scene, camera: Camera) => {
      outline?.render(renderer, camera as PerspectiveCamera)
    }
    if (props.highlightSelected && globalState.targetObject instanceof Mesh && props.scene) {
      outline = new Outline(globalState.targetObject)
      // @ts-ignore
      props.scene.registerAfterRenderHook(hook)
    }

    return () => {
      outline?.dispose()
      // @ts-ignore
      props.scene.unregisterAfterRenderHook(hook)
    }

  }, [props.scene, props.highlightSelected, globalState.targetObject])

  return (
    <globalUtilsContext.Provider value={globalUtils.current}>
      <globalContext.Provider value={globalState}>
          <div
            className={
              props.popupMode
                ? `${INSPECTOR_PANEL_CLASS_NAME} popup`
                : `${INSPECTOR_PANEL_CLASS_NAME}`
            }
          >
            <div className="resize" />
            <div className="resize-horizontal-line" />
            <div className="panel-content">
              <div className="header">
                <div className="title">INSPECTOR</div>
                <div className="actions">
                  <IconPopup className="action popup" color="#fff" onClick={openPopup} />
                  <IconClose className="action close" onClick={closePanel} />
                </div>
              </div>
              <div className="content">
                <SceneExplore />
                <ActionTabs />
              </div>
            </div>
          </div>
      </globalContext.Provider>
    </globalUtilsContext.Provider>
  )
}
