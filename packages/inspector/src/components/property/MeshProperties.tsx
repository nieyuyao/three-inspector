import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { Mesh, MeshBasicMaterial } from 'three'
import { ObjectProperties } from './ObjectProperties'
import { GlobalContext, globalContext } from '../../global-context'
import { BasicMaterialProperty } from './materials/BasicMaterialProperty'
import { NormalsHelper } from '../../helpers/NormalsHelper'
import { SwitchComponent } from '../base/SwitchComponent'

export const MeshProperties = () => {
	const { targetObject } = useContext<GlobalContext>(globalContext)
	const [normalChecked, setNormalChecked] = useState(false)

	useEffect(() => {
		if (!targetObject) {
			setNormalChecked(false)
			return
		}
		const hasNorHelper = targetObject.getObjectByName('InspectorNormalsHelper')
		setNormalChecked(!!hasNorHelper)
	}, [targetObject])
	const materials = useMemo(() => {
		const mesh = targetObject as Mesh
		if (Array.isArray(mesh.material)) {
			return mesh.material
		}
		if (mesh.material) {
			return [mesh.material]
		}
		return []
	}, [targetObject])

	const onNormalChanged = useCallback((checked: boolean) => {
		if (!targetObject) {
			return
		}
		if (checked) {
			const normalHelper = new NormalsHelper(targetObject as Mesh)
			targetObject.add(normalHelper)
		} else {
			targetObject.getObjectByName('InspectorNormalsHelper')?.removeFromParent()
		}
		setNormalChecked(checked)
	}, [targetObject])
	return <>
		<ObjectProperties />
		{/* TODO: up */}
		{/* TODO: receiveShadow */}
		{/* TODO: frustumCulled */}
		{/* TODO: renderOrder */}
		{ materials.map(mat => {
			return <BasicMaterialProperty key={mat.id} material={mat as MeshBasicMaterial} />
		}) }
		<SwitchComponent checked={normalChecked} name='Normal' onChange={onNormalChanged}/>
	</>
}
