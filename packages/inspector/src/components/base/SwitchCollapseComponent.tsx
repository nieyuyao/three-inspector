import React, { useState, type ReactNode, useEffect } from 'react'
import Collapse from 'antd/es/collapse'
import Switch from 'antd/es/switch'
import styled from '@emotion/styled'

interface Props {
	label: string
	checked?: boolean
	children: ReactNode
	onCheckedChange?: (checked: boolean) => void
}

const Container = styled.div`
	margin-top: 4px;
	padding: 6px;
	color: #fff;
	font-size: var(--base-font-size);
	background-color: var(--base-tab-grid-bg-color);
	border-radius: 8px;
	.collapse-switch {
		display: flex;
		justify-content: space-between;
	}
	.panel > .ant-collapse-header {
		display: none !important;
	}
	.panel > .ant-collapse-content > .ant-collapse-content-box {
		padding: 4px !important;
	}
`

export const SwitchCollapseComponent = (props: Props) => {
	const [switchChecked, setSwitchChecked] = useState(props.checked ?? false)
	const [activeKey, setActiveKey] = useState(props.checked ? props.label : undefined)
	const toggleChecked = (checked: boolean) => {
		setSwitchChecked(checked)
		checked ? setActiveKey(props.label) : setActiveKey(undefined)
	}
	useEffect(() => {
		setSwitchChecked(props.checked ?? false)
	}, [props.checked])
	return (
		<Container>
			<div className='collapse-switch'>
				<div>{props.label}</div>
				<Switch size="small" checked={switchChecked} onChange={toggleChecked}/>
			</div>
			<Collapse bordered={false} activeKey={activeKey}>
				<Collapse.Panel className='panel' header={null} showArrow={false} key={props.label} forceRender>
					{props.children}
				</Collapse.Panel>
			</Collapse>
		</Container>
	)
}
