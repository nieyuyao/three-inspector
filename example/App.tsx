import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Nullable } from '../packages/inspector/src/types'
import styled from '@emotion/styled'
import { Inspector } from '../packages/inspector/src'
import dogImgUrl from './assets/dog.jpg'

const Main = styled.div`
	width: 100%;
	height: 100%;
`

const textureLoader = new THREE.TextureLoader()

export function App() {
	const canvasRef = useRef<Nullable<HTMLCanvasElement>>(null)
	const frameId = useRef<number>(0)

	useEffect(() => {
		window.THREE = THREE
		if (!canvasRef.current) {
			return
		}
		const canvas = canvasRef.current
		const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas, alpha: true })
		renderer.setPixelRatio(window.devicePixelRatio)
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0xff00ff })
    const cube = new THREE.Mesh(geometry, material)
		// const axes = new THREE.AxesHelper(1000)

		const texture = textureLoader.load(dogImgUrl)

		const basicMatCube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ map: texture }))

		const ball = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 40), material)

		const group = new THREE.Group()

		group.add(cube)

		group.add(ball)

		scene.add(basicMatCube)

		// scene.add(axes)

		ball.position.x = 2

		scene.add(group)

		cube.position.y = 1

		camera.position.x = 0
		camera.position.y = 10
		camera.position.z = 10

		camera.lookAt(new THREE.Vector3(0, 0, 0))

		const light = new THREE.AmbientLight()

		scene.add(light)

		scene.background = new THREE.Color(0, 0, 0)
    renderer.setClearColor('#000000')

    renderer.setSize(canvas.clientWidth, canvas.clientHeight)

		window.onresize = () => {
			renderer.setSize(window.innerWidth, window.innerHeight)
			camera.aspect = window.innerWidth / window.innerHeight
			camera.updateProjectionMatrix()
		}

		Inspector.show(scene, camera, renderer, { measureDom: canvas.parentElement!})
		const render = () => {
			cube.rotation.y += 0.01
			cube.rotation.x += 0.01
			ball.rotation.y += 0.01
			ball.rotation.x += 0.01
			renderer.render(scene, camera)
			frameId.current = requestAnimationFrame(render)
    }

		const stop = () => {
			cancelAnimationFrame(frameId.current)
			frameId.current = 0

			window.onresize = null
		}

		render()

		return () => {
			stop()
			scene.clear()
			geometry.dispose()
			material.dispose()
			Inspector.destroy()
		}

	}, [])

  return <Main>
		<canvas style={{width: '100%', height: '100%', display: 'block'}} ref={canvasRef} />
	</Main>
}
