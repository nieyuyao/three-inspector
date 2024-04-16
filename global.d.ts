declare module '*.css' {
  const content: string
  export default content;
}

declare module '*.svg' {
  const content: string
  export default content;
}


declare module '*.scss' {
  const content: string
  export default content;
}

declare module '*.png' {
	const content: string
	export default content;
}

declare module '*.jpg' {
	const content: string
	export default content;
}

declare module '*.jpeg' {
	const content: string
	export default content;
}

interface Window {
	__target_object__: any
}
