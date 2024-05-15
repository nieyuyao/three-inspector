import React, { useCallback, useContext, useRef } from 'react'
import { type Object3D } from 'three'
import { CollapseComponent } from '../base/CollapseComponent'
import { ButtonComponent } from '../base/ButtonComponent'
import { SwitchComponent } from '../base/SwitchComponent'
import { GLTFExporter, GLTFExporterOptions } from 'three/examples/jsm/exporters/GLTFExporter'
import { globalContext } from '../../contexts/global-context'
import { download } from '../../utils/tool'

export const GLTFExporterComponent = () => {
  const options = useRef<GLTFExporterOptions>({})

  const { targetObject } = useContext(globalContext)
  const exportGltf = useCallback(() => {
    if (targetObject) {
      const exporter = new GLTFExporter()
      exporter.register((writer) => {
        // @ts-ignore: Overrides processNode method
        const oldProcessNode = writer.processNode
        // @ts-ignore
        writer.processNode = function (object: Object3D) {
          if (object.name.startsWith('Inspector')) {
            return
          }
          oldProcessNode.bind(this)(object)
        }

        return {

        }
      })
      exporter.parse(targetObject, (gltf) => {
        const blob = new Blob([JSON.stringify(gltf, null, 2)], { type: 'text/plain' })
        download(blob, `${targetObject.name}.gltf`)
      }, (err) => {
        console.log('Failed export gltf, error is ', err)
      }, options.current)
    }
  }, [targetObject])
  return (
    <CollapseComponent label="GLTF Export">
      <SwitchComponent
        name="Only Visible"
        onChange={(val) => {
          options.current.onlyVisible = val
        }}
      />
      <SwitchComponent
        name="Binary"
        onChange={(val) => {
          options.current.binary = val
        }}
      />
      <ButtonComponent onClick={exportGltf}>Export to GLTF</ButtonComponent>
    </CollapseComponent>
  )
}
