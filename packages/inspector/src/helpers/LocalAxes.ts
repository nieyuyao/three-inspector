import {
	Object3D,
	ConeGeometry,
	MeshBasicMaterial,
	Vector3,
	Color,
	Mesh,
	CylinderGeometry,
	DoubleSide,
} from 'three'
import type { Camera, PerspectiveCamera } from 'three'
import { isOrthographicCamera } from '../utils/object'

export interface Params {
	length?: number
}

export class LocalAxesHelper extends Object3D {
	public readonly name = 'InspectorLocalAxes'

	private axisLength = 1

	private target: Object3D

	private camera: Camera

	constructor(target: Object3D, camera: Camera, params?: Params) {
		super()
		this.target = target
		this.camera = camera
		this.axisLength = params?.length ?? 1
		this.create()
	}

	private create() {
		// X
		this.createAxis(new Color(1, 0, 0), new Vector3(0, 0, -1))
		// Y
		this.createAxis(new Color(0, 1, 0), new Vector3(0, 1, 0))
		// Z
		this.createAxis(new Color(0, 0, 1), new Vector3(1, 0, 0))
	}

	followTarget() {
		this.position.copy(this.target.position)
		this.rotation.copy(this.target.rotation)
	}

	private createAxis(color: Color, rotateAxis: Vector3) {
		const mat = new MeshBasicMaterial({ color, depthTest: false, side: DoubleSide })
		// line
		const line = new Mesh(new CylinderGeometry(0.02, 0.02, this.axisLength, 10), mat)
		// adjust line direction
		line.quaternion.setFromAxisAngle(rotateAxis, Math.PI / 2)
		line.translateY(this.axisLength / 2)
		this.add(line)

		// arrow
		const arrow = new Mesh(new ConeGeometry(0.06, 0.2, 10), mat)
		// adjust arrow direction
		arrow.quaternion.setFromAxisAngle(rotateAxis, Math.PI / 2)
		arrow.translateY(this.axisLength)
		this.add(arrow)
	}

	updateMatrixWorld(force: boolean) {
		this.followTarget()
		let factor = 1
		if (isOrthographicCamera(this.camera)) {
			factor = (this.camera.top - this.camera.bottom) / this.camera.zoom
		} else {
			const camera = this.camera as PerspectiveCamera
			const worldPosition = new Vector3()
			this.getWorldPosition(worldPosition)
			const cameraWorldPosition = new Vector3()
			camera.getWorldPosition(cameraWorldPosition)
			factor = worldPosition.distanceTo(cameraWorldPosition) * Math.tan(camera.fov  * Math.PI / 360) / camera.zoom
		}

		this.scale.set(1, 1, 1).multiplyScalar(factor * 0.2)
		super.updateMatrixWorld(force)
	}
}
