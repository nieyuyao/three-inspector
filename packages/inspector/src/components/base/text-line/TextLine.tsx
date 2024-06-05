import React from 'react'
import { Line } from '../line/Line'

interface Props {
	name: string
	object?: any
	text?: string | number
}

export const TextLineComponent = (props: Props) => {
	const { name, object } = props
	return <Line label={props.name}>
		{ object ? object[name] : props.text }
	</Line>
}
