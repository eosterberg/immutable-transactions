import { operationIn } from './genericFunctions'

export const setObj = (obj, key, value) => {
  if (obj[key] === value) return obj

  const next = {}
  for (var k in obj) {
    next[k] = k === key ? value : obj[k]
  }
  return next
}

export const unsetObj = (obj, key) => {
  if (key in obj) {
    const next = {}
    for (var k in obj) {
      if (key !== k) { next[k] = obj[k] }
    }
    return next
  }

  return obj
}

export const merge = (obj, withObj) => {
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

export const mergeIn = (obj, keys, withObj) => operationIn(
  obj,
  keys,
  merge,
  withObj
)
