import React, { useCallback } from 'react'
import { Color, Texture, type Scene, Fog } from 'three'
import { ColorComponent } from '../base/ColorComponent'
import { GeneralPropertyComponent } from './GeneralPropertyComponent'
import { RgbColor } from 'react-colorful'
import { rbgColor2Color } from '../../utils/color'
import { SwitchCollapseComponent } from '../base/SwitchCollapseComponent'
import { TextureProperty } from './textures/TextureProperty'
import { NumericInputComponent } from '../base/NumericInputComponent'
import { useForceUpdate } from '../../hooks/useForceUpdate'

export interface Props {
	scene: Scene
}

export const SceneProperties = (props: Props) => {
	const { scene } = props
	const forceUpdate = useForceUpdate()
	const onBgColorChanged = useCallback(
		(c: RgbColor | null) => {
			if (!scene) {
				return
			}

			const isTexture = scene.background instanceof Texture
			isTexture && forceUpdate()
			if (c === null) {
				scene.background = null
				isTexture && forceUpdate()
				return
			}
			scene.background = rbgColor2Color(c)
			isTexture && forceUpdate()
		},
		[scene]
	)
	const onBgTextureChanged = useCallback(
		(texture: Texture) => {
			if (!scene) {
				return
			}
			scene.background = texture
			forceUpdate()
		},
		[scene]
	)

	const onFogChanged = useCallback(
		(prop: 'color' | 'near' | 'far', val: any) => {
			const fog = scene.fog as Fog
			if (!fog) {
				return
			}
			fog[prop] = val
			forceUpdate()
		},
		[scene]
	)
	return (
		<>
			<GeneralPropertyComponent object={scene} />
			<SwitchCollapseComponent
				label="Fog"
				checked={Boolean(scene.fog)}
				onCheckedChange={(checked) => {
					let fog = scene.fog
					if (checked && !fog) {
						// create fog
						fog = new Fog(0xffffff, 0, 1000)
						scene.fog = fog
						forceUpdate()
					} else if (!checked) {
						scene.fog = null
						forceUpdate()
					}
				}}
			>
				<ColorComponent name="color" onChange={onBgColorChanged} />
				<NumericInputComponent
					prop="Near"
          defaultValue={(scene.fog as Fog)?.near}
					onChange={(val) => onFogChanged('near', val)}
				/>
				<NumericInputComponent
					prop="Far"
          defaultValue={(scene.fog as Fog)?.far}
					onChange={(val) => onFogChanged('far', val)}
				/>
			</SwitchCollapseComponent>
			<SwitchCollapseComponent label="Background" checked={Boolean(scene.background)}>
				<ColorComponent
					name="Color"
					showColourless
					onChange={onBgColorChanged}
					defaultColor={scene.background instanceof Color ? scene.background : null}
				/>
				<TextureProperty
					switchMode
					checked={scene.background instanceof Texture}
					texture={scene.background instanceof Texture ? scene.background : null}
					onTextureChanged={onBgTextureChanged}
				/>
			</SwitchCollapseComponent>
		</>
	)
}
