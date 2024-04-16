import React, { useCallback, useContext, type ChangeEvent, useMemo, useState, useEffect } from 'react'
import { Scene, Object3D, Group, Light } from 'three'
import Tree, { DataNode, TreeProps } from 'antd/es/tree'
import { DownOutlined } from '@ant-design/icons'
import { GlobalContext, GlobalUtilsContext, globalUtilsContext, globalContext } from './global-context'
import { ObjectCommands } from './components/tree-item-command/ObjectCommands'
import Search from 'antd/es/input/Search'
import { SceneCommands } from './components/tree-item-command/SceneCommands'
import styled from '@emotion/styled'
import { SVGComponent } from './components/base/SVGComponent'
import { isMesh, isGroup, isScene, isObject3D, isLight } from './utils/object'
import { LightCommands } from './components/tree-item-command/LightComands'

const ExploreContainer = styled.div`
	flex: 1;
	min-height: 220px;
	padding: 4px;
	border-radius: 6px;
	background-color: #303030;
	overflow-x: hidden;
	overflow-y: auto;
	box-sizing: border-box;

	.ant-input-group-wrapper {
		padding-top: 6px !important;
		padding-bottom: 6px !important;
		background-color: #303030 !important;

		.ant-input-affix-wrapper {
			border: none;
		}

		input {
			font-size: 12px;
			height: 24px;
		}
	}
	.ant-tree-list {
		padding: 0 6px;
		color: var(--base-font-color);
		.ant-tree-treenode-motion {
			width: 100%;
		}

		.ant-tree-treenode {
			width: 100%;
			padding-top: 4px;
		}

		.ant-tree-node-content-wrapper {
			width: calc(100% - 24px);
		}

		.ant-tree-treenode-selected {
			background-color: rgba(230, 244, 255, 0.1);
		}

		.ant-tree-node-selected {
			border-radius: 0;
			background-color: transparent !important;
		}

		.ant-tree-title {
			display: flex;
			align-items: center;
			width: 100%;
		}
	}
`

type TreeDataNode = DataNode & { name: string; children: TreeDataNode[]; key: string }

const getObjectName = (object: Object3D) => {
	if ((object as Group).isGroup) {
		return `Group-${object.id}`
	}
	if ((object as Light).isLight) {
		return `Light-${object.id}`
	}
	return object.name || `Object-${object.id}`
}


const renderCommands = (object: Object3D) => {
	if (isScene(object)) {
		return <SceneCommands scene={object} />
	} else if (isLight(object)) {
		return <LightCommands light={object}/>
	} else if (isMesh(object) || isGroup(object) || isObject3D(object)) {
		return <ObjectCommands object={object} />
	}
	return null
}

const renderIcon = (object: Object3D) => {
	if (isMesh(object)) {
		return <SVGComponent name="box" width={10} height={10} color="rgba(255, 255, 255, 0.6)" style={{marginTop: '-2px'}} />
	}
	if (isLight(object)) {
		return <SVGComponent name="light" width={10} height={10} color="rgba(255, 255, 255, 0.6)" style={{marginTop: '-2px'}}/>
	}
	return null
}

const buildTreeData = (object: Object3D): TreeDataNode => {
	const children: TreeDataNode[] = []
	if (object.children && object.children.length) {
		object.children.forEach((ch) => {
			if (ch.name.includes('Inspector')) {
				return
			}
			children.push(buildTreeData(ch))
		})
	}
	const name = (object as Scene).isScene ? 'Scene' : getObjectName(object)
	object.name = name
	return {
		key: `${object.id}`,
		name: name.toLowerCase(),
		title: (
			<>
				{renderIcon(object)}
				<span style={{ fontSize: 'var(--base-font-size)' }}>{name}</span>
				{renderCommands(object)}
			</>
		),
		children,
	}
}

const search = (text: string, tree: TreeDataNode[]): { tree: TreeDataNode[]; expandKeys: string[] } => {
	const expandKeys: string[] = []
	const dfsTree = (tree: TreeDataNode[]) => {
		const newTree: TreeDataNode[] = []
		for (let i = 0; i < tree.length; i++) {
			let added = false
			const node = tree[i]
			const cloned: TreeDataNode = { ...node, children: [] }
			if (node.name.includes(text)) {
				newTree.push(cloned)
				added = true
				expandKeys.push(node.key)
			}
			const children = dfsTree(node.children)
			if (children.length) {
				cloned.children = children
				if (!added) {
					newTree.push(cloned)
					expandKeys.push(cloned.key)
				}
			}
		}

		return newTree
	}
	return { tree: dfsTree(tree), expandKeys }
}

interface Props {
	className?: string
}

export const SceneExplore = (props: Props) => {
	const { scene } = useContext<GlobalContext>(globalContext)
	const { updateTargetObject } = useContext<GlobalUtilsContext>(globalUtilsContext)
	const [expandedKeys, setExpandedKeys] = useState<string[]>([])
	const [selectedKeys, setSelectedKeys] = useState<string[]>([])
	const [treeData, setTreeData] = useState<TreeDataNode[]>([])

	const rawTreeData = useMemo(() => {
		return scene ? [buildTreeData(scene)] : []
	}, [scene])

	const resetTree = useCallback(() => {
		setTreeData(rawTreeData)
		const keys = rawTreeData.map((node) => node.key)
		setSelectedKeys(keys)
		setExpandedKeys(keys)
	}, [rawTreeData])

	useEffect(() => {
		resetTree()
	}, [scene, resetTree])

	const onSearch = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const text = event.target.value.toLowerCase()
			if (!text) {
				resetTree()
				return
			}
			const { tree, expandKeys } = search(text, rawTreeData)
			setTreeData(tree)
			setSelectedKeys(expandKeys)
			setExpandedKeys(expandKeys)
		},
		[rawTreeData, scene]
	)

	const handleSelect = useCallback<NonNullable<TreeProps['onSelect']>>(
		(keys: string[], info) => {
			if (!scene || treeData.length <= 0) {
				return
			}
			const key = info.node.key as string
			if (selectedKeys[0] === key) {
				return
			}
			setSelectedKeys([key])
			const object = scene.getObjectById(Number(keys[0]))
			if (object) {
				window.__target_object__ = object
				updateTargetObject(object)
			}
		},
		[treeData, selectedKeys, scene]
	)

	const handleExpand = useCallback<NonNullable<TreeProps['onExpand']>>((keys: string[]) => {
		setExpandedKeys(keys)
	}, [])

	return (
		<ExploreContainer className={props.className}>
			<Search
				size="small"
				allowClear
				onChange={onSearch}
				style={{ width: '100%', padding: '0 12px', backgroundColor: '#1d1d1d', color: 'white' }}
			/>
			<Tree
				switcherIcon={<DownOutlined />}
				treeData={treeData}
				onSelect={handleSelect}
				onExpand={handleExpand}
				style={{ backgroundColor: '#333' }}
				selectedKeys={selectedKeys}
				expandedKeys={expandedKeys}
			/>
		</ExploreContainer>
	)
}
