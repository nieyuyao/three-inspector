import React, { useState, type ReactNode, useEffect } from 'react'
import Switch from '@arco-design/web-react/es/Switch'
import Collapse from '@arco-design/web-react/es/Collapse'
import './index.scss'

interface Props {
	label: string
	checked?: boolean
	children: ReactNode
	onCheckedChange?: (checked: boolean) => void
}


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
		<div className='three-inspector-cws'>
			<div className='collapse-switch'>
				<div>{props.label}</div>
				<Switch size="small" checked={switchChecked} onChange={toggleChecked}/>
			</div>
			<Collapse bordered={false} activeKey={activeKey} lazyload={false} >
				<Collapse.Item className='panel' name={props.label} header={null} showExpandIcon={false} key={props.label}>
					{ props.children }
				</Collapse.Item>
			</Collapse>
		</div>
	)
}
