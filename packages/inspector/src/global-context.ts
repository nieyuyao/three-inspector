import { createContext } from 'react'
import type { Scene, Object3D, Camera, WebGLRenderer } from 'three'
import { Nullable } from './types'

export interface GlobalContext {
	scene: Nullable<Scene>
	camera: Nullable<Camera>
	canvas: Nullable<HTMLCanvasElement>
	renderer: Nullable<WebGLRenderer>
	targetObject: Nullable<Object3D>
	measureDom: Nullable<HTMLElement>
}

export const globalContext = createContext<GlobalContext>({
	scene: null,
	camera: null,
	targetObject: null,
	renderer: null,
	canvas: null,
	measureDom: null
})


export interface GlobalUtilsContext {
	updateTargetObject: (obj: THREE.Object3D) => void
}


export const globalUtilsContext = createContext<GlobalUtilsContext>({
	updateTargetObject: () => {}
})
