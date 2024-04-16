import React, { useCallback, useContext, useState } from 'react'
import { Sprite, type Light, SpriteMaterial, Texture } from 'three'
import { Visibility } from './Visibility'
import { SVGComponent } from '../base/SVGComponent'
import { defaultIconColor, grayIconColor } from '../../constants'
import lightIcon from '../../assets/imgs/light.png'
import { CommandsContainer } from './CommandsContainer'
import { GlobalContext, globalContext } from '../../global-context'

interface Props {
	light: Light
}

export const LightCommands = (props: Props) => {
	const { light } = props
	const { scene } = useContext<GlobalContext>(globalContext)
	const [lightPosVisible, setLightPosVisible] = useState(false)
	const toggleLightPosition = useCallback(() => {
		setLightPosVisible(!lightPosVisible)
		if (!scene) {
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
			<SVGComponent
				name="location"
				onClick={toggleLightPosition}
				color={lightPosVisible ? defaultIconColor : grayIconColor}
			></SVGComponent>
			<Visibility visible={false} style={{ margin: '0 6px' }} />
		</CommandsContainer>
	)
}
