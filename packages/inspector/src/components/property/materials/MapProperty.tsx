import React, { useCallback, useEffect, useRef } from 'react'
import type { Material, Texture } from 'three'
import { TextureProperty } from '../textures/TextureProperty'
import { useForceUpdate } from '../../../hooks/useForceUpdate'
import { UVHelper } from '../../../helpers/UVHelper'
import { SwitchComponent } from '../../base/switch/Switch'
import { Nullable } from '../../../types'
import { upperLabel } from '../../../utils/label'

type TextureProp<T> = {
	[K in keyof T]: T[K] extends Texture | null ? K : never
}[keyof T]

 export const MapProperty = <T extends Material, K extends TextureProp<T>>(props: {
	material: T
	prop: K,
}) => {
	const { material, prop } = props
	const forceUpdate = useForceUpdate()
	const uvHelper = useRef<Nullable<UVHelper>>(new UVHelper(material))

	const toggleUvHelperVisible = useCallback(
		(visible: boolean) => {
			visible ? uvHelper.current?.debug() : uvHelper.current?.reset()
		},
		[material]
	)
	const onTextureChanged = useCallback(
		(texture: Texture) => {
			material[prop] = texture as T[K]
			material.needsUpdate = true
			uvHelper.current?.updateMaterial(material)
			forceUpdate()
		},
		[material]
	)

  useEffect(() => {
    return () => {
      // reset to original material if component uninstalled
      uvHelper.current?.reset()
    }
  })
	return (
		<>
			<SwitchComponent name="UV Debug" checked={false} onChange={toggleUvHelperVisible} />
			<TextureProperty texture={material[prop] as Texture} onTextureChanged={onTextureChanged} label={upperLabel(String(prop))} />
		</>
	)
}
