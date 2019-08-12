export type Key = string | number
export type KeyPath = Key[]
export type Predicate = <T>(item: T, index: number) => boolean

const normalizeIndex = (arr, index) => {
  if (index < 0) {
    if (arr.length === 0) return 0
    
    do {
      index = arr.length + index
    } while (index < 0)
  }

  return index
}

const dropIndex = (arr, index) =>
  index === -1 ?
    arr :
    arr.slice(0, index).concat(arr.slice(index + 1))

const {isArray} = Array

const set = <T>(obj: T, key: Key, value): T => {
  if (isArray(obj)) {
    key = normalizeIndex(obj, key)

    if (obj[key] === value) return obj
  
    const next = obj.slice() as any
    next[key] = value
    return next
  }

  if (obj[key] === value) return obj

  const next = {} as T
  for (var k in obj) {
    next[k] = k === key ? value : obj[k]
  }
  return next
}

const unset = <T>(obj: T, key: Key): T => {
  if (isArray(obj)) {
    return dropIndex(obj, normalizeIndex(obj, key))
  }

  if (key in obj) {
    const next = {} as T
    for (var k in obj) {
      if (key !== k) { next[k] = obj[k] }
    }
    return next
  }

  return obj
}

const operationIn = (obj, keys: KeyPath, operation, value) => set(
  obj,
  keys[0],
  keys.length > 1 ?
    operationIn(obj[keys[0]], keys.slice(1), operation, value) :
    operation(obj[keys[0]], value)
)

const setIn = <T>(obj: T, keys: KeyPath, value): T =>
  operationIn(obj, keys, (_obj, value) => value, value)

const unsetIn = <T>(obj: T, keys: KeyPath, keyToUnset: Key): T =>
  operationIn(obj, keys, unset, keyToUnset)

const push = <T>(arr: T[], value: T) =>
  arr.concat(value)

const pushIn = <T>(obj: T, keys: KeyPath, value): T =>
  operationIn(obj, keys, push, value)

const unshift = <T>(arr: T[], value: T) =>
  [value].concat(arr)

const unshiftIn = <T>(obj: T, keys: KeyPath, value): T =>
  operationIn(obj, keys, unshift, value)

const remove = <T>(arr: T[], value: T): T[] =>
  dropIndex(arr, arr.indexOf(value))

const removeIn = <T>(obj: T, keys: KeyPath, value): T =>
  operationIn(obj, keys, remove, value)

const removeWhere = <T>(arr: T[], predicate: Predicate) =>
  dropIndex(arr, arr.findIndex(predicate))

const removeInWhere = <T>(obj: T, keys: KeyPath, predicate: Predicate): T =>
  operationIn(obj, keys, removeWhere, predicate)

const filter = <T>(arr: T[], predicate: Predicate) => {
  var differIndex = arr.findIndex((item, index) => !predicate(item, index))
  if (differIndex === -1) { return arr }

  const next = arr.slice(0, differIndex)
  while (differIndex < arr.length) {
    var item = arr[differIndex]
    if (predicate(item, differIndex++)) { next.push(item) }
  }

  return next
}

const filterIn = <T>(obj: T, keys: KeyPath, predicate: Predicate): T =>
  operationIn(obj, keys, filter, predicate)

const merge = <T>(obj: T, withObj) => {
  for (var k in withObj) {
    if (obj[k] !== withObj[k]) {
      const next = {} as T
      for (k in obj) { next[k] = obj[k] }
      for (k in withObj) { next[k] = withObj[k] }
      return next
    }
  }

  return obj
}

const mergeIn = <T>(obj: T, keys: KeyPath, withObj): T =>
  operationIn(obj, keys, merge, withObj)

const without = <T>(obj: T, keysToDrop: string[]): T => {
  if (keysToDrop.some(key => key in obj)) {
    const next = {} as T
    for (var key in obj) {
      if (keysToDrop.indexOf(key) === -1) {
        next[key] = obj[key]
      }
    }
    return next
  }

  return obj
}

const withoutIn = <T>(obj: T, keys: KeyPath, keysToDrop: string[]): T =>
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
