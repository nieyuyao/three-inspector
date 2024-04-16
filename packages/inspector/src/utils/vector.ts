import { Vector2 } from 'three'

export const convertMouseCoord2NDC = (mouseCoords: { x: number; y: number }, dom: HTMLElement): Vector2 => {
	const p = new Vector2(1, 1)
	p.x = (2 * mouseCoords.x) / dom.clientWidth - 1
	p.y = 1 - (2 * mouseCoords.y) / dom.clientHeight
	return p
}
