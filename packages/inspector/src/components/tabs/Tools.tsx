import React, { useCallback, useContext, useRef, useState } from 'react'
import { ButtonComponent } from '../base/ButtonComponent'
import { GlobalContext, globalContext } from '../../global-context'
import { Measure } from '../../tools/Measure'
import { Nullable } from '../../types'
import { CollapseComponent } from '../base/CollapseComponent'
import { Screenshot } from '../../tools/ScreenShot'
import { SwitchComponent } from '../base/SwitchComponent'

export const Tools = () => {
	const { scene, camera, canvas, measureDom } = useContext<GlobalContext>(globalContext)
	const [_, setMeasureVisible ] = useState(false)
	const measureToolRef = useRef<Nullable<Measure>>(null)

	const onMeasureVisibleChanged = useCallback((visible: boolean) => {
		setMeasureVisible(visible)
		if (!scene || !camera || !canvas) {
			return
		}
		if (visible) {
			measureToolRef.current = new Measure(camera, scene, measureDom || canvas )
		} else {
			console.log('dispose')
			measureToolRef.current?.dispose()
			measureToolRef.current = null
		}
	}, [scene, canvas, camera])

	const screenshot = useCallback(() => {
		if (!scene) {
			return
		}
		const existAfRender = scene.onAfterRender
		scene.onAfterRender = (...args) => {
			scene.onAfterRender = existAfRender
			canvas?.toBlob((blob) => {
				if (blob) {
					Screenshot.download(blob, 'Screenshot.png')
				}
			})
			existAfRender(...args)
		}
	}, [ canvas, scene ])

	return <div>
		<SwitchComponent name='Measure' onChange={onMeasureVisibleChanged}/>
		<CollapseComponent label='Capture' defaultOpened>
			<ButtonComponent onClick={screenshot}>Screenshot</ButtonComponent>
			<ButtonComponent>Record video</ButtonComponent>
		</CollapseComponent>
		<CollapseComponent label='GLTF Export'>
			<ButtonComponent>Export to GLTF</ButtonComponent>
		</CollapseComponent>
	</div>
}
