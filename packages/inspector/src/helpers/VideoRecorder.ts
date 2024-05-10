export class VideoRecorder {
	static recorder: MediaRecorder

	static startRecording(canvas: HTMLCanvasElement) {

		if (!this.recorder) {
			const stream = canvas.captureStream()
			this.recorder = new MediaRecorder(stream)
		}
		this.recorder.start()
	}

	static async endRecording() {
		const blob = await new Promise<Blob>(resolve => {
			this.recorder.ondataavailable = (e: BlobEvent) => {
				resolve(e.data)
			}
			this.recorder.stop()
		})

		return blob
	}
}
