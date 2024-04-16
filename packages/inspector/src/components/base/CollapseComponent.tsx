import React, { useState, type CSSProperties } from 'react'
import type { CollapseProps } from 'antd'
import Collapse from 'antd/es/collapse'
import styled from '@emotion/styled'

interface Props {
	label: string
	defaultOpened?: boolean
	children?: React.ReactNode
	onChange?: CollapseProps['onChange']
}

export const CollapseContainer = styled.div`
	margin: 4px 0;
	.label {
		padding: 0 4px;
	}

	.ant-collapse  {
		margin: 0 !important;
	}
	.ant-collapse-header {
		font-size: var(--base-font-size);
		color: var(--base-font-color) !important;
		padding: 0 6px !important;
		.ant-collapse-header-text {
			height: 22px;
			line-height: 22px;
		}
	}

	.ant-collapse-content-box {
		padding: 6px !important;
	}
`

const styles: CSSProperties = {
	margin: '0 6px',
	backgroundColor: 'var(--base-tab-grid-bg-color)'
}

export const CollapseComponent = (props: Props) => {
	const [activeKey, setActiveKey] = useState(props.defaultOpened ? props.label : undefined)
	const onChange = (key: string | string[]) => {
		setActiveKey(Array.isArray(key) ? key[0] : key)
		props.onChange?.(Array.isArray(key) ? key[0] : key)
	}
	return (
		<CollapseContainer>
			<Collapse
				activeKey={activeKey}
				bordered={false}
				style={styles}
				onChange={onChange}
			>
				<Collapse.Panel header={props.label} key={props.label} forceRender>
					{ props.children }
				</Collapse.Panel>
			</Collapse>
		</CollapseContainer>
	)
}
