import React, { type CSSProperties } from 'react'
import Button from '@arco-design/web-react/es/Button'
import Upload, { UploadProps } from '@arco-design/web-react/es/Upload'
import './index.scss'

interface Props {
	text: string
	style?: CSSProperties
	onChange?: (file: File) => void
}

export const ImageUploadComponent = (props: Props) => {
	const onBeforeUpload: UploadProps['beforeUpload'] = (file: File) => {
		props.onChange?.(file)
		return false
	}
	return (
		<div className='three-inspector-image-upload' style={props.style}>
			<Upload accept=".jpg,.png,.jpeg" beforeUpload={onBeforeUpload} showUploadList={false}>
				<Button>{props.text}</Button>
			</Upload>
		</div>
	)
}
