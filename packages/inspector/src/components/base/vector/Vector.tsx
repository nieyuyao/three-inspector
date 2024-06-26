import React, { useCallback } from 'react'
import type { Vector2Like, Vector3Like, Vector4Like } from 'three'
import { NumericInputComponent } from '../numberic-input/NumericInput'

interface Props {
	name: keyof THREE.Object3D
	object: THREE.Object3D
}

type Vector = Vector2Like | Vector3Like | Vector4Like

const getVectorDimensions = (v: any) => {
	return ['x', 'y', 'z', 'w'].reduce((acc, component) => {
		acc += v[component] !== undefined ? 1 : 0
		return acc
	}, 0)
}

const getKeys = (v: Vector) => {
	const dims = getVectorDimensions(v)
	if (dims === 2) {
		return ['x', 'y']
	}
	if (dims === 3) {
		return ['x', 'y', 'z']
	}
	if (dims === 4) {
		return ['x', 'y', 'z', 'w']
	}
	return []
}

export const VectorComponent = (props: Props) => {
	const { name, object } = props
	const vector = object[name] as Vector
	const keys = getKeys(vector)

	const updateVector = useCallback(
		(val: string | number, name: string) => {
			// @ts-ignore
			vector[name] = val
		},
		[props]
	)

	return (
		<div className='three-inspector-vector'>
			<div className="label">{name}</div>
			<div className="keys">
				{keys.map((key) => {
					return (
						<NumericInputComponent
							key={`${object.uuid}-${key}`}
							prop={key}
							defaultValue={(vector as any)[key]}
							onChange={updateVector}
						/>
					)
				})}
			</div>
		</div>
	)
}
