import React from 'react'
import type { Object3D } from 'three'
import { CollapseComponent } from '../base/CollapseComponent'
import { TextLineComponent } from '../base/TextLineComponent'

const generalProps: Array<keyof THREE.Object3D> = ['uuid', 'id', 'name']

export interface Props {
	object: Object3D
}

export const GeneralPropertyComponent = (props: Props) => {
	return (
		<CollapseComponent label="General" defaultOpened>
			{ generalProps.map(prop => <TextLineComponent key={prop} name={prop} object={props.object} />)}
		</CollapseComponent>
	)
}
