import React, { useEffect, useState } from 'react'
import Checkbox, { type CheckboxChangeEvent } from 'antd/es/checkbox'
import { Line } from './Line'

interface Props {
	name: string
	disabled?: boolean
	checked?: boolean
	onChange?: (val: boolean) => void
}

export const CheckboxComponent = (props: Props) => {
	const { checked } = props
	const [ innerChecked, setInnerChecked ] = useState(checked)
	const handleChange = (e: CheckboxChangeEvent) => {
		if (props.onChange) {
			setInnerChecked(!!e.target.checked)
			props.onChange(!!e.target.checked)
		}
	}

	useEffect(() => {
		setInnerChecked(checked)
	}, [checked])
	return <Line label={props.name}>
		<Checkbox onChange={handleChange} checked={innerChecked} disabled={props.disabled} />
	</Line>
}
