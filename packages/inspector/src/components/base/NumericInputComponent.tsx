import React, { useCallback, useEffect, useState } from 'react'
import { Input } from '@arco-design/web-react'
import { Line } from './Line'

interface Props {
  label?: string
	name: string
  defaultValue?: any
	max?: number
	min?: number
  disabled?: boolean
	onChange?: (prop: string, val: number) => void
}

export const NumericInputComponent = (props: Props) => {
	const { name, defaultValue, label, disabled = false } = props
	const [value, setValue] = useState(defaultValue || '')
	const onChange = useCallback((value: string) => {
		let val = Number(value)
		setValue(value)
		if (isNaN(val)) {
			return
		}
		props.onChange?.(name, val)
	}, [props.name])

	useEffect(() => {
		setValue(defaultValue)
	}, [defaultValue])
	return (
		<Line label={label ?? name} contentStyle={{ maxWidth: 'calc(100% - 80px)' }}>
			<Input
				style={{ width: '100%', padding: '0 12px' }}
				disabled={disabled}
				value={value}
				onChange={onChange}
				max={props.max}
				min={props.min}
			/>
		</Line>
	)
}
