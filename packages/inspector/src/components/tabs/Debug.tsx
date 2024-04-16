import React, { useCallback, useContext, useEffect, useState } from 'react'
import { GlobalContext, globalContext } from '../../global-context'
import {
	LinearEncoding,
	sRGBEncoding,
	SRGBColorSpace,
	NoColorSpace,
	LinearSRGBColorSpace,
	DisplayP3ColorSpace,
	LinearDisplayP3ColorSpace,
	NoToneMapping,
	LinearToneMapping,
	ReinhardToneMapping,
	CineonToneMapping,
	ACESFilmicToneMapping,
	CustomToneMapping,
	AgXToneMapping
} from 'three'
import { InfiniteGrid } from '../../helpers/InfiniteGrid'
import { SwitchComponent } from '../base/SwitchComponent'
import { CollapseComponent } from '../base/CollapseComponent'
import { SelectComponent } from '../base/SelectComponent'

export const Debug = () => {
	const { scene } = useContext<GlobalContext>(globalContext)
	const [gridVisible, setGridVisible] = useState(false)

	const toggleGridVisible = useCallback(
		(visible: boolean) => {
			if (!scene) {
				return
			}
			setGridVisible(visible)
			if (visible) {
				scene.add(new InfiniteGrid(0x888888))
			} else {
				scene.getObjectByName('InspectorInfiniteGrid')?.removeFromParent()
			}
		},
		[scene]
	)

	useEffect(() => {
		setGridVisible(!!scene?.getObjectByName('InspectorInfiniteGrid'))
	}, [scene])

	return (
		<>
			<CollapseComponent label="Helpers" defaultOpened>
				<SwitchComponent checked={gridVisible} name="Grid" onChange={toggleGridVisible} />
			</CollapseComponent>
			<CollapseComponent label="Renderer" defaultOpened>
				<SelectComponent
					name="TextureEncoding"
					options={[
						{ value: LinearEncoding, label: 'LinearEncoding' },
						{ value: sRGBEncoding, label: 'sRGBEncoding' },
					]}
				></SelectComponent>
				<SelectComponent
					name="ColorSpace"
					options={[
						{ value: SRGBColorSpace, label: 'SRGBColorSpace' },
						{ value: NoColorSpace, label: 'NoColorSpace' },
						{ value: LinearSRGBColorSpace, label: 'LinearSRGBColorSpace' },
						{ value: DisplayP3ColorSpace, label: 'DisplayP3ColorSpace' },
						{ value: LinearDisplayP3ColorSpace, label: 'LinearDisplayP3ColorSpace' }
					]}
				></SelectComponent>
				<SelectComponent
					name="ToneMapping"
					options={[
						{ value: NoToneMapping, label: 'NoToneMapping' },
						{ value: ReinhardToneMapping, label: 'ReinhardToneMapping' },
						{ value: LinearToneMapping, label: 'LinearToneMapping' },
						{ value: CineonToneMapping, label: 'CineonToneMapping' },
						{ value: ACESFilmicToneMapping, label: 'ACESFilmicToneMapping' },
						{ value: CustomToneMapping, label: 'CustomToneMapping' },
						{ value: AgXToneMapping, label: 'AgXToneMapping' },
					]}
				></SelectComponent>
			</CollapseComponent>
		</>
	)
}
