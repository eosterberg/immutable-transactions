export type Key = string | number
export type KeyPath = Key[]
export type Predicate = <T>(item: T, index: number) => boolean

const normalizeIndex = (array, index) => {
  if (index < 0) {
    if (array.length === 0) return 0
    
    do {
      index = array.length + index
    } while (index < 0)
  }

  return index
}

const dropIndex = (array, index) =>
  index === -1 ?
    array :
    array.slice(0, index).concat(array.slice(index + 1))

const {isArray} = Array

/**
 * Update a value for given @key.
 * @param object Object or array
 * @param key Key to set
 * @param value Value to set
 * @returns If @value differs from previous one, a new object/array with the updated key is returned, else original @object
 */
const set = <T>(object: T, key: Key, value): T => {
  if (isArray(object)) {
    key = normalizeIndex(object, key)

    if (object[key] === value) return object
  
    const next = object.slice() as any
    next[key] = value
    return next
  }

  if (object[key] === value) return object

  const next = {} as T
  for (var objKey in object) {
    next[objKey] = objKey === key ? value : object[objKey]
  }

  return next
}

const operationIn = (object, keys: KeyPath, operation, value) => set(
  object,
  keys[0],
  keys.length > 1 ?
    operationIn(object[keys[0]], keys.slice(1), operation, value) :
    operation(object[keys[0]], value)
)

/**
 * Like set, but updates the object/array at the end of the given @keys path.
 * @param object Object or array
 * @param keys List of keys where the object to set resides
 * @param value Value to set
 * @returns If @value differs from previous one, a new object/array with updated keys is returned, else original @object
 */
const setIn = <T>(object: T, keys: KeyPath, value): T =>
  operationIn(object, keys, (_obj, value) => value, value)

/**
 * Like set, but updates the value at @key using the @modifier function´s return value.
 * @param object Object or array
 * @param key Key to set
 * @param modifier The modifier to transform previous value.
 * @returns If value differs from previous one, a new object/array with the updated key is returned, else original @object
 */
const change = <T, V>(object: T, key: Key, modifier: (previousValue: V) => V): T =>
  set(object, key, modifier(object[key]))

/**
 * Like change, but updates the object/array at the end of the given @keys path.
 * @param object Object or array
 * @param keys List of keys where the object to change resides
 * @param modifier The modifier to transform previous value.
 * @returns If value differs from previous one, a new object/array with the updated keys is returned, else original @object
 */
const changeIn = <T, V>(object: T, keys: KeyPath, modifier: (previousValue: V) => V): T =>
  operationIn(object, keys, (previousValue, modifier) => modifier(previousValue), modifier)

/**
 * Unsets a key from an object, or removes item at index if array.
 * @param object Object or array
 * @param key Key/index to unset
 * @returns If key was present, a new object/array without the key, else previous @object
 */
const unset = <T>(object: T, key: Key): T => isArray(object) ?
  dropIndex(object, normalizeIndex(object, key)) :
  without(object, [key as string])

/**
 * Like unset, but unsets the object/array key at the end of the given @keys path.
 * @param object Object or array
 * @param keys List of keys where the object to unset resides
 * @param key Key/index to unset
 * @returns If key was present, a new object/array without the key, else previous @object
 */
const unsetIn = <T>(object: T, keys: KeyPath, keyToUnset: Key): T =>
  operationIn(object, keys, unset, keyToUnset)

/**
 * Append an item at the end of an array.
 * @param array The array to append to
 * @param value The value to append
 * @returns A new array with value appended
 */
const append = <T>(array: T[], value: T) =>
  array.concat([value])

/**
 * Like append, but appends @value to the array at the end of the given @keys path.
 * @param object Object or array
 * @param keys List of keys where the array to append to resides
 * @param value The value to append
 * @returns A new, updated @object
 */
const appendIn = <T>(object: T, keys: KeyPath, value): T =>
  operationIn(object, keys, append, value)

/**
 * Like append, but insert @value at the beginning of the array.
 * @param array The array to prepend to
 * @param value The value to prepend
 * @returns A new array with value prepended
 */
const prepend = <T>(array: T[], value: T) =>
  [value].concat(array)

/**
 * Like prepend, but prepends @value to the array at the end of the given @keys path.
 * @param object Object or array
 * @param keys List of keys where the array to prepend to resides
 * @param value The value to prepend
 * @returns A new, updated @object
 */
const prependIn = <T>(object: T, keys: KeyPath, value): T =>
  operationIn(object, keys, prepend, value)

/**
 * Remove the first occurence of @value from an array.
 * @param array The array to remove from
 * @param value The value to remove
 * @returns A new array without @value or original @array if @value wasn´t found
 */
const remove = <T>(array: T[], value: T): T[] =>
  dropIndex(array, array.indexOf(value))

/**
 * Like remove, but removes @value from the array at the end of the given @keys path.
 * @param object Object or array
 * @param keys List of keys where the array to remove from resides
 * @param value The value to remove
 * @returns A new, updated object, or original @object if @value wasn´t found
 */
const removeIn = <T>(object: T, keys: KeyPath, value): T =>
  operationIn(object, keys, remove, value)

