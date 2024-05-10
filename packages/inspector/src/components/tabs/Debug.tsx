import React, { useCallback, useContext, useEffect, useState } from 'react'
import { REVISION } from 'three'
import { GlobalContext, globalContext } from '../../global-context'
import {
  LinearEncoding,
  sRGBEncoding,
  SRGBColorSpace,
  NoColorSpace,
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
} from 'three'
import { InfiniteGrid } from '../../helpers/InfiniteGrid'
import { SwitchComponent } from '../base/SwitchComponent'
import { CollapseComponent } from '../base/CollapseComponent'
import { SelectComponent } from '../base/SelectComponent'
import { INSPECTOR_CLASS_NAME } from '../../utils/constants'


const isLowerVersion = () => +REVISION < 152

export const Debug = () => {
  const { scene, renderer } = useContext<GlobalContext>(globalContext)
  const [gridVisible, setGridVisible] = useState(false)

  const toggleGridVisible = useCallback(
    (visible: boolean) => {
      if (!scene) {
        return
      }
      setGridVisible(visible)
      if (visible) {
        scene.add(new InfiniteGrid(0x888888))
      } else {
        scene.getObjectByName('InspectorInfiniteGrid')?.removeFromParent()
      }
    },
    [scene]
  )

  useEffect(() => {
    setGridVisible(!!scene?.getObjectByName('InspectorInfiniteGrid'))
  }, [scene])

  return (
    <>
      <CollapseComponent label="Helpers" defaultOpened>
        <SwitchComponent checked={gridVisible} name="Grid" onChange={toggleGridVisible} />
      </CollapseComponent>
      <CollapseComponent label="Renderer" defaultOpened>
        {isLowerVersion() ?
          <SelectComponent
            name="TextureEncoding"
            defaultValue={renderer?.outputEncoding}
            popupContainer={document.querySelector<HTMLElement>(`.${INSPECTOR_CLASS_NAME}`)}
            options={[
              { value: LinearEncoding, label: 'LinearEncoding' },
              { value: sRGBEncoding, label: 'sRGBEncoding' },
            ]}
          /> :
          <SelectComponent
            name="ColorSpace"
            defaultValue={renderer?.outputColorSpace}
            popupContainer={document.querySelector<HTMLElement>(`.${INSPECTOR_CLASS_NAME}`)}
            options={[
              { value: SRGBColorSpace, label: 'SRGBColorSpace' },
              { value: NoColorSpace, label: 'NoColorSpace' },
              { value: LinearSRGBColorSpace, label: 'LinearSRGBColorSpace' },
              { value: DisplayP3ColorSpace, label: 'DisplayP3ColorSpace' },
              { value: LinearDisplayP3ColorSpace, label: 'LinearDisplayP3ColorSpace' },
            ]}
          />
        }
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
        />
      </CollapseComponent>
    </>
  )
}
