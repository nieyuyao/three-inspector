import React, { useContext } from 'react'
import { LineSegments, WireframeGeometry } from 'three'
import type { Group, Mesh, Object3D } from 'three'
import { Visibility } from './Visibility'
import WireFrame from '@ant-design/icons/GlobalOutlined'
import { CommandsContainer } from './CommandsContainer'
import { useState } from 'react'
import { globalContext } from '../../global-context'
import { useRef } from 'react'
import { Nullable } from '../../types'
import { SVGComponent } from '../base/SVGComponent'
import { LocalAxesHelper } from '../../helpers/LocalAxes'
import { isMesh } from '../../utils/object'
import { BoundingSphere } from '../../helpers/BoundingSphere'
import { BoundingBox } from '../../helpers/BoundingBox'
import { defaultIconColor, grayIconColor } from '../../constants'

interface Props {
	object: Mesh | Group | Object3D
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

	const onVisibilityChanged = (visible: boolean) => object.visible = visible

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
		if (!bSphereVisible) {
			object.add(new BoundingBox(object as Mesh))
		} else {
			object.getObjectByName('InspectorBoundBox')?.removeFromParent()
		}
	}
	return (
		<CommandsContainer>
			{isMesh(object) && (
				<WireFrame
					style={{ margin: '0 6px', color: wireframeVisible ? defaultIconColor : grayIconColor }}
					onClick={toggleWireframe}
				/>
			)}
			{isMesh(object) && (
				<SVGComponent name="axes" color={axesVisible ? defaultIconColor : grayIconColor} onClick={toggleAxes} />
			)}
			{isMesh(object) && (
				<SVGComponent name="bsphere" color={bSphereVisible ? defaultIconColor : grayIconColor} onClick={toggleBSphere} />
			)}
			{isMesh(object) && (
				<SVGComponent name="bbox" color={bboxVisible ? defaultIconColor : grayIconColor} onClick={toggleBBox} />
			)}
			<Visibility visible={object.visible} onChange={onVisibilityChanged} style={{ margin: '0 6px' }} />
		</CommandsContainer>
	)
}
