import { Texture, type Material } from 'three'
import uvGridImg from '../assets/imgs/uv_grid_opengl.jpeg'
import { Nullable } from '../types'

export class UVHelper<T extends Material = Material> {
	private originalTexture: Texture

	private material: T

	private uvGridTexture: Nullable<Texture> = null

	constructor(material: T) {
		this.material = material
		const img = document.createElement('img')
		const texture = new Texture(img)
		// @ts-ignore
		this.originalTexture = material.map
		img.onload = () => {
			texture.needsUpdate = true
			this.uvGridTexture = texture
		}
		img.src = uvGridImg
	}

	updateMaterial(material: T) {
		this.material = material
		// @ts-ignore
		this.originalTexture = material.map
	}

	public debug() {
		// @ts-ignore
		this.material.map = this.uvGridTexture
		this.material.needsUpdate = true
	}

	public reset() {
		// @ts-ignore
		this.material.map = this.originalTexture
		this.material.needsUpdate = true
	}

	dispose() {
		this.uvGridTexture?.dispose()
	}
}
