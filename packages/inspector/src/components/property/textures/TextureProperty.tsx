import React, { useCallback, useEffect, useRef } from 'react'
import { CollapseComponent } from '../../base/CollapseComponent'
import { SwitchCollapseComponent } from '../../base/SwitchCollapseComponent'
import { Texture, RepeatWrapping, ClampToEdgeWrapping, MirroredRepeatWrapping, type Wrapping } from 'three'
import styled from '@emotion/styled'
import { Nullable } from '../../../types'
import { ImageUploadComponent } from '../../base/ImageUploadComponent'
import { TextLineComponent } from '../../base/TextLineComponent'
import { SelectComponent } from '../../base/SelectComponent'
import { CheckboxComponent } from '../../base/CheckboxComponent'
import { type RcFile } from 'antd/es/upload'
import { useForceUpdate } from '../../../hooks/useForceUpdate'

interface Props {
	label?: string
	switchMode?: boolean
	checked?: boolean
	texture?: Nullable<Texture>
	onTextureChanged?: (texture: Texture) => void
}

const Canvas = styled.canvas`
	display: block;
	margin: 0 auto;
	width: 256px;
	height: 256px;
`

const updatePreviewCanvas = (canvas: HTMLCanvasElement, width: number, height: number) => {
	canvas.width = width
	canvas.height = height
	canvas.style.width = `${width}px`
	canvas.style.height = `${height}px`
}

const renderPreview = (canvas: HTMLCanvasElement, image?: HTMLImageElement) => {
	const ctx = canvas.getContext('2d')!
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	if (!image) {
		// render empty image
		updatePreviewCanvas(canvas, 256, 256)
		const imgData = ctx.createImageData(256, 256)
		for (let r = 0; r < 256; r++) {
			for (let c = 0; c < 256; c++) {
				const rr = Math.floor(r / 32)
				const cc = Math.floor(c / 32)
				const i = 256 * r + c
				const v = (rr + cc) % 2 === 0 ? 198 : 255
				imgData.data[4 * i] = v
				imgData.data[4 * i + 1] = v
				imgData.data[4 * i + 2] = v
				imgData.data[4 * i + 3] = 255
			}
		}
		ctx.putImageData(imgData, 0, 0)
		return
	}
	let renderWidth = image.width
	let renderHeight = image.height
	if (renderWidth >= 256) {
		renderWidth = 256
		renderHeight = (image.height * 256) / image.width
	} else if (renderHeight >= 256) {
		renderHeight = 256
		renderHeight = (image.width * 256) / image.height
	}
	updatePreviewCanvas(canvas, renderWidth, renderHeight)
	ctx.drawImage(image, 0, 0, renderWidth, renderHeight)
}

export const TextureProperty = (props: Props) => {
	const { texture, switchMode } = props
	const canvasRef = useRef<Nullable<HTMLCanvasElement>>(null)
	const forceUpdate = useForceUpdate()
	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) {
			return
		}
		if (!texture) {
			renderPreview(canvas)
			return
		}
		const image = texture.image
		if (image instanceof HTMLImageElement && !image.complete) {
			image.addEventListener('onload', () => {
				renderPreview(canvas, texture.image)
			})
		} else {
			renderPreview(canvas, texture.image)
		}
	}, [texture])

	const onUpload = useCallback(
		(file: RcFile) => {
			const fr = new FileReader()
			fr.onload = () => {
				if (!fr.result) {
					return
				}
				const img = document.createElement('img')
				const texture = new Texture(img)
				img.onload = () => {
					texture.needsUpdate = true
					props.onTextureChanged?.(texture)
					renderPreview(canvasRef.current!, img)
				}
				img.src = fr.result as string
			}
			fr.readAsDataURL(file)
		},
		[texture]
	)

	useEffect(() => {
		const onVisibilityChanged = () => {
			if (document.visibilityState === 'visible') {
				if (canvasRef.current && texture) {
					renderPreview(canvasRef.current, texture.image)
				}
			}
		}
		document.addEventListener('visibilitychange', onVisibilityChanged)

		return () => {
			document.removeEventListener('visibilitychange', onVisibilityChanged)
		}
	}, [])

	// @ts-ignore
	const getTextureFormatName = (texture: Texture) => {
		// TODO: texture format name
	}

	const renderGrid = () => {
		return (
			<>
				<Canvas className="texture-preview-canvas" ref={canvasRef} width={256} height={256} />
				<ImageUploadComponent text="Upload texture file" onChange={onUpload} />
				<TextLineComponent name="Name" text={texture?.name || '-'} />
				<TextLineComponent name="Id" text={texture?.id || '-'} />
				<TextLineComponent name="Width" text={texture?.image.width ?? '-'} />
				<TextLineComponent name="Height" text={texture?.image.width ?? '-'} />
				<TextLineComponent name="Format" text={texture?.format ?? '-'}></TextLineComponent>
				{texture ? (
					<CheckboxComponent
						name="FlipY"
						checked={texture?.flipY}
						disabled={!texture}
						onChange={(val) => {
							texture.needsUpdate = true
							texture.flipY = val
						}}
					/>
				) : null}
				{texture ? (
					<SelectComponent
						name="WrapS"
						options={[
							{ value: RepeatWrapping, label: 'RepeatWrapping' },
							{ value: ClampToEdgeWrapping, label: 'ClampToEdgeWrapping' },
							{ value: MirroredRepeatWrapping, label: 'MirroredRepeatWrapping' },
						]}
						defaultValue={texture.wrapS}
						onChange={(val) => {
							texture.wrapS = val as Wrapping
							texture.needsUpdate = true
							forceUpdate()
						}}
					/>
				) : (
					<TextLineComponent name="WrapT" text="-" />
				)}
				{texture ? (
					<SelectComponent
						name="WrapT"
						options={[
							{ value: RepeatWrapping, label: 'RepeatWrapping' },
							{ value: ClampToEdgeWrapping, label: 'ClampToEdgeWrapping' },
							{ value: MirroredRepeatWrapping, label: 'MirroredRepeatWrapping' },
						]}
						defaultValue={texture.wrapT}
						onChange={(val) => {
							texture.wrapT = val as Wrapping
							texture.needsUpdate = true
							forceUpdate()
						}}
					/>
				) : (
					<TextLineComponent name="WrapT" text="-" />
				)}
			</>
		)
	}

	return switchMode ? (
		<SwitchCollapseComponent label={props.label ?? 'Map'} checked={props.checked}>{renderGrid()}</SwitchCollapseComponent>
	) : (
		<CollapseComponent label={props.label ?? 'Map'}>{renderGrid()}</CollapseComponent>
	)
}
