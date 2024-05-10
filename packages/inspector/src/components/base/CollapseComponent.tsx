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
    overflow: unset;
    &::after {
      display: none;
    }
	}

	.arco-collapse-item-header {
    padding-left: 20px;
		padding-top: 6px;
		padding-bottom: 6px;
		font-size: var(--base-font-size);
		color: var(--base-font-color) !important;
		background-color: #303030;
		border: none;

    .arco-collapse-item-icon-hover {
      left: 4px;
    }
	}

	.arco-collapse-item-content {
		padding: 0 6px !important;
		font-size: var(--base-font-size);
		color: var(--base-font-color) !important;
		background-color: #303030;
	}

  .arco-icon-hover:hover::before {
    background: transparent;
  }

	.arco-collapse-item-content-box {
		padding: 0px !important;
	}
`

const styles: CSSProperties = {
	margin: '0 6px',
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
