import { AnyState, AnyArray, KeyPath } from './types'
import { setArr, unsetArr } from "./arrayFunctions"
import { setObj, unsetObj } from "./objectFunctions"

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

const setIn = (obj, keys, value) => operationIn(
  obj,
  keys,
  (obj, value) => value,
  value
)

const unsetIn = (obj, keys, keyOrIndex) => operationIn(
  obj,
  keys,
  unset,
  keyOrIndex
)

export {
  set,
  unset,
  operationIn,
  setIn,
  unsetIn
}
