export class Screenshot {
	public static download(blob: Blob, fileName: string) {
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
}
