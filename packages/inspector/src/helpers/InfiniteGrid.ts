import {
	type Material,
	Mesh,
	BufferGeometry,
	ShaderMaterial,
	Color,
	Float32BufferAttribute,
	DoubleSide,
	Camera,
	Scene,
	WebGLRenderer,
	Matrix4,
} from 'three'

export class InfiniteGrid extends Mesh {
	public name = 'InspectorInfiniteGrid'

	constructor(color: number) {
		const geometry = new BufferGeometry()
		geometry.setAttribute(
			'position',
			new Float32BufferAttribute([1, 1, 0, -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0, -1, -1, 0], 3)
		)

		const material = new ShaderMaterial({
			transparent: true,
			side: DoubleSide,
			uniforms: {
				cameraWorldMat: { value: new Matrix4() },
				color: { value: new Color().setHex(color) },
			},
			vertexShader: `
				uniform mat4 cameraWorldMat;
				varying mat4 projectionMat;
				varying vec3 nearPoint;
				varying vec3 farPoint;

				vec3 unprojectPoint(vec4 position) {
					vec4 unprojectedPoint = cameraWorldMat * inverse(projectionMatrix) * position;
					return unprojectedPoint.xyz / unprojectedPoint.w;
				}

				void main() {
					nearPoint = unprojectPoint(vec4(position.xy, -1.0, 1.0));
					farPoint = unprojectPoint(vec4(position.xy, 1.0, 1.0));
					projectionMat = projectionMatrix;
					gl_Position = vec4(position.xy, 1.0, 1.0);

				}
			`,
			fragmentShader: `
				varying vec3 nearPoint;
				varying vec3 farPoint;
				varying mat4 projectionMat;
				uniform vec3 color;
				uniform mat4 cameraWorldMat;

				float computeDepth(vec3 pos) {
					vec4 clipSpacePos = projectionMat * inverse(cameraWorldMat) * vec4(pos.xyz, 1.0);
					return ((clipSpacePos.z / clipSpacePos.w) + 1.) / 2.;
				}

				vec4 grid(vec3 fragPos3D, float scale) {
					vec2 coord = fragPos3D.xz * scale;
					vec2 derivative = fwidth(coord);
					vec2 grid = abs(fract(coord - 0.5) - 0.5) / derivative;
					float line = min(grid.x, grid.y);
					float minimumz = min(derivative.y, 1.0);
					float minimumx = min(derivative.x, 1.0);
					vec4 color = vec4(0.4, 0.4, 0.4, 1.0 - min(line, 1.0));
					return color;
				}

				void main() {
					float t = -nearPoint.y / (farPoint.y - nearPoint.y);
					vec3 fragPos3D = nearPoint + t * (farPoint - nearPoint);
					float depth = computeDepth(fragPos3D);
					gl_FragDepth = depth;
					float fading = max(0.0, (0.5 - depth));
					gl_FragColor = grid(fragPos3D, 0.2) * step(0.0, min(1.0, t));
					gl_FragColor.a *= 1. - pow(depth, 20.);
				}
			`,
		})
		super(geometry, material)
	}

	onBeforeRender(_: WebGLRenderer, __: Scene, camera: Camera): void {
		;(this.material as ShaderMaterial).uniforms.cameraWorldMat.value = camera.matrixWorld
	}

	dispose() {
		this.geometry.dispose()
		;(this.material as Material).dispose()
	}
}
