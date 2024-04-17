import React, { useEffect, useState } from 'react'
import { Switch } from '@arco-design/web-react'
import { Line } from './Line'

interface Props {
	name: string
	disabled?: boolean
	checked?: boolean
	onChange?: (val: boolean) => void
}

export const SwitchComponent = (props: Props) => {
	const { checked } = props
	const [innerChecked, setInnerChecked] = useState(checked)
	const handleChange = (checked: boolean) => {
		if (props.onChange) {
			setInnerChecked(checked)
			props.onChange(checked)
		}
	}

	useEffect(() => {
		setInnerChecked(checked)
	}, [checked])
	return (
		<Line label={props.name}>
			<Switch size="small" onChange={handleChange} checked={innerChecked} disabled={props.disabled} />
		</Line>
	)
}
