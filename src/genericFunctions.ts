import { setArr, unsetArr } from "./arrayFunctions"
import { setObj, unsetObj } from "./objectFunctions"

const {isArray} = Array

const set = (obj, key, value) => {
  return (
    isArray(obj) ? setArr : setObj
  )(obj, key, value)
}

const unset = (obj, keyOrIndex) => {
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

const setIn = (obj, keys, value) => operationIn(obj, keys, set, value)

const unsetIn = (obj, keys, keyOrIndex) => operationIn(
  obj,
  keys,
  (obj, key, keyOrIndex) => set(obj, key, unset(obj[key], keyOrIndex)),
  keyOrIndex
)

export {
  set,
  unset,
  operationIn,
  setIn,
  unsetIn
}
