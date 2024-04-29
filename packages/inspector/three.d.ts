/// <reference types="@types/three" />

interface onAfterRender {
	(
		renderer: THREE.WebGLRenderer,
		scene: THREE.Scene,
		camera: THREE.Camera,
		geometry: THREE.BufferGeometry,
		material: THREE.Material,
		group: THREE.Group,
	): void
}


