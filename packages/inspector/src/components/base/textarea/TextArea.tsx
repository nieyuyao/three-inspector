import React, { useState, useCallback, useEffect } from 'react'
import { Input, type InputProps }  from '@arco-design/web-react'

interface Props {
	placeholder: string
	defaultValue?: string
	status?: InputProps['status']
	onChange?: (val: string) => void
}


export const TextAreaComponent = (props: Props) => {
	const [text, setText] = useState('')

	const onChange = useCallback((value: string) => {
		if (text === value) {
			return
		}
		setText(value)
		props.onChange?.(value)
 	}, [text])

	useEffect(() => {
		setText(props.defaultValue ? props.defaultValue : '')
	}, [props.defaultValue])
	return <>
		<Input.TextArea status={props.status} value={text} placeholder={props.placeholder} onChange={onChange}/>
	</>
}
