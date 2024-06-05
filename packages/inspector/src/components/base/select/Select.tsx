import React, { useRef } from 'react'
import { Line } from '../line/Line'
import { Select, SelectProps } from '@arco-design/web-react'
import { Nullable } from '../../../types'

interface Props<T> {
  popupContainer?: Nullable<HTMLElement>
	name: string
	disabled?: boolean
	defaultValue?: T
	options: SelectProps['options']
	onChange?: (val: T) => void
  forceSetBody?: boolean
}

export const SelectComponent =  <T extends (string | number) = number>(props: Props<T>) => {
	const { name, options, defaultValue, disabled } = props
	const popupContainerRef = useRef<Nullable<HTMLDivElement>>(null)
	const getPopupContainer = () => {
    if (props.popupContainer) {
      return props.popupContainer
    }
		return popupContainerRef.current ? popupContainerRef.current : document.body
	}
	return (
		<Line label={name} ref={popupContainerRef}>
			<Select
        style={{ width: '160px' }}
				disabled={disabled}
				options={options}
				onChange={props.onChange}
				defaultValue={defaultValue}
				getPopupContainer={getPopupContainer}
			/>
		</Line>
	)
}
