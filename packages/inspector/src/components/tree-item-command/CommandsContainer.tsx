import React, { ReactNode } from 'react'
import styled from '@emotion/styled'

export const Container = styled.div`
	display: flex;
	align-items: center;
	position: absolute;
	top: 0;
	right: 0;
`

export const CommandsContainer = (props: { children: ReactNode }) => {
	return <Container>
		{ props.children }
	</Container>
}
