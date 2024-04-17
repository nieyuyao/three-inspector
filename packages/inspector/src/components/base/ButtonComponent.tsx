import React, { type ReactNode } from 'react'
import { Button } from '@arco-design/web-react'

interface Props {
	onClick?: (event: Event) => void
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
