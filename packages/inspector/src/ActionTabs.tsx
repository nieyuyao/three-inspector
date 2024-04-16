import React from 'react'
import styled from '@emotion/styled'
import Tabs from 'antd/es/tabs'
import type { TabsProps } from 'antd'
import AlignLeftOutlined from '@ant-design/icons/AlignLeftOutlined'
import BugOutlined from '@ant-design/icons/BugOutlined'
import ToolOutlined from '@ant-design/icons/ToolOutlined'
import PieChartOutlined from '@ant-design/icons/PieChartOutlined'
import { Properties } from './components/tabs/Properties'
import { Debug } from './components/tabs/Debug'
import { Tools } from './components/tabs/Tools'
import { Statistic } from './components/tabs/Statistic'

const Container = styled.div`
	position: relative;
	width: 100%;
	box-sizing: border-box;
	overflow: hidden;

	.resize-vertical {
		width: 16px;
		height: 480px;
		min-height: 360px;
		opacity: 0;
		resize: vertical;
		transform: scale(100, -1);
		overflow: scroll;
	}

	.resize-vertical-line {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		opacity: 0;
		pointer-events: none;
	}

	.ant-tabs {
		position: absolute;
		top: 4px;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 6px;
		background-color: #303030;
	}

	.ant-tabs-content-holder {
		padding: 0 6px;
		overflow: auto;
	}

	.ant-tabs-nav {
		margin-bottom: 8px;
	}

	.ant-tabs-nav-operations {
		display: none !important;
	}

	.ant-tabs-nav-list {
		width: 100%;
	}

	.ant-tabs-tab {
		flex: 1;
		padding: 6px 4px;
		margin: 0 !important;
		font-size: var(--base-font-size);
		color: var(--base-font-color);
		.ant-tabs-tab-icon {
			margin-inline-end: 6px !important;
		}
	}
`

const tabs: TabsProps['items'] = [
	{
		key: 'Properties',
		label: 'Properties',
		children: <Properties />,
		icon: <AlignLeftOutlined />,
	},
	{
		key: 'Debug',
		label: 'Debug',
		children: <Debug />,
		icon: <BugOutlined />,
	},
	{
		key: 'Tools',
		label: 'Tools',
		children: <Tools />,
		icon: <ToolOutlined />,
	},
	{
		key: 'Statistic',
		label: 'Statistic',
		children: <Statistic />,
		icon: <PieChartOutlined />,
	},
]

interface Props {
	className?: string
}

export const ActionTabs = (props: Props) => {
	return (
		<Container className={props.className}>
			<div className="resize-vertical" />
			<div className="resize-vertical-line" />
			<Tabs defaultActiveKey="Properties" items={tabs} />
		</Container>
	)
}
