import React, { useContext } from 'react'
import {
  LinearEncoding,
  sRGBEncoding,
  SRGBColorSpace,
  LinearSRGBColorSpace,
  DisplayP3ColorSpace,
  LinearDisplayP3ColorSpace,
  NoToneMapping,
  LinearToneMapping,
  ReinhardToneMapping,
  CineonToneMapping,
  ACESFilmicToneMapping,
  CustomToneMapping,
  AgXToneMapping,
  REVISION,
} from 'three'
import { CollapseComponent } from '../base/collapse/Collapse'
import { SelectComponent } from '../base/select/Select'
import { GlobalContext, globalContext } from '../../contexts/global-context'
import { INSPECTOR_CLASS_NAME } from '../../utils/constants'

const isLowerVersion = () => +REVISION < 152

export const RendererComponent = () => {
  const { renderer } = useContext<GlobalContext>(globalContext)
  return (
    <CollapseComponent label="Renderer" defaultOpened>
      {isLowerVersion() ? (
        <SelectComponent
          name="TextureEncoding"
          defaultValue={renderer?.outputEncoding}
          popupContainer={document.querySelector<HTMLElement>(`.${INSPECTOR_CLASS_NAME}`)}
          options={[
            { value: LinearEncoding, label: 'LinearEncoding' },
            { value: sRGBEncoding, label: 'sRGBEncoding' },
          ]}
          onChange={(value) => {
            if (renderer) {
              renderer.outputEncoding = value
            }
          }}
        />
      ) : (
        <SelectComponent
          name="ColorSpace"
          defaultValue={renderer?.outputColorSpace}
          popupContainer={document.querySelector<HTMLElement>(`.${INSPECTOR_CLASS_NAME}`)}
          options={[
            { value: SRGBColorSpace, label: 'SRGBColorSpace' },
            { value: LinearSRGBColorSpace, label: 'LinearSRGBColorSpace' },
            { value: DisplayP3ColorSpace, label: 'DisplayP3ColorSpace' },
            { value: LinearDisplayP3ColorSpace, label: 'LinearDisplayP3ColorSpace' },
          ]}
          onChange={(value) => {
            if (renderer) {
              renderer.outputColorSpace = value
            }
          }}
        />
      )}
      <SelectComponent
        name="ToneMapping"
        defaultValue={renderer?.toneMapping}
        popupContainer={document.querySelector<HTMLElement>(`.${INSPECTOR_CLASS_NAME}`)}
        options={[
          { value: NoToneMapping, label: 'NoToneMapping' },
          { value: ReinhardToneMapping, label: 'ReinhardToneMapping' },
          { value: LinearToneMapping, label: 'LinearToneMapping' },
          { value: CineonToneMapping, label: 'CineonToneMapping' },
          { value: ACESFilmicToneMapping, label: 'ACESFilmicToneMapping' },
          { value: CustomToneMapping, label: 'CustomToneMapping' },
          { value: AgXToneMapping, label: 'AgXToneMapping' },
        ]}
        onChange={(value) => {
          if (renderer) {
            renderer.toneMapping = value
          }
        }}
      />
    </CollapseComponent>
  )
}
