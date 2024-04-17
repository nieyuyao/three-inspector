import React, { useState, type CSSProperties } from 'react'
import { Collapse } from '@arco-design/web-react'
import styled from '@emotion/styled'

interface Props {
	label: string
	defaultOpened?: boolean
	children?: React.ReactNode
}

export const CollapseContainer = styled.div`
	margin: 4px 0;
	.label {
		padding: 0 4px;
	}

	.arco-collapse  {
		margin: 0 !important;
	}

	.arco-collapse-item-header {
		padding-top: 6px;
		padding-bottom: 6px;
		font-size: var(--base-font-size);
		color: var(--base-font-color) !important;
		background-color: #303030;
		border: none;
	}

	.arco-collapse-item-content {
		padding: 0 6px !important;
		font-size: var(--base-font-size);
		color: var(--base-font-color) !important;
		background-color: #303030;
	}

	.arco-collapse-item-content-box {
		padding: 6px !important;
	}
`

const styles: CSSProperties = {
	margin: '0 6px',
	backgroundColor: 'var(--base-tab-grid-bg-color)'
}

export const CollapseComponent = (props: Props) => {
	const [defaultActiveKey] = useState(props.defaultOpened ? props.label : undefined)
	return (
		<CollapseContainer>
			<Collapse
				defaultActiveKey={defaultActiveKey}
				bordered={false}
				style={styles}
				lazyload={false}
			>
				<Collapse.Item header={props.label} name={props.label}>
					{ props.children }
				</Collapse.Item>
			</Collapse>
		</CollapseContainer>
	)
}
