import { AnyState, AnyArray, KeyPath } from './types'
import { operationIn } from './genericFunctions'

const normalizeIndex = (arr: AnyArray, index: number) => {
  while (index < 0) index = arr.length + index

  return index
}

const dropIndex = (arr: AnyArray, index: number) => arr.slice(0, index).concat(arr.slice(index + 1))

export const setArr = (arr: AnyArray, index: number, value: any) => {
  index = normalizeIndex(arr, index)

  if (arr[index] === value) return arr

  const next = ([] as AnyArray).concat(arr)
  next[index] = value
  return next
}

export const unsetArr = (arr: AnyArray, index: number) => dropIndex(arr, normalizeIndex(arr, index))

export const remove = (arr: AnyArray, value: any) => {
  const index = arr.indexOf(value)
  if (index === -1) { return arr }

  return dropIndex(arr, index)
}

export const removeIn = (obj: AnyState, keys: KeyPath, value) => operationIn(
  obj,
  keys,
  remove,
  value
)

export const filter = (arr: AnyArray, predicate) => {
  var differIndex = arr.findIndex((item, index) => !predicate(item, index))
  if (differIndex === -1) { return arr }

  const next = arr.slice(0, differIndex)
  while (differIndex < arr.length) {
    var item = arr[differIndex++]
    if (predicate(item, differIndex)) { next.push(item) }
  }

  return next
}

export const filterIn = (obj: AnyState, keys: KeyPath, predicate) => operationIn(
  obj,
  keys,
  filter,
  predicate
)
