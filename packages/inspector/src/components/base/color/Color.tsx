import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { RgbaColorPicker, RgbColorPicker, type RgbaColor, type RgbColor } from 'react-colorful'
import { NumericInputComponent } from '../numberic-input/NumericInput'
import { Line } from '../line/Line'
import { Nullable } from '../../../types'
import { INSPECTOR_PANEL_CLASS_NAME } from '../../../utils/constants'
import './index.scss'

interface Props {
  name: string
  defaultColor?: RgbColor | RgbaColor | null
  alpha?: boolean
  showColourless?: boolean
  onChange?: (color: RgbColor | RgbaColor | null) => void
}

const color2String = (color: RgbColor | RgbaColor) => {
  return typeof (color as RgbaColor).a !== 'undefined'
    ? `rgba(${color.r}, ${color.g}, ${color.b}, ${(color as RgbaColor).a})`
    : `rgb(${color.r}, ${color.g}, ${color.b})`
}

const rgbPresetColors: RgbColor[] = [
  { r: 255, g: 0, b: 0 },
  // green
  { r: 0, g: 255, b: 0 },
  // blue
  { r: 0, g: 0, b: 255 },
  // white
  { r: 255, g: 255, b: 255 },
  // gray
  { r: 128, g: 128, b: 128 },
  // black
  { r: 0, g: 0, b: 0 },
]

const defaultRgbaColor = { r: 0, g: 0, b: 0, a: 0 }
const defaultRgbColor = { r: 0, g: 0, b: 0 }

const rgbaPresetColors: RgbaColor[] = rgbPresetColors.map((c) => ({ ...c, a: 1 }))

export const ColorComponent = (props: Props) => {
  const { onChange } = props
  const [color, setColor] = useState<RgbColor | RgbaColor>(
    props.defaultColor || (props.alpha ? defaultRgbaColor : defaultRgbColor)
  )
  const [pickerVisible, setPickerVisible] = useState(false)
  const previewDivRef = useRef<Nullable<HTMLDivElement>>(null)
  const [isColourless, setColourless] = useState(Boolean(!props.defaultColor))
  const colorRef = useRef(color)
  const presetColors = useMemo(() => {
    return props.alpha ? rgbaPresetColors : rgbPresetColors
  }, [props.alpha])

  const comps = useMemo(() => {
    return props.alpha ? ['r', 'g', 'b', 'a'] : ['r', 'g', 'b']
  }, [props.alpha])

  const openPicker = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === previewDivRef.current) {
        setPickerVisible(!pickerVisible)
      }
    },
    [pickerVisible]
  )

  const pickerStyle = useMemo(() => {
    if (!previewDivRef.current || !pickerVisible) {
      return
    }
    const rect = previewDivRef.current.getBoundingClientRect()
    const winWidth = window.innerWidth
    const winHeight = window.innerHeight
    return {
      right: `${winWidth - rect.left + 4}px`,
      top: `${rect.top + 324 > winHeight ? winHeight - 324 - 4 : rect.top}px`,
    }
  }, [pickerVisible])

  const onInputChange = useCallback(
    (val: number, comp: string) => {
      const newColor = { ...colorRef.current, [comp]: Math.min(comp === 'a' ? 1 : 255, val) }
      colorRef.current = newColor
      setColor(newColor)
      setColourless(false)
      onChange?.(newColor)
    },
    [color, onChange]
  )

  const onPickerChange = useCallback(
    (newColor: RgbaColor | RgbColor) => {
      colorRef.current = newColor
      setColor(newColor)
      setColourless(false)
      onChange?.(newColor)
    },
    [onChange]
  )

  useEffect(() => {
    setColor(props.defaultColor || (props.alpha ? defaultRgbaColor : defaultRgbColor))
    setColourless(!Boolean(props.defaultColor))
  }, [props.defaultColor])

  const clearColor = useCallback(() => {
    setColor({ r: 0, g: 0, b: 0, a: 0 })
    onChange?.(null)
    setColourless(true)
  }, [onChange])

  const colorPreviewClass = useMemo(() => {
    return isColourless ? `color-preview colourless` : 'color-preview'
  }, [isColourless])

  return (
    <div className="three-inspector-color">
      <Line
        label={props.name}
        contentStyle={{ overflow: 'unset', position: 'relative', height: '100%' }}
      >
        <div
          className={colorPreviewClass}
          ref={previewDivRef}
          style={{ backgroundColor: color2String(color) }}
          onClick={openPicker}
        >
          {createPortal(
            pickerVisible ? (
              <div className="color-picker">
                <div className="color-picker-mask" onClick={() => setPickerVisible(false)} />
                <div
                  className="color-picker-content"
                  style={pickerStyle}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation()
                  }}
                >
                  <div className="preset">
                    {props.showColourless && (
                      <div className="colourless preset-color" onClick={clearColor} />
                    )}
                    {presetColors.map((color, i) => {
                      return (
                        <div
                          key={i}
                          className="preset-color"
                          style={{ backgroundColor: color2String(color) }}
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation()
                            e.nativeEvent.stopImmediatePropagation()
                            e.preventDefault()
                            onPickerChange(color)
                          }}
                        ></div>
                      )
                    })}
                  </div>
                  {props.alpha ? (
                    <RgbaColorPicker color={color as RgbaColor} onChange={onPickerChange} />
                  ) : (
                    <RgbColorPicker color={color} onChange={onPickerChange} />
                  )}
                  {comps.map((comp) => {
                    return (
                      <NumericInputComponent
                        min={0}
                        max={comp === 'a' ? 1 : 255}
                        key={comp}
                        prop={comp}
                        defaultValue={(color as any)[comp]}
                        onChange={onInputChange}
                      />
                    )
                  })}
                </div>
              </div>
            ) : null,
            document.querySelector(`.${INSPECTOR_PANEL_CLASS_NAME}`) || document.body
          )}
        </div>
      </Line>
    </div>
  )
}
