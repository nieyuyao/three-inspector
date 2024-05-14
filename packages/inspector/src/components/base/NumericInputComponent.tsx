import React, { CSSProperties, useCallback, useEffect, useState } from 'react'
import { Input } from '@arco-design/web-react'
import { Line } from './Line'

interface Props {
  label?: string
	prop?: string
  defaultValue?: any
	max?: number
	min?: number
  disabled?: boolean
  contentStyle?: CSSProperties
	onChange?: (val: number, prop?: string) => void
}

export const NumericInputComponent = (props: Props) => {
	const { prop, defaultValue, label, disabled = false, contentStyle = {} } = props
	const [value, setValue] = useState(defaultValue || '')
	const onChange = useCallback((value: string) => {
		let val = Number(value)
		setValue(value)
		if (isNaN(val)) {
			return
		}
		props.onChange?.(val, prop)
	}, [props.prop])

	useEffect(() => {
		setValue(defaultValue)
	}, [defaultValue])
	return (
		<Line label={label ?? prop} contentStyle={{ maxWidth: 'calc(100% - 80px)', ...contentStyle }}>
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
