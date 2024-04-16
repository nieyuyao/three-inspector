import React, { useState } from 'react'
import EyeOutlined from '@ant-design/icons/EyeOutlined'
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined'

export const Visibility = (
	props: { visible?: boolean; onChange?: (visible: boolean) => void; style?: React.CSSProperties } = { visible: true }
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
			{visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
		</div>
	)
}
