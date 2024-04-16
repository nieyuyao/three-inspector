export const isReadonly = (obj: any, p: string, ) => {
	const desc = Object.getOwnPropertyDescriptor(obj, p)
	if (!desc) {
		return false
	}
	return !desc.configurable && !desc.writable
}
