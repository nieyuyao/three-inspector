import React, { useCallback } from 'react'
import type { MeshPhongMaterial } from 'three'
import { CommonMaterialProperty } from './CommonMaterialProperty'
import { MapProperty } from './MapProperty'
import { NumericSlider } from '../../base/NumericSlider'
import {} from '../../base/NumericInputComponent'
import { NumericInputComponent } from '../../base/NumericInputComponent'

interface Props {
  material: MeshPhongMaterial
}

export const PhongMaterialProperty = (props: Props) => {
  const { material } = props
  const updateMaterial = useCallback(
    (val: any, key: string) => {
      material.needsUpdate = true
      // @ts-ignore
      material[key] = val
    },
    [material]
  )
  return (
    <>
      <CommonMaterialProperty material={material} />
      <NumericInputComponent defaultValue={material.shininess} name="shininess" />
      <MapProperty material={material} prop="bumpMap" />
      <NumericInputComponent
        min={0}
        max={1000}
        name="bumpScale"
        defaultValue={material.bumpScale}
        onChange={(val) => updateMaterial(val, 'bumpScale')}
      />
      <MapProperty material={material} prop="displacementMap" />
      <NumericInputComponent
        min={0}
        max={1000}
        name="displacementScale"
        defaultValue={material.displacementScale}
        onChange={(val) => updateMaterial(val, 'displacementScale')}
      />
      <NumericInputComponent
        min={0}
        max={1000}
        name="displacementBias"
        defaultValue={material.displacementBias}
        onChange={(val) => updateMaterial(val, 'displacementBias')}
      />
      <MapProperty material={material} prop="normalMap" />
      <MapProperty material={material} prop="emissiveMap" />
    </>
  )
}
