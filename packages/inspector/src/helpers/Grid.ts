import { type Material, Mesh, BufferGeometry, ShaderMaterial, Color, Float32BufferAttribute, DoubleSide } from 'three'

export class Grid extends Mesh {
	public readonly name = 'InspectorGrid'

	constructor(color: number) {
		const geometry = new BufferGeometry()
		geometry.setAttribute('position', new Float32BufferAttribute([
			1, 0, 1,
			1, 0, -1,
			-1, 0, 1,
			-1, 0, 1,
			1, 0, -1,
			-1, 0, -1,
		], 3))
		geometry.setAttribute('uv', new Float32BufferAttribute([
			1, 1,
			1, 0,
			0, 1,
			0, 1,
			1, 0,
			0, 0
		], 2))
		const material = new ShaderMaterial({
			transparent: true,
			side: DoubleSide,
			uniforms: {
				color: { value: new Color().setHex(color) },
			},
			vertexShader: `
				varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4(position * 20.0, 1.0);
				}
			`,
			fragmentShader: `
				varying vec2 vUv;
				uniform vec3 color;

				float isGridLine(vec2 uv) {
					vec2 derivative = fwidth(uv);
					uv = fract(uv);
					uv = abs(abs(uv - 0.5) - 0.5);
					uv = uv / derivative;
					float minValue = min(uv.x, uv.y);
					float alpha = 1.0 - min(minValue, 1.0);
					return alpha;
				}

				void main() {
					gl_FragColor = vec4(color * isGridLine(vUv * 8.), isGridLine(vUv * 8.)) + vec4(color, isGridLine(vUv * 32.));
				}
			`,
		})
		super(geometry, material)
	}

	dispose() {
		this.geometry.dispose()
		;(this.material as Material).dispose()
	}
}
