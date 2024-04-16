import type * as THREE from 'three'

export type Nullable<T> = T | null

export type Undefined<T> = T | undefined

// TODO:
export type PropertyComponentType = 'Input' | 'Checkbox' | 'ColorPicker' | 'Vector' | 'JSON'

type PropertyName = string


export type Property = PropertyName | {
	// property name
	name: PropertyName
	// component type
	componentType: PropertyComponentType
}