/**
 * Remove the first occurence of an item where @predicate returns true.
 * @param array The array to remove from
 * @param predicate A test function to determine which item to remove
 * @returns A new array without item where predicate was met, or original @array if no item was found
 */
const removeWhere = <T>(array: T[], predicate: Predicate) =>
  dropIndex(array, array.findIndex(predicate))

/**
 * Like removeWhere, but removes an item from the array at the end of the given @keys path.
 * @param object Object or array
 * @param keys List of keys where the array to remove from resides
 * @param predicate A test function to determine which item to remove
 * @returns A new, updated @object, or original @object if no item was found
 */
const removeInWhere = <T>(object: T, keys: KeyPath, predicate: Predicate): T =>
  operationIn(object, keys, removeWhere, predicate)

/**
 * Keep items in array where @predicate returns true.
 * @param array The array to filter
 * @param predicate A test function to determine which items to keep
 * @returns A new filtered array, or original array if @predicate was fulfilled for all items.
 */
const filter = <T>(array: T[], predicate: Predicate) => {
  var differIndex = array.findIndex((item, index) => !predicate(item, index))
  if (differIndex === -1) { return array }

  const next = array.slice(0, differIndex)
  while (differIndex < array.length) {
    var item = array[differIndex]
    if (predicate(item, differIndex++)) { next.push(item) }
  }

  return next
}

/**
 * Like filter, but filters items in the array at the end of the given @keys path.
 * @param object Object or array
 * @param keys List of keys where the array to filter resides
 * @param predicate A test function to determine which items to keep
 * @returns A new, updated @object, or original @object if @predicate was fulfilled for all items.
 */
const filterIn = <T>(object: T, keys: KeyPath, predicate: Predicate): T =>
  operationIn(object, keys, filter, predicate)

/**
 * Update an object with properties from @withObject
 * @param object Object to update
 * @param withObject Object with new properties
 * @returns A new, updated @object, or original @object if @withObject properties already matched.
 */
const merge = <T>(object: T, withObject) => {
  for (var key in withObject) {
    if (object[key] !== withObject[key]) {
      const next = {} as T
      for (key in object) { next[key] = object[key] }
      for (key in withObject) { next[key] = withObject[key] }
      return next
    }
  }

  return object
}

/**
 * Like merge, but merges the object at the end of the given @keys path.
 * @param object Object to update
 * @param keys List of keys where the object to merge resides
 * @param withObject Object with new properties
 * @returns A new, updated @object, or original @object if @withObject properties already matched.
 */
const mergeIn = <T>(object: T, keys: KeyPath, withObject): T =>
  operationIn(object, keys, merge, withObject)

/**
 * Like merge, but returns an updated @toObject if changes occured. By reusing @toObject a small performance boost is possible from not having to allocate an extra object and copying properties.
 * @example
 * const prev = {foo: 'foo'}
 * const next = {bar: 'bar'}
 * const transmitted = transmit(prev, next)
 * next // => {foo: 'foo', bar: 'bar'}
 * next === transmitted // => true
 * @param object Object to transmit from
 * @param toObject Object to transmit @object properties into
 * @returns @toObject with properties from @object, or original @object if properties already matched.
 */
const transmit = <T>(object: T, toObject): T => {
  for (var key in toObject) {
    if (object[key] !== toObject[key]) {
      for (key in object) {
        if (!(key in toObject)) {
          toObject[key] = object[key]
        }
      }
      return toObject
    }
  }

  return object
}

/**
 * Like transmit, but transmits properties from object at the end of the given @keys path.
 * @param object Object or array
 * @param keys List of keys where the object to transmit to resides
 * @param toObject Object to transmit key path target properties into
 * @returns A new, updated @object with @toObject at @keys path or original @object if @toObject properties already matched key path target.
 */
const transmitIn = <T>(object: T, keys: KeyPath, toObject): T =>
  operationIn(object, keys, transmit, toObject)

/**
 * Like unset, but only works on objects and accepts a list of keys to drop.
 * @param object Object to update
 * @param keysToDrop List of keys to drop
 * @returns A new, updated @object, or original @object if properties were already missing.
 */
const without = <T>(object: T, keysToDrop: string[]): T => {
  if (keysToDrop.some(key => key in object)) {
    const next = {} as T
    for (var key in object) {
      if (keysToDrop.indexOf(key) === -1) {
        next[key] = object[key]
      }
    }
    return next
  }

  return object
}

/**
 * Like @without, but drops properties from object at the end of the given @keys path.
 * @param object Object or array
 * @param keys List of keys where the object to drop from resides
 * @param keysToDrop List of keys to drop
 * @returns A new, updated @object, or original @object if properties already missing in key path target.
 */
const withoutIn = <T>(object: T, keys: KeyPath, keysToDrop: string[]): T =>
  operationIn(object, keys, without, keysToDrop)

export {
  set, setIn,
  change, changeIn,
  unset, unsetIn,
  
  append, appendIn,
  prepend, prependIn,
  filter, filterIn,
  remove, removeIn,
  removeWhere, removeInWhere,

  merge, mergeIn,
  transmit, transmitIn,
  without, withoutIn
}
