import React from 'react'
import { Tabs } from '@arco-design/web-react'
import { IconBug, IconTool } from '@arco-design/web-react/icon'
import { Properties } from './Properties'
import { Debug } from './Debug'
import { Tools } from './Tools'
import { Statistic } from './Statistic'
import IconProps from '../../assets/icons/props.svg?react'
import IconStatistic from '../../assets/icons/statistic.svg?react'
import './tabs.scss'


const tabs = [
	{
		key: 'Properties',
		title: <span title='Properties'>
      <IconProps className='tab-title-icon' />
    </span>,
		children: <Properties />,
	},
	{
		key: 'Debug',
		title: <span title='Debug'>
      <IconBug className='tab-title-icon' />
    </span>,
		children: <Debug />,
	},
	{
		key: 'Tools',
		title: <span title='Tools'>
      <IconTool className='tab-title-icon' />
    </span>,
		children: <Tools />,
	},
	{
		key: 'Statistic',
		title: <span title='Statistic'>
      <IconStatistic className='tab-title-icon' />
    </span>,
		children: <Statistic />,
	},
]

interface Props {
	className?: string
}

export const ActionTabs = () => {
	return (
		<div className='three-inspector-tabs'>
			<div className="resize-vertical" />
			<div className="resize-vertical-line" />
			<Tabs defaultActiveTab="Properties">
				{tabs.map((tab) => (
					<Tabs.TabPane key={tab.key} title={tab.title}>
						{tab.children}
					</Tabs.TabPane>
				))}
			</Tabs>
		</div>
	)
}
