import React, { useCallback } from 'react'
import type { Vector2Like, Vector3Like, Vector4Like } from 'three'
import { NumericInputComponent } from './NumericInputComponent'
import styled from '@emotion/styled'

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

const VectorContainer = styled.div`
	font-size: var(--base-font-size);
	color: var(--base-font-color);
`

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
		(name: string, val: string | number) => {
			// @ts-ignore
			vector[name] = val
		},
		[props]
	)

	return (
		<VectorContainer>
			<div className="label">{name}</div>
			<div className="keys">
				{keys.map((key) => {
					return (
						<NumericInputComponent
							key={`${object.uuid}-${key}`}
							name={key}
							object={vector}
							onChange={updateVector}
						/>
					)
				})}
			</div>
		</VectorContainer>
	)
}
