import React, { useCallback, useContext, useRef, useState } from 'react'
import { PerspectiveCamera } from 'three'
import { NavigatorGizmo } from 'threejs-navigator-gizmo'
import { ButtonComponent } from '../base/ButtonComponent'
import { GlobalContext, globalContext } from '../../global-context'
import { Measure } from '../../tools/Measure'
import { Nullable } from '../../types'
import { CollapseComponent } from '../base/CollapseComponent'
import { Screenshot } from '../../tools/ScreenShot'
import { SwitchComponent } from '../base/SwitchComponent'


export const Tools = () => {
	const { scene, camera, canvas, measureDom, renderer } = useContext<GlobalContext>(globalContext)
	const [_, setMeasureVisible] = useState(false)
	const [__, setGizmoVisible] = useState(false)
	const measureToolRef = useRef<Nullable<Measure>>(null)
	const prevAfterRender = useRef<onAfterRender>(() => {})
	const gizmoRef = useRef<Nullable<NavigatorGizmo>>(null)


	const onMeasureVisibleChanged = useCallback(
		(visible: boolean) => {
			setMeasureVisible(visible)
			if (!scene || !camera || !canvas) {
				return
			}
			if (visible) {
				measureToolRef.current = new Measure(camera, scene, measureDom || canvas)
			} else {
				measureToolRef.current?.dispose()
				measureToolRef.current = null
			}
		},
		[scene, canvas, camera]
	)

	const onNavGizmoVisibleChanged = useCallback(
		(visible: boolean) => {
			setGizmoVisible(visible)
			if (!scene) {
				return
			}
			const enableGizmo = visible && camera && renderer
			if (enableGizmo) {
				const gizmo = new NavigatorGizmo(camera as PerspectiveCamera, renderer)
				gizmoRef.current = gizmo
				prevAfterRender.current = scene.onAfterRender
				scene.onAfterRender = (...args) => {
					prevAfterRender.current(...args)
					gizmo.update()
				}
			} else {
				scene.onAfterRender = prevAfterRender.current
				gizmoRef.current?.dispose()
				gizmoRef.current = null
			}
		},
		[scene, camera]
	)

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
	}, [canvas, scene])

	return (
		<div>
			<SwitchComponent name="Measure" onChange={onMeasureVisibleChanged} />
			<SwitchComponent name="3D NavigatorGizmo" onChange={onNavGizmoVisibleChanged} />
			<CollapseComponent label="Capture" defaultOpened>
				<ButtonComponent onClick={screenshot}>Screenshot</ButtonComponent>
				<ButtonComponent>Record video</ButtonComponent>
			</CollapseComponent>
			<CollapseComponent label="GLTF Export">
				<ButtonComponent>Export to GLTF</ButtonComponent>
			</CollapseComponent>
		</div>
	)
}
