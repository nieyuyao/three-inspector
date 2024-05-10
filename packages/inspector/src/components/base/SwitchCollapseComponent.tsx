import React, { useState, type ReactNode, useEffect } from 'react'
import { Collapse, Switch } from '@arco-design/web-react'
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
	.arco-collapse  {
		margin: 0 !important;
    overflow: unset;
    &::after {
      display: none;
    }
	}

	.panel {
		.arco-collapse-item-header {
			font-size: var(--base-font-size);
			color: var(--base-font-color) !important;
			background-color: #303030;
			border: none;
			padding: 0;
		}

		.arco-collapse-item-content {
			padding: 0 !important;
			font-size: var(--base-font-size);
			color: var(--base-font-color) !important;
			background-color: var(--base-tab-grid-bg-color);
		}

		.arco-collapse-item-content-box {
			padding: 6px !important;
		}
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
			<Collapse bordered={false} activeKey={activeKey} lazyload={false} >
				<Collapse.Item className='panel' name={props.label} header={null} showExpandIcon={false} key={props.label}>
					{ props.children }
				</Collapse.Item>
			</Collapse>
		</Container>
	)
}
