import React, { useState } from 'react'
import { IconEye } from '@arco-design/web-react/icon'

export const Visibility = (
	props: {
		visible?: boolean
		onChange?: (visible: boolean) => void
		style?: React.CSSProperties
	} = { visible: true }
) => {
	const [visible, setVisible] = useState(props.visible)
	const handleClick = () => {
		if (props.onChange) {
			setVisible(!visible)
			props.onChange(!visible)
		}
	}
	return (
		<div onClick={handleClick} style={props.style}>
			<IconEye
				style={{
					color: visible
						? 'var(--base-command-icon-selected-color)'
						: 'var(--base-command-icon-color)',
				}}
			/>
		</div>
	)
}
