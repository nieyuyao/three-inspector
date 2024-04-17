import { useRef, type FunctionComponent, useEffect, useState } from 'react'
import { Undefined } from '../types'

const cache = new Map<string, FunctionComponent>()

export const useDynamicSVGImport = (name: string) => {
	const SvgRef = useRef<Undefined<FunctionComponent>>()
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		if (SvgRef.current) {
			return
		}
		import(`../assets/icons/${name}.svg?react`).then((jsx: any) => {
			SvgRef.current = jsx.default as unknown as FunctionComponent
			cache.set(name, SvgRef.current)
			setLoaded(true)
		}).catch(() => {
			// not implement
		})
	}, [name])

	return {
		SvgIcon: SvgRef.current,
		loaded
	}
}
