import React from 'react'
import type { Object3D } from 'three'
import { CollapseComponent } from '../base/collapse/Collapse'
import { TextLineComponent } from '../base/text-line/TextLine'

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
