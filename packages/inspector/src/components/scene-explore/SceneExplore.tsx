import React, { useCallback, useContext, useMemo, useState, useEffect, ReactNode } from 'react'
import { Scene, Object3D, Group, Light } from 'three'
import { Tree, TreeProps, Input } from '@arco-design/web-react'
import { TreeDataType } from '@arco-design/web-react/es/Tree/interface'
import {
	GlobalContext,
	GlobalUtilsContext,
	globalUtilsContext,
	globalContext,
} from '../../contexts/global-context'
import { ObjectCommands } from '../tree-item-command/ObjectCommands'
import { SceneCommands } from '../tree-item-command/SceneCommands'
import IconBox from '../../assets/icons/box.svg?react'
import { isMesh, isGroup, isScene, isObject3D, isLight } from '../../utils/object'
import { LightCommands } from '../tree-item-command/LightCommands'
import './index.scss'


type TreeDataNode = TreeDataType & {
	key: string
	children: TreeDataNode[]
	commands: ReactNode
	name: string
}

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
		return <LightCommands light={object} />
	} else if (isMesh(object) || isGroup(object) || isObject3D(object)) {
		return <ObjectCommands object={object} />
	}
	return null
}

const renderIcon = (object: Object3D) => {
	if (isMesh(object)) {
		return (
			<IconBox
				name="box"
				width={10}
				height={10}
				style={{ marginTop: '-2px' }}
			/>
		)
	}
	if (isLight(object)) {
		return (
			<IconBox
				name="light"
				width={10}
				height={10}
				style={{ marginTop: '-2px' }}
			/>
		)
	}
	return null
}

const genTreeData = (object: Object3D): TreeDataNode => {
	const children: TreeDataNode[] = []
	if (object.children && object.children.length) {
		object.children.forEach((ch) => {
			if (ch.name.includes('Inspector')) {
				return
			}
			children.push(genTreeData(ch))
		})
	}
	const name = (object as Scene).isScene ? 'Scene' : getObjectName(object)
	object.name = name
	return {
		key: `${object.id}`,
		name,
		title: name,
		children,
		icon: renderIcon(object),
		commands: renderCommands(object),
	}
}

const search = (
	text: string,
	tree: TreeDataNode[]
): { tree: TreeDataNode[]; expandKeys: string[] } => {
	const expandKeys: string[] = []
	const dfsTree = (tree: TreeDataNode[]) => {
		const newTree: TreeDataNode[] = []
		for (let i = 0; i < tree.length; i++) {
			let added = false
			const node = tree[i]
			const cloned: TreeDataNode = { ...node, children: [] }
			if (node.name.toLowerCase().includes(text)) {
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
		return scene ? [genTreeData(scene)] : []
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

	const onEnter = useCallback(
		(value: string) => {
			const text = value.toLowerCase()
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
		(keys: string[], extra) => {
			if (!scene || treeData.length <= 0) {
				return
			}
			const key = extra.node.key as string
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
		<div className='three-inspector-explore'>
			<Input.Search
				size="small"
				allowClear
				style={{ width: '100%', padding: '0 12px', backgroundColor: '#1d1d1d', color: 'white' }}
				onPressEnter={(e) => {
					const value = (e.target as HTMLInputElement).value
					onEnter(value)
				}}
				onClear={() => onEnter('')}
			/>
			{treeData.length ? (
				<Tree
					treeData={treeData}
					onSelect={handleSelect}
					onExpand={handleExpand}
					style={{ backgroundColor: '#333' }}
					selectedKeys={selectedKeys}
					expandedKeys={expandedKeys}
					renderExtra={(node) => node.dataRef?.commands}
				/>
			) : null}
		</div>
	)
}
