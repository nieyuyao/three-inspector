import React, { forwardRef, type ForwardedRef, type CSSProperties, type ReactNode } from 'react'
import styled from '@emotion/styled'

export const Container = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 4px 0;
	padding: 0 8px;
	height: 24px;
	color: #fff;
	font-size: var(--base-font-size);
  .label {
    font-weight: bold;
  }
	.right {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: right;
		margin-left: 12px;
		height: 100%;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-align: right;
		overflow: hidden;
	}

	&:hover {
		border-radius: 8px;
		background-color: var(--base-tab-grid-bg-color);
	}
`

interface Props {
	label: string | ReactNode
	children?: ReactNode
	contentStyle?: CSSProperties
}

export const Line = forwardRef((props: Props, ref: ForwardedRef<HTMLDivElement>) => {
		return <Container ref={ref}>
			<div className="label">{props.label}</div>
			<div className='right' style={props.contentStyle}>
				{ props.children }
			</div>
		</Container>
	})
