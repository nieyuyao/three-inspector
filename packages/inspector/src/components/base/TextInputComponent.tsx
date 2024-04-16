import React, { useCallback, useEffect, useState } from 'react'
import Input from 'antd/es/input'
import { isReadonly } from '../../utils/prop'
import { Line } from './Line'

interface Props {
	name: string
	object: any
	onChange?: (prop: string, val: string | number) => void
}

export const TextInputComponent = (props: Props) => {
	const { name, object } = props
	const [value, setValue] = useState(object[name])
	const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const val = event.target.value
		const newVal = typeof value === 'number' ? Number(val) : val
		setValue(newVal)
		props.onChange?.(name, typeof value === 'number' ? Number(val) : val)
	}, [props.name])

	useEffect(() => {
		const { name, object } = props
		setValue(object[name])
	}, [props])
	return (
		<Line label={name}>
			<Input
				type="string"
				className="right"
				style={{ width: '100%', padding: '0 12px' }}
				disabled={isReadonly(object, name)}
				value={value}
				onChange={onChange}
			/>
		</Line>
	)
}
