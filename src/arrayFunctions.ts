import { operationIn, set } from './genericFunctions'

const normalizeIndex = (arr, index) => {
  while (index < 0) index = arr.length + index

  return index
}

const dropIndex = (arr, index) => arr.slice(0, index).concat(arr.slice(index + 1))

export const setArr = (arr, index, value) => {
  index = normalizeIndex(arr, index)

  if (arr[index] === value) return arr

  const next = [].concat(arr) as any[]
  next[index] = value
  return next
}

export const unsetArr = (arr, index) => dropIndex(arr, normalizeIndex(arr, index))

export const remove = (arr, value) => {
  const index = arr.indexOf(value)
  if (index === -1) { return arr }

  return dropIndex(arr, index)
}

export const filter = (arr, predicate) => {
  var differIndex = arr.findIndex((item, index) => !predicate(item, index))
  if (differIndex === -1) { return arr }

  const next = arr.slice(0, differIndex)
  while (differIndex < arr.length) {
    var item = arr[differIndex++]
    if (predicate(item, differIndex)) { next.push(item) }
  }

  return next
}

export const filterIn = (obj, keys, predicate) => {
  return operationIn(
    obj,
    keys,
    (obj, key, predicate) => set(obj, key, filter(obj[key], predicate)),
    predicate
  )
}
