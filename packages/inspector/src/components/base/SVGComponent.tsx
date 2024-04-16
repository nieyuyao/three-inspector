import React, { type MouseEvent, type CSSProperties } from 'react'
import { useDynamicSVGImport } from '../../hooks/useDynamicSVGImport'
import styled from '@emotion/styled'

interface Props {
	name: string
	className?: string
	color?: string
	width?: number
	height?: number
	style?: CSSProperties
	onClick?: (event: MouseEvent) => void
}

const SvgContainer = styled.div<Omit<Props, 'name'>>`
	margin-right: 4px;
	width: ${(props) => props.width ?? 12}px;
	height: ${(props) => props.height ?? 12}px;
	font-size: 0;
	svg {
		width: 100%;
		height: 100%;
		color: ${(props) => props.color ?? '#fff'};
	}
`

export const SVGComponent = (props: Props) => {
	const { SvgIcon, loading } = useDynamicSVGImport(props.name)

	return !loading && SvgIcon ? (
		<SvgContainer className={props.className}  color={props.color} onClick={props.onClick} width={props.width} height={props.height} style={props.style}>
			<SvgIcon />
		</SvgContainer>
	) : null
}
