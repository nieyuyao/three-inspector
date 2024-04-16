import { Color } from 'three'
import { type RgbColor } from 'react-colorful'

export const color2RgbaColor = (c: Color) => {
	return { r: c.r * 255, g: c.g * 255, b: c.b * 255, a: 1 }
}

export const rbgColor2Color = (c: RgbColor) => {
	return new Color(c.r / 255, c.g / 255, c.b / 255)
}
