import type { Mesh, Scene, Group, Object3D, OrthographicCamera, Light } from 'three'


export const isScene = (object: any): object is Scene => {
	return object.isScene
}

export const isMesh = (object: any): object is Mesh => {
	return object.isMesh
}

export const isGroup = (object: any): object is Group => {
	return object.isGroup
}


export const isObject3D = (object: any): object is Object3D => {
	return object.isObject3D
}


export const isOrthographicCamera = (camera: any): camera is OrthographicCamera => {
	return camera.isOrthographicCamera
}

export const isLight = (object: any): object is Light => {
	return object.isLight
}
