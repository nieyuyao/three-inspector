import React, { useCallback, useContext } from 'react'
import { ButtonComponent } from '../base/ButtonComponent'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { globalContext } from '../../contexts/global-context'

export const GLTFImporterComponent = () => {

  const { targetObject } = useContext(globalContext)
  const exportGltf = useCallback(() => {
    if (targetObject) {
      const loader = new GLTFLoader()
      loader.load
    }
  }, [targetObject])
  return (
    <div style={{ margin: '0 6px' }}>
      <ButtonComponent onClick={exportGltf}>Import GLTF</ButtonComponent>
    </div>
  )
}
