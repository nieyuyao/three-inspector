// bound box visualisation

import { BufferAttribute, BufferGeometry, LineBasicMaterial, LineSegments, type Mesh } from 'three'

export class BoundingBox extends LineSegments<BufferGeometry, LineBasicMaterial> {
	public readonly name = 'InspectorBoundBox'

	constructor(target: Mesh, color = 0xffffff) {
		const geometry = new BufferGeometry()
		const material = new LineBasicMaterial( {
			color,
			linewidth: 1,
		} );
		super(geometry, material)
		this.createBBox(target)
	}

	private createBBox(target: Mesh) {
		if (!target.geometry.boundingBox) {
			target.geometry.computeBoundingBox()
		}
		if (!target.geometry.boundingBox) {
			return
		}
		const { geometry } = this
		const { x: minX, y: minY, z: minZ } = target.geometry.boundingBox.min
		const { x: maxX, y: maxY, z: maxZ } = target.geometry.boundingBox.max
		const positions: number[] = []
		// two faces vertical with x
		let temp: number[] = [maxX, minX]
		for (let i = 0; i < 2; i++) {
			positions.push(temp[i], maxY, maxZ)
			positions.push(temp[i], minY, maxZ)
			//
			positions.push(temp[i], minY, maxZ)
			positions.push(temp[i], minY, minZ)
			//
			positions.push(temp[i], minY, minZ)
			positions.push(temp[i], maxY, minZ)
			//
			positions.push(temp[i], maxY, minZ)
			positions.push(temp[i], maxY, maxZ)
		}
		// two faces vertical with y
		temp = [maxY, minY]
		for (let i = 0; i < 2; i++) {
			positions.push(minX, temp[i], minZ)
			positions.push(minX, temp[i], maxZ)
			//
			positions.push(minX, temp[i], maxZ)
			positions.push(maxX, temp[i], maxZ)
			//
			positions.push(maxX, temp[i], maxZ)
			positions.push(maxX, temp[i], minZ)
			//
			positions.push(maxX, temp[i], minZ)
			positions.push(minX, temp[i], minZ)
			//
			positions.push(minX, temp[i], minZ)
			positions.push(minX, temp[i], maxZ)
		}
		// two faces vertical with z
		temp = [maxZ, minZ]
		for (let i = 0; i < 2; i++) {
			positions.push(minX, maxY, temp[i])
			positions.push(minX, minY, temp[i])
			//
			positions.push(minX, minY, temp[i])
			positions.push(maxX, minY, temp[i])
			//
			positions.push(maxX, minY, temp[i])
			positions.push(maxX, maxY, temp[i])
			//
			positions.push(maxX, maxY, temp[i])
			positions.push(minX, maxY, temp[i])
		}
		geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3))
	}

	dispose() {
		this.geometry.dispose
		this.material.dispose()
	}
}
