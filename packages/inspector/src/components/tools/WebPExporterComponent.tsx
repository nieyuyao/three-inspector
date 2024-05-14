import React, { useCallback, useContext, useRef, useState } from 'react'
import { encodeAnimation, Nullable, WebPAnimationFrame } from 'wasm-webp'
import { CollapseComponent } from '../base/CollapseComponent'
import { ButtonComponent } from '../base/ButtonComponent'
import { NumericInputComponent } from '../base/NumericInputComponent'
import { GlobalContext, globalContext } from '../../global-context'
import { Vector2, WebGLRenderTarget } from 'three'
import { download } from '../../utils/tool'

export const WebPExporterComponent = () => {
  const { canvas, renderer, scene, camera } = useContext<GlobalContext>(globalContext)
  const [isRecording, setIsRecording] = useState(false)
  const framesRef = useRef<Array<WebPAnimationFrame>>([])
  const elapsedRef = useRef(0)
  const rtRef = useRef<WebGLRenderTarget>(new WebGLRenderTarget())
  const timer = useRef(0)

  const [options] = useState<{ frequency: number; duration: number }>({
    frequency: 200,
    duration: 3,
  })

  const stopRecord = useCallback(() => {
    setIsRecording(false)
    clearTimeout(timer.current)
    exportWebP(
      rtRef.current.width,
      rtRef.current.height,
      framesRef.current
    )
    framesRef.current = []
    elapsedRef.current = 0
  }, [])

  const record = useCallback(() => {
    if (!canvas || !renderer || !scene || !camera) {
      return
    }
    if (elapsedRef.current > options.duration * 1000) {
      stopRecord()
      return
    }
    const size = renderer.getSize(new Vector2())
    rtRef.current.setSize(size.width, size.height)
    rtRef.current.texture.flipY = false
    rtRef.current.texture.needsUpdate = true

    renderer.setRenderTarget(rtRef.current)
    renderer.render(scene, camera)
    // TODO: flip y
    const buf =  new Uint8Array(size.width * size.height * 4)
    renderer.readRenderTargetPixels(rtRef.current, 0, 0, size.width, size.height, buf)
    renderer.setRenderTarget(null)
    framesRef.current.push({
      duration: options.frequency,
      data: buf
    })
    elapsedRef.current += options.frequency
    timer.current = setTimeout(() => {
      record()
    }, options.frequency)
  }, [stopRecord])

  const exportWebP = useCallback(
    async (width: number, height: number, frames: WebPAnimationFrame[]) => {
      const webpData = await encodeAnimation(width, height, true, frames)
      const blob = new Blob([webpData!], { type: 'image/webp' })
      download(blob, 'image.webp')
    },
    [renderer, scene, camera]
  )



  const onClick = useCallback(() => {
    if (isRecording) {
      stopRecord()
    } else {
      setIsRecording(true)
      record()
    }
  }, [isRecording])

  return (
    <CollapseComponent label="Animated WebP">
      <ButtonComponent onClick={onClick}>{isRecording ? 'Recording...' : 'Record'}</ButtonComponent>
      <NumericInputComponent
        contentStyle={{ maxWidth: `calc(100% - 120px)` }}
        label="Frequency(ms)"
        defaultValue={200}
      />
      <NumericInputComponent
        contentStyle={{ maxWidth: `calc(100% - 120px)` }}
        label="Duration(s)"
        defaultValue={3}
      />
    </CollapseComponent>
  )
}
