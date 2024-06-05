import React, { useEffect, useState } from 'react'
import { Checkbox } from '@arco-design/web-react'
import { Line } from '../line/Line'

interface Props {
	name: string
	disabled?: boolean
	checked?: boolean
	onChange?: (val: boolean) => void
}

export const CheckboxComponent = (props: Props) => {
	const { checked } = props
	const [ innerChecked, setInnerChecked ] = useState(checked)
	const handleChange = (checked: boolean) => {
		if (props.onChange) {
			setInnerChecked(checked)
			props.onChange(checked)
		}
	}

	useEffect(() => {
		setInnerChecked(checked)
	}, [checked])
	return <Line label={props.name}>
		<Checkbox onChange={handleChange} checked={innerChecked} disabled={props.disabled} />
	</Line>
}
