import React, { type ReactNode } from 'react'
import { Button } from '@arco-design/web-react'

interface Props {
  style?: React.CSSProperties
	onClick?: (event: Event) => void
	children?: ReactNode
}

export const ButtonComponent = ({ children, onClick, style }: Props) => {
	return (
		<Button
			className="three-inspector-button"
			onClick={onClick}
      style={style}
		>
			{children}
		</Button>
	)
}
