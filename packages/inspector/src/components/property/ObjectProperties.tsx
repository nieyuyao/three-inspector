import React, { useContext } from 'react'
import { TransformPropertyComponent } from './TransformProperty'
import { GeneralPropertyComponent } from './GeneralPropertyComponent'
import { GlobalContext, globalContext } from '../../global-context'
import { UserDataProperty } from './UserDataProperty'

export const ObjectProperties = () => {
	const { targetObject } = useContext<GlobalContext>(globalContext)
	if (!targetObject) {
		return null
	}
	return <>
		<GeneralPropertyComponent  object={targetObject} />
		<TransformPropertyComponent object={targetObject} />
		<UserDataProperty />
	</>
}
