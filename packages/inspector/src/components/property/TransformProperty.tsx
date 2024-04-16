import React from 'react'
import type { Object3D } from 'three'
import { VectorComponent } from '../base/VectorComponent'
import { CollapseComponent } from '../base/CollapseComponent'

export interface Props {
	object: Object3D
}

const commonProps: Array<keyof THREE.Object3D> = [
	'position',
	'scale',
	'rotation',
]

export const TransformPropertyComponent = (props: Props) => {
	return <CollapseComponent label='Transform' defaultOpened>
		{
			commonProps.map(prop => <VectorComponent key={prop} name={prop} object={props.object} />)
		}
	</CollapseComponent>
}
