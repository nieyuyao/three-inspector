import React, { useEffect, useRef, useState } from 'react'
import { Line } from './Line'
import Slider from 'antd/es/slider'
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

	const [tooltipOpen, toggleTooltipOpen] = useState(false)

	useEffect(() => {
		setValue(props.value)
	}, [props])
	const onChange = (val: number) => {
		setValue(val)
		if (props.onChange) {
			props.onChange(val)
		}
	}
	const onFocus = () => {
		toggleTooltipOpen(true)
	}
	const onBlur = () => {
		toggleTooltipOpen(false)
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
				onFocus={onFocus}
				onBlur={onBlur}
				tooltip={{
					open: tooltipOpen,
					getPopupContainer() {
						return lineRef.current || document.body
					},
				}}
			/>
		</Line>
	)
}
