import { AnyState, AnyArray, KeyPath } from './types'
import { operationIn } from './genericFunctions'

const normalizeIndex = (arr: AnyArray, index: number) => {
  if (index < 0) {
    if (arr.length === 0) return 0
    
    do {
      index = arr.length + index
    } while (index < 0)
  }

  return index
}

const dropIndex = (arr: AnyArray, index: number) =>
  index === -1 ?
    arr :
    arr.slice(0, index).concat(arr.slice(index + 1))

export const setArr = (arr: AnyArray, index: number, value: any) => {
  index = normalizeIndex(arr, index)

  if (arr[index] === value) return arr

  const next = arr.slice()
  next[index] = value
  return next
}

export const unsetArr = (arr: AnyArray, index: number) =>
  dropIndex(arr, normalizeIndex(arr, index))

export const push = (arr: AnyArray, value: any) =>
  arr.concat(value)

export const pushIn = (arr: AnyArray, keys: KeyPath, value) => operationIn(
  arr,
  keys,
  push,
  value
)

export const unshift = (arr: AnyArray, value: any) =>
  [value].concat(arr)

export const unshiftIn = (arr: AnyArray, keys: KeyPath, value) => operationIn(
  arr,
  keys,
  unshift,
  value
)

export const remove = (arr: AnyArray, value: any) =>
  dropIndex(arr, arr.indexOf(value))

export const removeIn = (obj: AnyState, keys: KeyPath, value) => operationIn(
  obj,
  keys,
  remove,
  value
)

export const removeWhere = (arr: AnyArray, predicate) =>
  dropIndex(arr, arr.findIndex(predicate))

export const removeInWhere = (obj: AnyState, keys: KeyPath, predicate) => operationIn(
  obj,
  keys,
  removeWhere,
  predicate
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
