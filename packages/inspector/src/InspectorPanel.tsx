import React, { useRef, useState } from 'react'
import { GlobalContext, GlobalUtilsContext, globalUtilsContext, globalContext } from './global-context'
import type { Scene, Camera, WebGLRenderer } from 'three'
import { Nullable } from './types'
import styled from '@emotion/styled'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import { IconClose } from '@arco-design/web-react/icon'
import IconPopup from './assets/icons/popup.svg?react'
import { SceneExplore } from './SceneExplore'
import { ActionTabs } from './ActionTabs'

export interface InspectorPanelProps {
	scene: Scene
	camera: Camera
	renderer: WebGLRenderer
	targetObject: Nullable<THREE.Object3D>
	onClose: () => void
	onPopup: () => void
	container: Node
	popupMode?: boolean
	measureDom?: Nullable<HTMLElement>
}

const flexCenter = `
	display: flex;
	justify-content: center;
	align-items: center;
`

const PanelContainer = styled.div`
	position: absolute;
	top: 0;
	bottom: 0;
	right: 0;
	overflow: hidden;
	z-index: 99999;

	.resize {
		min-width: 360px;
		width: 360px;
		height: 16px;
		opacity: 0;
		resize: horizontal;
		overflow: scroll;
		transform: scale(-1, 100);
	}

	.resize-horizontal-line {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		width: 4px;
		opacity: 0;
		pointer-events: none;
	}

	&.popup {
		width: 100%;
		height: 100%;

		.resize,
		.resize-horizontal-line {
			display: none;
			width: 100%;
			height: 100%;
		}

		.panel {
			width: 100%;
			margin-left: 0;
		}
	}
`

const Panel = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: calc(100% - 4px);
	height: 100%;
	margin-left: 4px;
	background-color: var(--base-background-color);

	.header {
		position: relative;
		color: #fff;
		height: 30px;
		.title {
			${flexCenter}
			height: 100%;
			font-size: 16px;
		}

		.actions {
			display: flex;
			position: absolute;
			top: 0;
			right: 12px;
			height: 100%;
		}

		.action {
			${flexCenter}
			margin-left: 4px;
			width: 16px;
			height: 100%;
			cursor: pointer;

			& > svg {
				width: 14px;
				height: 14px;
			}
		}
	}

	.content {
		display: flex;
		flex-direction: column;
		height: calc(100% - 30px);
	}
`

export const InspectorPanel = (props: InspectorPanelProps) => {
	const [globalState, setGlobalState] = useState<GlobalContext>({
		targetObject: props.targetObject,
		scene: props.scene,
		camera: props.camera,
		renderer: props.renderer,
		canvas: props.renderer.domElement,
		measureDom: props.measureDom ?? null
	})

	const globalUtils = useRef<GlobalUtilsContext>({
		updateTargetObject: (obj: THREE.Object3D) => {
			setGlobalState((pevState) => {
				return {
					...pevState,
					targetObject: obj,
				}
			})
		},
	})

	const closePanel = () => props.onClose()

	const openPopup = () => props.onPopup()

	const cache = createCache({
		key: 'three-inspector',
		container: props.container,
	})

	return (
		<globalUtilsContext.Provider value={globalUtils.current}>
			<globalContext.Provider value={globalState}>
				<CacheProvider value={cache}>
					<PanelContainer className={props.popupMode ? 'popup' : ''}>
						<div className="resize" />
						<div className="resize-horizontal-line" />
						<Panel className="panel">
							<div className="header">
								<div className="title">INSPECTOR</div>
								<div className="actions">
									<IconPopup className="action popup" color='#fff' onClick={openPopup} />
									<IconClose className="action close" onClick={closePanel} />
								</div>
							</div>
							<div className="content">
								<SceneExplore className="scene-explore" />
								<ActionTabs className="action-tabs" />
							</div>
						</Panel>
					</PanelContainer>
				</CacheProvider>
			</globalContext.Provider>
		</globalUtilsContext.Provider>
	)
}
