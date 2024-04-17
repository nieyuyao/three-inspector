import React, { useRef } from 'react'
import { Line } from './Line'
import { Select, SelectProps } from '@arco-design/web-react'
import { Nullable } from '../../types'

interface Props {
	name: string
	disabled?: boolean
	defaultValue?: number
	options: SelectProps['options']
	onChange?: (val: number) => void
}

export const SelectComponent = (props: Props) => {
	const { name, options, defaultValue, disabled } = props
	const popupContainerRef = useRef<Nullable<HTMLDivElement>>(null)
	const getPopupContainer = () => {
		return popupContainerRef.current ? popupContainerRef.current : document.body
	}
	return (
		<Line label={name} ref={popupContainerRef}>
			<Select
				disabled={disabled}
				options={options}
				onChange={props.onChange}
				defaultValue={defaultValue}
				getPopupContainer={getPopupContainer}
			/>
		</Line>
	)
}
