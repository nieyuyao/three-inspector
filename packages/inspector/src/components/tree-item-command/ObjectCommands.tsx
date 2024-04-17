import React, { useContext } from 'react'
import { LineSegments, WireframeGeometry } from 'three'
import type { Group, Mesh, Object3D } from 'three'
import { Visibility } from './Visibility'
import { CommandsContainer } from './CommandsContainer'
import { useState } from 'react'
import { globalContext } from '../../global-context'
import { useRef } from 'react'
import { Nullable } from '../../types'
import IconBSphere from '../../assets/icons/bsphere.svg?react'
import IconWireframe from '../../assets/icons/wireframe.svg?react'
import IconAxes from '../../assets/icons/axes.svg?react'
import IconBBox from '../../assets/icons/bbox.svg?react'
import { LocalAxesHelper } from '../../helpers/LocalAxes'
import { isMesh } from '../../utils/object'
import { BoundingSphere } from '../../helpers/BoundingSphere'
import { BoundingBox } from '../../helpers/BoundingBox'

interface Props {
	object: Mesh | Group | Object3D
}

const getColor = (visible: boolean) => {
	return visible ? 'var(--base-command-icon-selected-color)' : 'var(--base-command-icon-color)'
}

const wireframeObject = (target: Mesh): LineSegments => {
	const { geometry } = target
	const wireframe = new WireframeGeometry(geometry)
	const line = new LineSegments(wireframe)
	const mat = line.material as THREE.Material
	mat.depthTest = false
	target.add(line)
	wireframe.name = 'InspectorWireframe'
	return line
}

export const ObjectCommands = (props: Props) => {
	const { object } = props
	const { scene, camera } = useContext(globalContext)
	const wireframeLine = useRef<Nullable<LineSegments>>(null)
	const [wireframeVisible, setWireframeVisible] = useState<boolean>(false)
	const [axesVisible, setAxesVisible] = useState(false)
	const [bSphereVisible, setBSphereVisible] = useState(false)
	const [bboxVisible, setBBoxVisible] = useState(false)
	const toggleWireframe = () => {
		setWireframeVisible(!wireframeVisible)
		if (!wireframeVisible) {
			wireframeLine.current = wireframeObject(object as Mesh)
		} else {
			wireframeLine.current?.removeFromParent()
		}
	}
	const toggleAxes = () => {
		setAxesVisible(!axesVisible)
		if (!scene || !camera) {
			return
		}
		if (!axesVisible) {
			scene.add(new LocalAxesHelper(object, camera))
		} else {
			scene.getObjectByName('InspectorLocalAxes')?.removeFromParent()
		}
	}

	const onVisibilityChanged = (visible: boolean) => (object.visible = visible)

	const toggleBSphere = () => {
		setBSphereVisible(!bSphereVisible)
		if (!object) {
			return
		}
		if (!bSphereVisible) {
			object.add(new BoundingSphere(object as Mesh, 20, 20))
		} else {
			object.getObjectByName('InspectorBoundingSphere')?.removeFromParent()
		}
	}
	const toggleBBox = () => {
		setBBoxVisible(!bboxVisible)
		if (!object) {
			return
		}
		if (!bboxVisible) {
			object.add(new BoundingBox(object as Mesh))
		} else {
			object.getObjectByName('InspectorBoundBox')?.removeFromParent()
		}
	}

	return (
		<CommandsContainer>
			{isMesh(object) && (
				<IconWireframe
					color={getColor(wireframeVisible)}
					className="three-inspector-icon"
					style={{
						margin: '0 6px',
					}}
					onClick={toggleWireframe}
				/>
			)}
			{isMesh(object) && (
				<IconAxes
					className="three-inspector-icon"
					onClick={toggleAxes}
					color={getColor(axesVisible)}
				/>
			)}
			{isMesh(object) && (
				<IconBSphere
					className="three-inspector-icon"
					onClick={toggleBSphere}
					color={getColor(bSphereVisible)}
				/>
			)}
			{isMesh(object) && (
				<IconBBox
					className="three-inspector-icon"
					onClick={toggleBBox}
					color={getColor(bboxVisible)}
				/>
			)}
			<Visibility
				visible={object.visible}
				onChange={onVisibilityChanged}
				style={{ margin: '0 6px' }}
			/>
		</CommandsContainer>
	)
}
