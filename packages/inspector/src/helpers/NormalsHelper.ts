import { Mesh, LineSegments, BufferGeometry, LineBasicMaterial, Vector3, Float32BufferAttribute } from 'three'


export class NormalsHelper extends LineSegments<BufferGeometry, LineBasicMaterial> {
	public readonly name = 'InspectorNormalsHelper'

	public material: LineBasicMaterial

	public length: number

	public target: Mesh

	constructor(target: Mesh, length = 0.5, color = 0xffffff) {
		const geometry = new BufferGeometry()
		const material = new LineBasicMaterial( {
			color,
			linewidth: 1,
		} );
		super(geometry, material)
		this.target = target
		this.length = length
		this.updateGeometry()
	}

	updateGeometry() {
		const { geometry, target } = this
		const normalAttr = target.geometry.getAttribute('normal')
		if (normalAttr.count <= 0) {
			return
		}
		const positions: number[] = []
		const positionAttr = target.geometry.getAttribute('position')
		const pos = new Vector3()
		const normal = new Vector3()
		const temp: number[] = []
		for (let i = 0; i < positionAttr.count; i++) {
			pos.fromBufferAttribute(positionAttr, i)
			positions.push(...pos.toArray(temp))
			normal.fromBufferAttribute(normalAttr, i).normalize().multiplyScalar(this.length).add(pos)
			positions.push(...normal.toArray(temp))
		}
		geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
	}

	dispose() {
		this.geometry.dispose()
		this.material.dispose()
	}
}
