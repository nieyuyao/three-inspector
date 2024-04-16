export const upperLabel = (label: string) => {
	const trimmed = label.trim()
	return trimmed.split(' ').reduce((prev, cur) => {
		prev += cur[0].toUpperCase() + cur.substring(1)
		return prev
	}, '')
}
