import { useRef, type FunctionComponent, useEffect, useState } from 'react'
import { Undefined } from '../types'


export const useDynamicSVGImport = (name: string) => {
	const SvgRef = useRef<Undefined<FunctionComponent>>()
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true)
		import(`../assets/icons/${name}.svg?react`).then((jsx: any) => {
			SvgRef.current = jsx.default as unknown as FunctionComponent
			setLoading(false)
		}).catch(() => {
			setLoading(false)
		})
	}, [name, loading])

	return {
		SvgIcon: SvgRef.current,
		loading: false
	}
}
