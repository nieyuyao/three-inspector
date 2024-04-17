import React, { useCallback, useEffect, useState } from 'react'
import { Input } from '@arco-design/web-react'
import { isReadonly } from '../../utils/prop'
import { Line } from './Line'

interface Props {
	name: string
	object: any
	max?: number
	min?: number
	onChange?: (prop: string, val: number) => void
}

export const NumericInputComponent = (props: Props) => {
	const { name, object } = props
	const [value, setValue] = useState(object[name])
	const onChange = useCallback((value: string) => {
		let val = Number(value)
		setValue(value)
		if (isNaN(val)) {
			return
		}
		props.onChange?.(name, val)
	}, [props.name])

	useEffect(() => {
		const { name, object } = props
		setValue(object[name])
	}, [props])
	return (
		<Line label={name} contentStyle={{ maxWidth: 'calc(100% - 80px)' }}>
			<Input
				style={{ width: '100%', padding: '0 12px' }}
				disabled={isReadonly(object, name)}
				value={value}
				onChange={onChange}
				max={props.max}
				min={props.min}
			/>
		</Line>
	)
}
