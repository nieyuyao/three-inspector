import React, { forwardRef, type ForwardedRef, type CSSProperties, type ReactNode } from 'react'
import './index.scss'

interface Props {
	label: string | ReactNode
	children?: ReactNode
	contentStyle?: CSSProperties
}

export const Line = forwardRef((props: Props, ref: ForwardedRef<HTMLDivElement>) => {
		return <div className='three-inspector-line' ref={ref}>
			<div className="label">{props.label}</div>
			<div className='right' style={props.contentStyle}>
				{ props.children }
			</div>
		</div>
	})
