import React, { useCallback } from 'react'
import type { MeshNormalMaterial } from 'three'
import { CommonMaterialProperty } from './CommonMaterialProperty'
import { MapProperty } from './MapProperty'
import { NumericSlider } from '../../base/numberic-slider/NumericSlider'

interface Props {
	material: MeshNormalMaterial
}

export const NormalMaterialProperty = (props: Props) => {
	const { material } = props
	const updateMaterial = useCallback(
		(val: any, key: string) => {
			material.needsUpdate = true
			// @ts-ignore
			material[key] = val
		},
		[material]
	)
	return <>
		<NumericSlider
				name="DisplacementScale"
				value={material.displacementScale}
				step={0.01}
				onChange={(val) => updateMaterial(val, 'displacementScale')}
			/>
		<CommonMaterialProperty material={material} />
		<MapProperty material={material} prop="bumpMap" />
		<MapProperty material={material} prop="displacementMap" />
		<MapProperty material={material} prop="normalMap" />
	</>
}
