import React, { useContext, useEffect, useState } from 'react'
import type { WebGLRenderer, Scene, Camera, BufferGeometry, Material, Group } from 'three'
import { REVISION } from 'three'
import { TextLineComponent } from '../base/TextLineComponent'
import { CollapseComponent } from '../base/CollapseComponent'
import { GlobalContext, globalContext } from '../../global-context'
import { isLight, isMesh } from '../../utils/object'

export const Statistic = () => {
	const { scene, renderer } = useContext<GlobalContext>(globalContext)
	const [frames, setFrames] = useState(0)
	const [ms, setMs] = useState(0)
	const [mb, setMb] = useState(0)
	const [drawcalls, setDrawcalls] = useState(0)
	const [lines, setLines] = useState(0)
	const [points, setPoints] = useState(0)
	const [triangles, setTriangles] = useState(0)
	const [lights, setLights] = useState(0)
	const [materials, setMaterials] = useState(0)

	useEffect(() => {
		if (!scene) {
			return
		}

		const afterRender = scene.onAfterRender
		let time = Date.now()
		let elapsed = 0
		let currentFrames = 0

		// refresh per second
		scene.onAfterRender = (
			renderer: WebGLRenderer,
			scene: Scene,
			camera: Camera,
			geometry: BufferGeometry,
			material: Material,
			group: Group
		) => {
			const now = Date.now()
			const delta = Date.now() - time
			elapsed += delta
			time = now
			afterRender(renderer, scene, camera, geometry, material, group)
			currentFrames++
			if (elapsed >= 1000) {
				// refresh per second
				setMs(delta)
				setFrames(currentFrames)
				// @ts-ignore
				if (performance.memory) {
					// @ts-ignore
					setMb(Math.ceil(performance.memory.usedJSHeapSize / 1024 / 1024))
				}
				currentFrames = 0
				elapsed = 0
			}

			let lights = 0
			let materials = 0
			scene.traverse(object => {
				if (isLight(object)) {
					lights++
				}
				if (isMesh(object)) {
					materials += Array.isArray(object.material) ? object.material.length : 1
				}
			})

			setLights(lights)
			setMaterials(materials)
		}

		if (renderer) {
			const { calls, lines, points, triangles } = renderer.info.render
			setDrawcalls(calls)
			setLines(lines)
			setPoints(points)
			setTriangles(triangles)
		}

		return () => {
			scene.onAfterRender = afterRender
		}
	}, [scene, renderer])

	return (
		<>
			<TextLineComponent name="Version" text={REVISION} />
			<TextLineComponent name="FPS" text={frames} />
			<TextLineComponent name="MS" text={ms} />
			<TextLineComponent name="Memory" text={`${mb}MB`} />
			<CollapseComponent label="Render Info" defaultOpened>
				<TextLineComponent name="Drawcalls" text={drawcalls} />
				<TextLineComponent name="Lines" text={lines} />
				<TextLineComponent name="Points" text={points} />
				<TextLineComponent name="Triangles" text={triangles} />
				<TextLineComponent name="Total materials" text={`${materials}`} />
				<TextLineComponent name="Total lights" text={`${lights}`} />
			</CollapseComponent>
			<CollapseComponent label='System Info' defaultOpened>
				<TextLineComponent name="Resolution" text={REVISION} />
				<TextLineComponent name="Driver" text={REVISION} />
				<TextLineComponent name="Stencil" text={REVISION} />
				<TextLineComponent name="Engine" text={REVISION} />
			</CollapseComponent>
		</>
	)
}
