import React, { useState, type CSSProperties } from 'react'
import { Collapse } from '@arco-design/web-react'
import './index.scss'

interface Props {
	label: string
	defaultOpened?: boolean
	children?: React.ReactNode
}

const styles: CSSProperties = {
	margin: '0 6px',
}

export const CollapseComponent = (props: Props) => {
	const [defaultActiveKey] = useState(props.defaultOpened ? props.label : undefined)
	return (
		<div className='three-inspector-collapse'>
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
		</div>
	)
}
