import React, { useEffect, useRef, useState } from 'react'
import { Line } from './Line'
import { Slider } from '@arco-design/web-react'
import { Nullable } from '../../types'

interface Props {
	name: string
	value: number
	min?: number
	max?: number
	step?: number
	onChange?: (val: number) => void
}

export const NumericSlider = (props: Props) => {
	const { min = 0, max = 1, step = 0.1 } = props
	const [value, setValue] = useState(props.value)
	const lineRef = useRef<Nullable<HTMLDivElement>>(null)

	useEffect(() => {
		setValue(props.value)
	}, [props])
	const onChange = (val: number) => {
		setValue(val)
		if (props.onChange) {
			props.onChange(val)
		}
	}
	return (
		<Line label={props.name} ref={lineRef}>
			<Slider
				style={{ width: '200px', marginRight: '8px' }}
				min={min}
				max={max}
				step={step}
				value={value}
				onChange={onChange}
				getTooltipContainer={() => {
					return lineRef.current || document.body
				}}
			/>
		</Line>
	)
}
