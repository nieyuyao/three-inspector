// measure distance
import {
	type Camera,
	type Scene,
	Raycaster,
	Vector2,
	Vector3,
	Line,
	BufferGeometry,
	LineBasicMaterial,
	Color,
} from 'three'
import RulerIcon from '../assets/icons/ruler.svg'
import { convertMouseCoord2NDC } from '../utils/vector'

interface Point {
	x: number
	y: number
}


export class Measure {
	private camera: Camera

	private scene: Scene

	private dom: HTMLElement

	private isMouseDown = false

	private rayCaster: Raycaster

	private mousedownPos: Point = { x: 0, y: 0 }

	private line: Line

	private rulerDom: HTMLDivElement

	private distanceDom: HTMLDivElement

	public color: number

	constructor(camera: Camera, scene: Scene, dom: HTMLElement, color = 0xffffff) {
		this.camera = camera
		this.scene = scene
		this.dom = dom
		this.color = color
		this.rayCaster = new Raycaster()
		this.line = new Line(
			new BufferGeometry(),
			new LineBasicMaterial({ color: this.color, depthTest: false, depthWrite: false })
		)
		this.line.frustumCulled = false
		this.line.name = 'InspectorMeasureLine'
		this.line.renderOrder = 999
		this.scene.add(this.line)
		this.rulerDom = this.createRuler()
		this.distanceDom = this.createDistanceDom()
		dom.addEventListener('pointerdown', this.handleMouseDownEvent, true)
		dom.addEventListener('pointermove', this.handleMouseMoveEvent, true)
		dom.addEventListener('pointerup', this.handleMouseUpEvent, true)
	}

	private handleMouseDownEvent = (event: MouseEvent) => {
		event.stopPropagation()
		this.isMouseDown = true
		this.mousedownPos = this.getMousePosition(event)
	}

	private getMousePosition = (event: MouseEvent) => {
		const { target, clientX, clientY } = event
		const br = (target as HTMLElement).getBoundingClientRect()
		return { x: clientX - br.x, y: clientY - br.y }
	}

	private handleMouseMoveEvent = (event: MouseEvent) => {
		event.preventDefault()
		event.stopPropagation()
		if (!this.isMouseDown) {
			return
		}
		const { dom, mousedownPos } = this
		const movePos = this.getMousePosition(event)
		const sp = convertMouseCoord2NDC(mousedownPos, dom)
		const ep = convertMouseCoord2NDC(movePos, dom)
		const p1 = this.getIntersectPoint(sp)
		const p2 = this.getIntersectPoint(ep)
		this.drawLine(p1, p2)
		const distance = p1.distanceTo(p2)

		const dx = movePos.x - mousedownPos.x
		const dy = movePos.y - mousedownPos.y
		const dir = new Vector2(dx, dy).normalize()
		const nor = this.pickNormal(dir)
		const up = new Vector2(0, -1)
		const crossed = nor.cross(up)
		const angle = (Math.asin(crossed) / Math.PI) * 180 * -1
		this.drawRuler(this.mousedownPos, movePos, dir, nor, angle)
		this.drawDistance(this.mousedownPos, movePos, distance, dir, nor, angle)
	}

	private pickNormal(dir: Vector2) {
		const up = new Vector2(0, -1)
		const nor1 = new Vector2(dir.y, -dir.x).normalize()
		const nor2 = nor1.clone().multiplyScalar(-1)
		return nor1.dot(up) > nor2.dot(up) ? nor1 : nor2
	}

	private handleMouseUpEvent = (event: MouseEvent) => {
		event.stopPropagation()
		this.isMouseDown = false
		this.line.visible = false
		this.rulerDom.style.display = 'none'
		this.distanceDom.style.display = 'none'
	}

	private createRuler() {
		const ruler = document.createElement('div')
		ruler.className = 'inspector-ruler-icon'
		ruler.style.display = 'none'
		ruler.style.color = `#${new Color(this.color).getHexString()}`
		ruler.innerHTML = RulerIcon
		document.body.appendChild(ruler)
		return ruler
	}


	private drawRuler(_: Point, end: Point, dir: Vector2, nor: Vector2, angle: number) {
		this.rulerDom.style.display = 'block'
		// ruler normal
		this.rulerDom.style.left = `${end.x - 8 + (nor.x - dir.x) * 20}px`
		this.rulerDom.style.top = `${end.y - 8 + (dir.y - nor.y) * 12}px`
		this.rulerDom.style.transform = `rotate(${angle}deg)`
	}

	private createDistanceDom() {
		const distanceDom = document.createElement('div')
		distanceDom.className = 'inspector-ruler-distance'
		distanceDom.innerHTML = ''
		distanceDom.style.display = 'none'
		distanceDom.style.color = `#${new Color(this.color).getHexString()}`
		document.body.appendChild(distanceDom)
		return distanceDom
	}

	private drawDistance(start: Point, end: Point, distance: number, _: Vector2, nor: Vector2, angle: number) {
		const { distanceDom } = this
		distanceDom.style.display = 'block'
		distanceDom.innerText = `${distance}`
		const center = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 }
		distanceDom.innerText = distance.toFixed(2)
		distanceDom.style.left = `${center.x - this.distanceDom.clientWidth / 2 + nor.x * 10}px`
		distanceDom.style.top = `${center.y - this.distanceDom.clientHeight / 2 + nor.y * 10}px`
		distanceDom.style.transform = `rotate(${angle}deg)`
	}

	private getIntersectPoint = (p: Vector2) => {
		const { rayCaster, camera, scene } = this
		rayCaster.setFromCamera(p, camera)
		const intersects = rayCaster.intersectObjects(scene.children)
		return intersects.length ? intersects[0].point : new Vector3(p.x, p.y, 0).unproject(camera)
	}

	private drawLine(p1: Vector3, p2: Vector3) {
		const { line } = this
		if (!line.visible) {
			line.visible = true
		}
		// draw p1 to p2
		line.geometry.setFromPoints([p1, p2])
		line.geometry.attributes.position.needsUpdate = true
	}

	dispose() {
		this.line.geometry.dispose()
		;(this.line.material as LineBasicMaterial).dispose()
		this.scene.getObjectByName('inspector-ruler-icon')?.removeFromParent()
		document.body.querySelector('.inspector-ruler-icon')?.remove()
		document.body.querySelector('.inspector-ruler-distance')?.remove()
		this.dom.removeEventListener('pointerdown', this.handleMouseDownEvent, true)
		this.dom.removeEventListener('pointermove', this.handleMouseMoveEvent, true)
		this.dom.removeEventListener('pointerup', this.handleMouseUpEvent, true)
	}

	setColor(color: number) {
		this.color = color
		const c = new Color(color)
		const rgb = `#${c.getHexString()}`
		this.rulerDom.style.color = rgb
		this.distanceDom.style.color = rgb
		;(this.line.material as LineBasicMaterial).color = c
	}
}
