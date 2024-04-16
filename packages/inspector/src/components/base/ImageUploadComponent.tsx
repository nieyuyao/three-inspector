import React, { type CSSProperties } from 'react'
import UploadFile, { type UploadProps, type RcFile } from 'antd/es/upload'
import styled from '@emotion/styled'
import Button from 'antd/es/button'

interface Props {
	text: string
	style?: CSSProperties
	onChange?: (file: RcFile) => void
}

const UploadContainer = styled.div`
	display: flex;
	justify-content: center;
	margin: 6px 1px;
`

export const ImageUploadComponent = (props: Props) => {
	const onBeforeUpload: UploadProps['beforeUpload'] = (file: RcFile) => {
		props.onChange?.(file)
		return false
	}
	return (
		<UploadContainer style={props.style}>
			<UploadFile accept=".jpg,.png,.jpeg" beforeUpload={onBeforeUpload} showUploadList={false}>
				<Button>{props.text}</Button>
			</UploadFile>
		</UploadContainer>
	)
}
