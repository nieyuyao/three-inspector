import React from 'react'
import type { Scene } from 'three'
import { Visibility } from './Visibility'
import { CommandsContainer } from './CommandsContainer'

interface Props {
	scene: Scene
}

export const SceneCommands = (props: Props) => {
	const { scene } = props
	const onVisibilityChanged = (visible: boolean) => {
		scene.visible = visible
	}
	return <CommandsContainer>
		<Visibility visible={scene.visible} onChange={onVisibilityChanged} style={{ margin: '0 6px'}} />
	</CommandsContainer>
}
