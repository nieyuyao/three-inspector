import React, { useContext } from 'react'
import type { Object3D, Scene, Group, Light } from 'three'
import { GlobalContext, globalContext } from '../../contexts/global-context'
import { SceneProperties } from '../property/SceneProperties'
import { MeshProperties } from '../property/MeshProperties'
import { ObjectProperties } from '../property/ObjectProperties'
import { LightProperty } from '../property/lights/LightProperty'

export const renderComponent = (object: Object3D) => {
	if ((object as Scene).isScene) {
		return <SceneProperties scene={object as Scene} />
	}  else if ((object as Light).isLight) {
		return <LightProperty light={object as Light}></LightProperty>
	} else if ((object as THREE.Mesh).isMesh) {
		return <MeshProperties />
	} else if ((object as Group).isGroup) {
		return <ObjectProperties />
	}
	return null
}

export const Properties = () => {
	const { targetObject } = useContext<GlobalContext>(globalContext)
	return targetObject ? (
		<div>
			{ renderComponent(targetObject) }
		</div>
	) : null
}
