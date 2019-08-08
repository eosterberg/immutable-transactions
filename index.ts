export type AnyArray = any[]
export type AnyObject = {[key: string]: any} 
export type AnyState = AnyArray | AnyObject
export type KeyPath = (string | number)[]

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

const setArr = (arr: AnyArray, index: number, value: any) => {
  index = normalizeIndex(arr, index)

  if (arr[index] === value) return arr

  const next = arr.slice()
  next[index] = value
  return next
}

const unsetArr = (arr: AnyArray, index: number) =>
  dropIndex(arr, normalizeIndex(arr, index))

const setObj = (obj, key, value) => {
  if (obj[key] === value) return obj

  const next = {}
  for (var k in obj) {
    next[k] = k === key ? value : obj[k]
  }
  return next
}

const unsetObj = (obj, key) => {
  if (key in obj) {
    const next = {}
    for (var k in obj) {
      if (key !== k) { next[k] = obj[k] }
    }
    return next
  }

  return obj
}

const {isArray} = Array

const set = (obj, key, value) => (
  isArray(obj) ? setArr : setObj
)(obj, key, value)

const unset = (obj, key) => (
  isArray(obj) ? unsetArr : unsetObj
)(obj, key)

const operationIn = (obj: AnyState, keys: KeyPath, operation, value) => set(
  obj,
  keys[0],
  keys.length > 1 ?
    operationIn(obj[keys[0]], keys.slice(1), operation, value) :
    operation(obj[keys[0]], value)
)

const setIn = (obj, keys, value) =>
  operationIn(obj, keys, (obj, value) => value, value)

const unsetIn = (obj, keys, keyOrIndex) =>
  operationIn(obj, keys, unset, keyOrIndex)

const push = (arr: AnyArray, value: any) =>
  arr.concat(value)

const pushIn = (arr: AnyArray, keys: KeyPath, value) =>
  operationIn(arr, keys, push, value)

const unshift = (arr: AnyArray, value: any) =>
  [value].concat(arr)

const unshiftIn = (arr: AnyArray, keys: KeyPath, value) =>
  operationIn(arr, keys, unshift, value)

const remove = (arr: AnyArray, value: any) =>
  dropIndex(arr, arr.indexOf(value))

const removeIn = (obj: AnyState, keys: KeyPath, value) =>
  operationIn(obj, keys, remove, value)

const removeWhere = (arr: AnyArray, predicate) =>
  dropIndex(arr, arr.findIndex(predicate))

const removeInWhere = (obj: AnyState, keys: KeyPath, predicate) =>
  operationIn(obj, keys, removeWhere, predicate)

const filter = (arr: AnyArray, predicate) => {
  var differIndex = arr.findIndex((item, index) => !predicate(item, index))
  if (differIndex === -1) { return arr }

  const next = arr.slice(0, differIndex)
  while (differIndex < arr.length) {
    var item = arr[differIndex++]
    if (predicate(item, differIndex)) { next.push(item) }
  }

  return next
}

const filterIn = (obj: AnyState, keys: KeyPath, predicate) =>
  operationIn(obj, keys, filter, predicate)

const merge = (obj, withObj) => {
  var differ = false
  for (var k in withObj) {
    if (obj[k] !== withObj[k]) {
      differ = true
      break
    }
  }

  if (differ) {
    var next = {}
    for (var k in obj) { next[k] = obj[k] }
    for (var k in withObj) { next[k] = withObj[k] }
    return next
  }

  return obj
}

const mergeIn = (obj, keys, withObj) =>
  operationIn(obj, keys, merge, withObj)

const without = (obj, keysToDrop: string[]) => {
  if (keysToDrop.some(key => key in obj)) {
    const next = {}
    for (var key in obj) {
      if (keysToDrop.indexOf(key) === -1) {
        next[key] = obj[key]
      }
    }
    return next
  }

  return obj
}

const withoutIn = (obj, keys, keysToDrop: string[]) =>
  operationIn(obj, keys, without, keysToDrop)

export {
  set, setIn,
  unset, unsetIn,
  
  push, pushIn,
  unshift, unshiftIn,
  filter, filterIn,
  remove, removeIn,
  removeWhere, removeInWhere,

  merge, mergeIn,
  without, withoutIn
}
