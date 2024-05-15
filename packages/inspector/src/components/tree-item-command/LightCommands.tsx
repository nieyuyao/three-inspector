import React, { useCallback, useContext, useState } from 'react'
import { Sprite, type Light, SpriteMaterial, Texture } from 'three'
import { Visibility } from './Visibility'
import IconLocation from '../../assets/icons/location.svg?react'
import lightIcon from '../../assets/imgs/light.png'
import { CommandsContainer } from './CommandsContainer'
import { GlobalContext, globalContext } from '../../contexts/global-context'

interface Props {
	light: Light
}

export const LightCommands = (props: Props) => {
	const { light } = props
	const { scene } = useContext<GlobalContext>(globalContext)
	const [lightPosVisible, setLightPosVisible] = useState(false)
	const toggleLightPosition = useCallback(() => {
		if (!scene) {
			return
		}
		setLightPosVisible(!lightPosVisible)
		if (lightPosVisible) {
			scene.getObjectByName('InspectorLightPositionSprite')?.removeFromParent()
			return
		}
		const icon = new Image()
		icon.onload = () => {
			const map = new Texture(icon)
			map.needsUpdate = true
			const sprite = new Sprite(new SpriteMaterial({ map, depthTest: false, depthWrite: true }))
			sprite.name = 'InspectorLightPositionSprite'
			scene.add(sprite)
			sprite.position.copy(light.position)
		}
		icon.src = lightIcon
	}, [scene, lightPosVisible])
	return (
		<CommandsContainer>
			<IconLocation
				className='three-inspector-icon'
				color={lightPosVisible ? 'var(--base-command-icon-selected-color)' : 'var(--base-command-icon-color)'}
				onClick={toggleLightPosition}
			/>
			<Visibility visible={light.visible} style={{ margin: '0 6px' }} onChange={(visible) => {
        light.visible = visible
      }} />
		</CommandsContainer>
	)
}
