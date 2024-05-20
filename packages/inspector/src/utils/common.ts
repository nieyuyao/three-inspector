export const deepClone = <T = any>(obj: T): T => {
  const cloned = {} as unknown as T

  if (typeof obj !== 'object' || obj === null) {
    return obj
  } else {
    Object.keys(obj as object).forEach((k) => {
      const key = k as keyof T
      if (typeof obj[key] === 'object' &&  obj[key]) {
        cloned[key] = deepClone(obj[key])
      } else {
        cloned[key] = obj[key]
      }
    })
  }
  return cloned
}
