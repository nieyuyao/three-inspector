import React, { useCallback } from 'react'
import { CheckboxComponent } from '../../base/CheckboxComponent'
import { BackSide, DoubleSide, FrontSide, type Material } from 'three'
import { NumericSlider } from '../../base/NumericSlider'
import { SelectComponent } from '../../base/SelectComponent'
import { SwitchComponent } from '../../base/SwitchComponent'

export const CommonMaterialProperty = <T extends Material>(props: { material: T}) => {
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
			<CheckboxComponent
				name="transparent"
				checked={material.transparent}
				onChange={(val) => updateMaterial(val, 'transparent')}
			/>
			<CheckboxComponent
				name="visible"
				checked={material.visible}
				onChange={(val) => updateMaterial(val, 'visible')}
			/>
			<NumericSlider
				name="opacity"
				value={material.opacity}
				step={0.01}
				onChange={(val) => updateMaterial(val, 'opacity')}
			/>
			<SelectComponent
				name="side"
				defaultValue={material.side as number}
				onChange={(val) => updateMaterial(val, 'side')}
				options={[
					{ value: FrontSide, label: 'THREE.FrontSide' },
					{ value: BackSide, label: 'THREE.BackSide' },
					{ value: DoubleSide, label: 'THREE.DoubleSide' },
				]}
			/>
			<SwitchComponent
				name="depthTest"
				checked={material.depthTest}
				onChange={(val) => updateMaterial(val, 'depthTest')}
			/>
			<SwitchComponent
				name="depthWrite"
				checked={material.depthWrite}
				onChange={(val) => updateMaterial(val, 'depthWrite')}
			/>
			<SwitchComponent
				name="stencilWrite"
				checked={material.stencilWrite}
				onChange={(val) => updateMaterial(val, 'stencilWrite')}
			/>
		</>
	)
}
