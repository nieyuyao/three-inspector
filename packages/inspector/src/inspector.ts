import React from 'react'
import { createRoot, type Root } from 'react-dom/client'
import type { Scene, Camera, WebGLRenderer } from 'three'
import { type InspectorPanelProps, InspectorPanel } from './InspectorPanel'
import { Nullable } from './types'
import { INSPECTOR_CLASS_NAME } from './utils/constants'

interface Options {
	element?: HTMLElement
	measureDom?: HTMLElement
}


export class Inspector {
	private static panelIns: Nullable<Root> = null

	private static panelHostElement: Nullable<HTMLElement> = null

	private static scene: Scene

	private static camera: Camera

	private static renderer: WebGLRenderer

	private static popupWindow: Nullable<Window & typeof globalThis> = null

	private static popupMode = false

	private static options: Options = {}

	static show(scene: Scene, camera: Camera, renderer: WebGLRenderer, options?: Options) {
		this.scene = scene
		this.camera = camera
		this.renderer = renderer
		this.options = options ?? {}
		const hostElement = options?.element ?? null
		if (this.panelHostElement && hostElement && this.panelHostElement === hostElement) {
			this.panelHostElement.style.display = 'block'
		} else {
			this.panelHostElement = hostElement
		}
		if (!this.panelHostElement) {
			let doc: Document
			if (this.popupMode) {
				this.#createPopUp()
				doc = this.popupWindow!.document
			} else {
				doc = window.document
			}
			const ele = doc.createElement('div')
			ele.className = INSPECTOR_CLASS_NAME
			doc.body.appendChild(ele)
			this.panelHostElement = ele
		}
		this.panelIns = createRoot(this.panelHostElement!)
		const panelElement = React.createElement<InspectorPanelProps>(InspectorPanel, {
			targetObject: scene,
			scene,
			camera,
			renderer,
			container: this.panelHostElement!,
			popupMode: this.popupMode,
			measureDom: options?.measureDom ?? null,
			onClose: () => {
				this.destroy()
				if (this.popupMode) {
					this.#createPopUp()
					this.popupMode = false
					this.show(this.scene, this.camera, this.renderer, this.options)
				}
			},
			onPopup: () => {
				this.destroy()
				if (this.popupMode) {
					this.popupMode = false
					this.show(this.scene, this.camera, this.renderer, this.options)
				} else {
					this.popupMode = true
					this.#createPopUp()
					this.show(this.scene, this.camera, this.renderer, this.options)
				}
			},
		})
		this.panelIns.render(panelElement)
	}


	static hide() {
		if (this.panelHostElement) {
			this.panelHostElement.style.display = 'none'
		}
	}

	// TODO:
	static refresh() {}

	static destroy() {
		const { panelHostElement, panelIns: ins, popupMode } = this
		this.#removeAllInspectorObjects()
		this.panelIns = null
		this.panelHostElement = null
		setTimeout(() => {
			if (ins) {
				ins.unmount()
			}
			if (panelHostElement) {
				panelHostElement.parentElement?.removeChild(panelHostElement)
			}
		}, 0)
		if (popupMode) {
			this.#closePopup()
		}
	}

	static #closePopup() {
		this.popupWindow!.close()
		this.popupWindow = null
	}

	static #removeAllInspectorObjects() {
		const { scene } = this
		if (!scene) {
			return
		}
		scene.traverse(child => {
			if (child.name.includes('Inspector')) {
				child.removeFromParent()
				// @ts-ignore
				child.dispose()
			}
		})
	}

	static #copyStyles(sourceDoc: Document, targetDoc: Document) {
		for (let index = 0; index < sourceDoc.styleSheets.length; index++) {
			const styleSheet: any = sourceDoc.styleSheets[index]
			try {
				if (styleSheet.cssRules) {
					// for <style> elements
					const newStyleEl = sourceDoc.createElement('style')
					for (const cssRule of styleSheet.cssRules) {
						// write the text of each rule into the body of the style element
						newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText))
					}
					targetDoc.head!.appendChild(newStyleEl)
				} else if (styleSheet.href) {
					// for <link> elements loading CSS from a URL
					const newLinkEl = sourceDoc.createElement('link')
					newLinkEl.rel = 'stylesheet'
					newLinkEl.href = styleSheet.href
					targetDoc.head!.appendChild(newLinkEl)
				}
			} catch (e) {}
		}
	}

	static #createPopUp() {
		const features = 'left=100,top=100,width=360,height=640'
		const popupWindow = window.open('', 'INSPECTOR', features) as Window & typeof globalThis
		const popupDocument = popupWindow?.document
		if (!popupDocument) {
			return
		}
		this.popupWindow = popupWindow
		this.#copyStyles(window.document, popupDocument)
	}
}
