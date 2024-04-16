export const download = (blob: Blob, fileName: string) => {
	const url = window.URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.style.display = 'none'
	a.href = url
	a.download = fileName
	document.body.appendChild(a)
	a.addEventListener('click', () => {
		document.body.removeChild(a)
	})
	a.click()
}


export const copyTextToClipboard = (text: string) => {
	if (!navigator.clipboard) {
		const input = document.createElement('input')
		input.style.cssText = `position: fixed; top: -999px; left: -999px;`
		input.value = text
		document.body.appendChild(input)
		input.focus()
		input.select()
		document.execCommand('copy')
		return
	}
	navigator.clipboard.writeText(text).then(() => {}, console.error)
}
