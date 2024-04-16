import React, { useCallback, useContext, useEffect, useState } from 'react'
import { CollapseComponent } from '../base/CollapseComponent'
import { TextAreaComponent } from '../base/TextAreaComponent'
import { SwitchComponent } from '../base/SwitchComponent'
import { GlobalContext, globalContext } from '../../global-context'

interface Props {
	prettyJsonDisabled?: boolean
}

const isObject = (obj: any) => {
	return obj !== null && typeof obj === 'object'
}

const FAILED_CONVERT_OBJECT = 'JSON cannot be converted to a JS Object'

export const UserDataProperty = ({ prettyJsonDisabled }: Props) => {
	const { targetObject } = useContext<GlobalContext>(globalContext)
	const [userDataText, setUserDataText] = useState('')
	const [isValid, setIsValid] = useState(true)
	const [prettyJson, setPrettyJson] = useState(true)
	const [errMsg, setErrMsg] = useState<string | null>('')

	const parseString = useCallback((str: string): any => {
		try {
			const parsed = JSON.parse(str)
			if (!isObject(parsed)) {
				setErrMsg(FAILED_CONVERT_OBJECT)
				return null
			}
			setErrMsg(null)
			return parsed
		} catch (err) {
			setErrMsg(err.message)
			return null
		}
	}, [])

	const onTogglePrettyJson = useCallback((val: boolean) => {
		setPrettyJson(val)
		if (!isValid) {
			return
		}
		const parsed = parseString(userDataText)
		if (parsed) {
			const prettyText = JSON.stringify(parsed, undefined, val ? 2 : undefined)
			setUserDataText(prettyText)
		}
	}, [userDataText, isValid])


	const onInputChanged = useCallback((text: string) => {
		setPrettyJson(false)
		const parsed = parseString(text)
		setIsValid(!!parsed)
		setUserDataText(text)
		if (parsed && targetObject) {
			targetObject.userData = parsed
		}
	}, [targetObject])
	useEffect(() => {
		if (!targetObject) {
			return
		}
		setUserDataText(JSON.stringify(targetObject.userData))
		setPrettyJson(false)
	}, [targetObject])
	return (
		<CollapseComponent label="UserData" defaultOpened>
			<SwitchComponent
				name="Pretty JSON"
				disabled={prettyJsonDisabled}
				checked={prettyJson}
				onChange={onTogglePrettyJson}
			/>
			<TextAreaComponent
				defaultValue={userDataText}
				status={isValid ? '' : 'error'}
				placeholder="Enter JSON"
				onChange={onInputChanged}
			/>
			{ errMsg && <div className="three-inspector-user-data-error-message" >{errMsg}</div> }
		</CollapseComponent>
	)
}
