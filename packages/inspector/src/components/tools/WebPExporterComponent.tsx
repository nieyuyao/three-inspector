import React, { useCallback, useState } from 'react'
import { encodeAnimation } from 'wasm-webp'
import { CollapseComponent } from '../base/CollapseComponent'
import { ButtonComponent } from '../base/ButtonComponent'
import { NumericInputComponent } from '../base/NumericInputComponent'

export const WebPExporterComponent = () => {
  const [isRecording, setIsRecording] = useState(false)

  const options = useState<{ frequency: number }>({ frequency: 200 })

  const record = useCallback(() => {
  }, [isRecording])

  return (
    <CollapseComponent label="Animated WebP">
      <ButtonComponent onClick={record}>{isRecording ? 'Recording' : 'Record'}</ButtonComponent>
      <NumericInputComponent label="Frequency(ms)" defaultValue={200} name="frequency" />
    </CollapseComponent>
  )
}
