import React, { type ReactNode, type MouseEvent } from 'react'
import Button from 'antd/es/button'

interface Props {
	onClick?: (event: MouseEvent) => void
	children?: ReactNode
}

export const ButtonComponent = ({ children, onClick }: Props) => {
	return (
		<Button
			className="three-inspector-button"
			onClick={onClick}
		>
			{children}
		</Button>
	)
}
