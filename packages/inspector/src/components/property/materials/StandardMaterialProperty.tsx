import React, { useCallback } from 'react'
import type { MeshStandardMaterial } from 'three'
import { CommonMaterialProperty } from './CommonMaterialProperty'
import { MapProperty } from './MapProperty'
import { NumericSlider } from '../../base/numberic-slider/NumericSlider'
import { ColorComponent } from '../../base/color/Color'
import { color2RgbaColor, rbgColor2Color } from '../../../utils/color'
import { RgbColor } from 'react-colorful'
import { NumericInputComponent } from '../../base/numberic-input/NumericInput'

interface Props {
	material: MeshStandardMaterial
}

export const StandardMaterialProperty = (props: Props) => {
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
			<CommonMaterialProperty material={props.material} />
			<NumericSlider
				min={0}
				max={1}
				label="Roughness"
				value={material.roughness}
				step={0.01}
				onChange={(val) => updateMaterial(val, 'roughness')}
			/>
			<NumericSlider
				min={0}
				max={1}
				label="Metalness"
				value={material.metalness}
				step={0.01}
				onChange={(val) => updateMaterial(val, 'metalness')}
			/>
			<NumericInputComponent
				min={0}
				prop="BumpScale"
				key="bumpScale"
        onChange={(val) => updateMaterial(val, 'bumpScale')}
			/>
			<ColorComponent
				name="Emissive"
				defaultColor={color2RgbaColor(material.emissive)}
				onChange={(val) => updateMaterial(rbgColor2Color(val as RgbColor), 'color')}
			/>
			<MapProperty material={material} prop="map" />
			<MapProperty material={material} prop="lightMap" />
			<MapProperty material={material} prop="aoMap" />
			<MapProperty material={material} prop="emissiveMap" />
			<MapProperty material={material} prop="normalMap" />
			<MapProperty material={material} prop="bumpMap" />
			<MapProperty material={material} prop="displacementMap" />
		</>
	)
}
