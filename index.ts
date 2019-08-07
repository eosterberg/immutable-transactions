import { setArr, unsetArr, filter } from "./src/arrayFunctions"
import { setObj, unsetObj, merge } from "./src/objectFunctions"

const {isArray} = Array

export const set = (obj, key, value) => {
  return (
    isArray(obj) ? setArr : setObj
  )(obj, key, value)
}

export const unset = (obj, keyOrIndex) => {
  return (
    isArray(obj) ? unsetArr : unsetObj
  )(obj, keyOrIndex)
}

const operationIn = (obj, keys, operation, value) => {
  if (keys.length > 1) {
    const key = keys[0]
    return set(
      obj,
      key,
      operationIn(obj[key], keys.slice(1), operation, value)
    )
  }

  return operation(obj, keys[0], value)
}

export const setIn = (obj, keys, value) => operationIn(obj, keys, set, value)

export const unsetIn = (obj, keys, keyOrIndex) => operationIn(
  obj,
  keys,
  (obj, key, keyOrIndex) => set(obj, key, unset(obj[key], keyOrIndex)),
  keyOrIndex
)

export const mergeIn = (obj, keys, withObj) => {
  return operationIn(
    obj,
    keys,
    (obj, key, withObj) => set(obj, key, merge(obj[key], withObj)),
    withObj
  )
}

export const filterIn = (obj, keys, predicate) => {
  return operationIn(
    obj,
    keys,
    (obj, key, predicate) => set(obj, key, filter(obj[key], predicate)),
    predicate
  )
}

export { setArr, unsetArr, filter, setObj, unsetObj, merge }
