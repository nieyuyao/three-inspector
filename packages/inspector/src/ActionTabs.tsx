import React from 'react'
import styled from '@emotion/styled'
import { Tabs } from '@arco-design/web-react'
import { IconBug, IconTool } from '@arco-design/web-react/icon'
import { Properties } from './components/tabs/Properties'
import { Debug } from './components/tabs/Debug'
import { Tools } from './components/tabs/Tools'
import { Statistic } from './components/tabs/Statistic'
import IconProps from './assets/icons/props.svg?react'
import IconStatistic from './assets/icons/statistic.svg?react'

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

	// tabs
	.arco-tabs {
		position: absolute;
		top: 4px;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 6px;
		background-color: #303030;
	}

	.arco-tabs-content {
		padding: 0 6px;
		height: calc(100% - 40px);
		overflow: auto;
	}

  .arco-tabs-content-item {
    overflow: unset;
  }

	.arco-tabs-header {
		display: flex;
		width: 100%;
		.arco-icon-hover {
			display: none;
		}
	}

	.arco-tabs-header-ink {
		background-color: #fff;
	}

	.arco-tabs-header-title {
		flex: 1;
		display: flex;
		justify-content: center;
		padding: 6px;
		color: var(--base-gray-font-color);
		&:hover {
			.arco-tabs-header-title-text::before {
				background-color: transparent !important;
			}
		}
		&.arco-tabs-header-title-active {
			color: var(--base-font-color);
		}
		.tab-title-icon {
			width: 26px;
			height: 26px;
		}
		.arco-tabs-header-title-text {
			display: inline-flex;
			align-items: center;
			margin: 0 !important;
			font-size: var(--base-font-size);
      color: var(--base-font-color);
			.arco-tabs-tab-icon {
				margin-inline-end: 6px !important;
			}
		}
	}

`

const tabs = [
	{
		key: 'Properties',
		title: <IconProps className='tab-title-icon' />,
		children: <Properties />,
	},
	{
		key: 'Debug',
		title: <IconBug className='tab-title-icon' />,
		children: <Debug />,
	},
	{
		key: 'Tools',
		title: <IconTool className='tab-title-icon' />,
		children: <Tools />,
	},
	{
		key: 'Statistic',
		title: <IconStatistic className='tab-title-icon' />,
		children: <Statistic />,
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
			<Tabs defaultActiveTab="Properties">
				{tabs.map((tab) => (
					<Tabs.TabPane key={tab.key} title={tab.title}>
						{tab.children}
					</Tabs.TabPane>
				))}
			</Tabs>
		</Container>
	)
}
