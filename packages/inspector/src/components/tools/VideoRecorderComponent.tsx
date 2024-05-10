import React, { useCallback, useContext, useRef, useState } from 'react'
import { ButtonComponent } from '../base/ButtonComponent'
import { VideoRecorder } from '../../helpers/VideoRecorder'
import { download }  from '../../utils/tool'
import { GlobalContext, globalContext } from '../../global-context'

export const VideoRecorderComponent = () => {
	const { canvas } = useContext<GlobalContext>(globalContext)
	const [isRecording, setIsRecording] = useState(false)
	const recordSecondsRef = useRef(0)
	const [recordSeconds, setRecordSeconds] = useState(0)
	const countRecordTimer = useRef(0)

	const startCountRecordSeconds = useCallback(() => {
		countRecordTimer.current = setTimeout(() => {
			recordSecondsRef.current++
			setRecordSeconds(recordSecondsRef.current)
			startCountRecordSeconds()
		}, 1000)
	}, [])


	const stopCountRecordSeconds = useCallback(() => {
		clearTimeout(countRecordTimer.current)
		recordSecondsRef.current = 0
		setRecordSeconds(0)
	}, [])

	const recordVideo = useCallback(async () => {
		if (!canvas) {
			return
		}
		if (isRecording) {
			setIsRecording(false)
			stopCountRecordSeconds()
			const blob = await VideoRecorder.endRecording()
			download(blob, 'recorder.webm')
		} else {
			setIsRecording(true)
			startCountRecordSeconds()
			VideoRecorder.startRecording(canvas)
		}
	}, [isRecording, canvas])
	return (
		<ButtonComponent onClick={recordVideo}>
			{isRecording ? `Recording(${recordSeconds}s)` : 'Record video'}
		</ButtonComponent>
	)
}
