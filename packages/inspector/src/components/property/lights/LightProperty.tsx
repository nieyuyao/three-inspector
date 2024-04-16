import React from 'react'
import { type Light } from 'three'
import { GeneralPropertyComponent } from '../GeneralPropertyComponent'
import { TransformPropertyComponent } from '../TransformProperty'
import { UserDataProperty } from '../UserDataProperty'

interface Props {
	light: Light
}

export const LightProperty = (props: Props) => {
	const { light } = props
	return <>
		<GeneralPropertyComponent object={light} />
		<TransformPropertyComponent object={light} />
		<UserDataProperty />
	</>
}
