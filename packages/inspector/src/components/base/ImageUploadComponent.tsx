import React, { type CSSProperties } from 'react'
import styled from '@emotion/styled'
import { Button, Upload, UploadProps } from '@arco-design/web-react'

interface Props {
	text: string
	style?: CSSProperties
	onChange?: (file: File) => void
}

const UploadContainer = styled.div`
	display: flex;
	justify-content: center;
	margin: 6px 1px;
`

export const ImageUploadComponent = (props: Props) => {
	const onBeforeUpload: UploadProps['beforeUpload'] = (file: File) => {
		props.onChange?.(file)
		return false
	}
	return (
		<UploadContainer style={props.style}>
			<Upload accept=".jpg,.png,.jpeg" beforeUpload={onBeforeUpload} showUploadList={false}>
				<Button>{props.text}</Button>
			</Upload>
		</UploadContainer>
	)
}
