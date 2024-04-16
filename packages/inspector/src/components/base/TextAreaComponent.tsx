import React, { useState, type ChangeEvent, useCallback, useEffect } from 'react'
import Input, { type InputProps }  from 'antd/es/input'

interface Props {
	placeholder: string
	defaultValue?: string
	status?: InputProps['status']
	onChange?: (val: string) => void
}


export const TextAreaComponent = (props: Props) => {
	const [text, setText] = useState('')

	const onChange = useCallback((ev: ChangeEvent<HTMLTextAreaElement>) => {
		if (text === ev.target.value) {
			return
		}
		setText(ev.target.value)
		props.onChange?.(ev.target.value)
 	}, [text])

	useEffect(() => {
		setText(props.defaultValue ? props.defaultValue : '')
	}, [props.defaultValue])
	return <>
		<Input.TextArea status={props.status} value={text} placeholder={props.placeholder} onChange={onChange}/>
	</>
}
