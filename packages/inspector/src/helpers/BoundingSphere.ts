import { BufferAttribute, BufferGeometry, LineBasicMaterial, LineSegments, type Mesh } from 'three'

export class BoundingSphere extends LineSegments<BufferGeometry, LineBasicMaterial> {
	public readonly name = 'InspectorBoundingSphere'

	constructor(target: Mesh, widthSegments = 2, heightSegments = 2, color = 0xffffff) {
		const geometry = new BufferGeometry()
		const material = new LineBasicMaterial({
			color,
			linewidth: 1,
		})
		super(geometry, material)
		this.createBoundingSphere(target, widthSegments, heightSegments)
	}

	private createBoundingSphere(target: Mesh, widthSegments: number, heightSegments: number) {
		if (!target.geometry.boundingSphere) {
			target.geometry.computeBoundingSphere()
		}
		if (!target.geometry.boundingSphere) {
			return
		}
		const { geometry } = this
		const { center, radius } = target.geometry.boundingSphere
		const dwRadian = 2 * Math.PI / widthSegments
		const dhRadian = Math.PI / heightSegments
		const positions: number[] = []
		const zCoords: number[] = []
		const xyProjectRadius: number[] = []
		for (let i = 0; i <= heightSegments; i++) {
			zCoords.push(center.z + radius * Math.cos(dhRadian * i))
			xyProjectRadius.push(radius * Math.sin(dhRadian * i))
		}
		const lastPositions: number[] = []
		for (let i = 0; i <= widthSegments; i++) {
			let x = center.x + xyProjectRadius[0] * Math.sin(i * dwRadian)
			let y = center.y + xyProjectRadius[0] * Math.cos(i * dwRadian)
			for (let j = 0; j < zCoords.length; j++) {
				const z = zCoords[j]
				const nextX = center.x + xyProjectRadius[j + 1] * Math.sin(i * dwRadian)
				const nextY = center.y + xyProjectRadius[j + 1] * Math.cos(i * dwRadian)
				const nextZ = zCoords[j + 1]
				if (j === zCoords.length - 1) {
					this.setPositionsByIndex(lastPositions, j, x, y, z)
					break
				}
				if (i > 0) {
					positions.push(
						x, y, z,
						...this.getPositionsByIndex(lastPositions, j)
					)
					if (i === 1) {
						positions.push(
							...this.getPositionsByIndex(lastPositions, j),
							...this.getPositionsByIndex(lastPositions, j + 1)
						)
					}
					positions.push(
						...this.getPositionsByIndex(lastPositions, j + 1),
						nextX, nextY, nextZ,
					)
					positions.push(
						nextX, nextY, nextZ,
						x, y, z,
					)
				}
				this.setPositionsByIndex(lastPositions, j, x, y, z)
				x = nextX
				y = nextY
			}
		}
		geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3))
	}

	private getPositionsByIndex(positions: number[], index: number) {
		return [positions[3 * index], positions[3 * index + 1], positions[3 * index + 2]]
	}

	private setPositionsByIndex(positions: number[], index: number, x: number, y: number, z: number) {
		positions[3 * index] = x
		positions[3 * index + 1] = y
		positions[3 * index + 2] = z
	}
}
