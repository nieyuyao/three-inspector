import React, { useCallback } from 'react'
import { type MeshBasicMaterial } from 'three'
import { CollapseComponent } from '../../base/CollapseComponent'
import { CheckboxComponent } from '../../base/CheckboxComponent'
import { ColorComponent } from '../../base/ColorComponent'
import { RgbColor } from 'react-colorful'
import { color2RgbaColor, rbgColor2Color } from '../../../utils/color'
import { CommonMaterialProperty } from './CommonMaterialProperty'
import { MapProperty } from './MapProperty'

interface Props {
	material: MeshBasicMaterial
}

export const BasicMaterialProperty = (props: Props) => {
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
		<CollapseComponent label="BasicMaterial" key={material.id}>
			<CommonMaterialProperty material={material} />
			<CheckboxComponent
				key="wireframe"
				name="wireframe"
				checked={material.wireframe}
				onChange={(val) => updateMaterial(val, 'wireframe')}
			/>
			<CheckboxComponent name="fog" checked={material.fog} onChange={(val) => updateMaterial(val, 'fog')} />
			<ColorComponent
				name="color"
				defaultColor={color2RgbaColor(material.color)}
				onChange={(val) => updateMaterial(rbgColor2Color(val as RgbColor), 'color')}
			/>
			<MapProperty material={material} prop="map" />
		</CollapseComponent>
	)
}
