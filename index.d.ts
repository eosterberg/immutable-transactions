export declare type Key = string | number;
export declare type KeyPath = Key[];
export declare type Predicate = <T>(item: T, index: number) => boolean;
/**
 * Update a value for given @key.
 * @param object Object or array
 * @param key Key to set
 * @param value Value to set
 * @returns If @value differs from previous one, a new object/array with the updated key is returned, else original @object
 */
declare const set: <T>(object: T, key: string | number, value: any) => T;
/**
 * Like set, but updates the object/array at the end of the given @keys path.
 * @param object Object or array
 * @param keys List of keys where the object to set resides
 * @param value Value to set
 * @returns If @value differs from previous one, a new object/array with updated keys is returned, else original @object
 */
declare const setIn: <T>(object: T, keys: (string | number)[], value: any) => T;
/**
 * Like set, but updates the value at @key using the @modifier function´s return value.
 * @param object Object or array
 * @param key Key to set
 * @param modifier The modifier to transform previous value.
 * @returns If value differs from previous one, a new object/array with the updated key is returned, else original @object
 */
declare const change: <T, V>(object: T, key: string | number, modifier: (previousValue: V) => V) => T;
/**
 * Like change, but updates the object/array at the end of the given @keys path.
 * @param object Object or array
 * @param keys List of keys where the object to change resides
 * @param modifier The modifier to transform previous value.
 * @returns If value differs from previous one, a new object/array with the updated keys is returned, else original @object
 */
declare const changeIn: <T, V>(object: T, keys: (string | number)[], modifier: (previousValue: V) => V) => T;
/**
 * Unsets a key from an object, or removes item at index if array.
 * @param object Object or array
 * @param key Key/index to unset
 * @returns If key was present, a new object/array without the key, else previous @object
 */
declare const unset: <T>(object: T, key: string | number) => T;
/**
 * Like unset, but unsets the object/array key at the end of the given @keys path.
 * @param object Object or array
 * @param keys List of keys where the object to unset resides
 * @param key Key/index to unset
 * @returns If key was present, a new object/array without the key, else previous @object
 */
declare const unsetIn: <T>(object: T, keys: (string | number)[], keyToUnset: string | number) => T;
/**
 * Append an item at the end of an array.
 * @param array The array to append to
 * @param value The value to append
 * @returns A new array with value appended
 */
declare const append: <T>(array: T[], value: T) => T[];
/**
 * Like append, but appends @value to the array at the end of the given @keys path.
 * @param object Object or array
 * @param keys List of keys where the array to append to resides
 * @param value The value to append
 * @returns A new, updated @object
 */
declare const appendIn: <T>(object: T, keys: (string | number)[], value: any) => T;
/**
 * Like append, but insert @value at the beginning of the array.
 * @param array The array to prepend to
 * @param value The value to prepend
 * @returns A new array with value prepended
 */
declare const prepend: <T>(array: T[], value: T) => T[];
/**
 * Like prepend, but prepends @value to the array at the end of the given @keys path.
 * @param object Object or array
 * @param keys List of keys where the array to prepend to resides
 * @param value The value to prepend
 * @returns A new, updated @object
 */
declare const prependIn: <T>(object: T, keys: (string | number)[], value: any) => T;
/**
 * Remove the first occurence of @value from an array.
 * @param array The array to remove from
 * @param value The value to remove
 * @returns A new array without @value or original @array if @value wasn´t found
 */
declare const remove: <T>(array: T[], value: T) => T[];
/**
 * Like remove, but removes @value from the array at the end of the given @keys path.
 * @param object Object or array
 * @param keys List of keys where the array to remove from resides
 * @param value The value to remove
 * @returns A new, updated object, or original @object if @value wasn´t found
 */
declare const removeIn: <T>(object: T, keys: (string | number)[], value: any) => T;
/**
 * Remove the first occurence of an item where @predicate returns true.
 * @param array The array to remove from
 * @param predicate A test function to determine which item to remove
 * @returns A new array without item where predicate was met, or original @array if no item was found
 */
declare const removeWhere: <T>(array: T[], predicate: Predicate) => any;
/**
 * Like removeWhere, but removes an item from the array at the end of the given @keys path.
 * @param object Object or array
 * @param keys List of keys where the array to remove from resides
 * @param predicate A test function to determine which item to remove
 * @returns A new, updated @object, or original @object if no item was found
 */
declare const removeInWhere: <T>(object: T, keys: (string | number)[], predicate: Predicate) => T;
/**
 * Keep items in array where @predicate returns true.
 * @param array The array to filter
 * @param predicate A test function to determine which items to keep
 * @returns A new filtered array, or original array if @predicate was fulfilled for all items.
 */
declare const filter: <T>(array: T[], predicate: Predicate) => T[];
/**
 * Like filter, but filters items in the array at the end of the given @keys path.
 * @param object Object or array
 * @param keys List of keys where the array to filter resides
 * @param predicate A test function to determine which items to keep
 * @returns A new, updated @object, or original @object if @predicate was fulfilled for all items.
 */
declare const filterIn: <T>(object: T, keys: (string | number)[], predicate: Predicate) => T;
/**
 * Update an object with properties from @withObject
 * @param object Object to update
 * @param withObject Object with new properties
 * @returns A new, updated @object, or original @object if @withObject properties already matched.
 */
declare const merge: <T>(object: T, withObject: any) => T;
/**
 * Like merge, but merges the object at the end of the given @keys path.
 * @param object Object to update
 * @param keys List of keys where the object to merge resides
 * @param withObject Object with new properties
 * @returns A new, updated @object, or original @object if @withObject properties already matched.
 */
declare const mergeIn: <T>(object: T, keys: (string | number)[], withObject: any) => T;
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
declare const transmit: <T>(object: T, toObject: any) => T;
/**
 * Like transmit, but transmits properties from object at the end of the given @keys path.
 * @param object Object or array
 * @param keys List of keys where the object to transmit to resides
 * @param toObject Object to transmit key path target properties into
 * @returns A new, updated @object with @toObject at @keys path or original @object if @toObject properties already matched key path target.
 */
declare const transmitIn: <T>(object: T, keys: (string | number)[], toObject: any) => T;
/**
 * Like unset, but only works on objects and accepts a list of keys to drop.
 * @param object Object to update
 * @param keysToDrop List of keys to drop
 * @returns A new, updated @object, or original @object if properties were already missing.
 */
declare const without: <T>(object: T, keysToDrop: string[]) => T;
/**
 * Like @without, but drops properties from object at the end of the given @keys path.
 * @param object Object or array
 * @param keys List of keys where the object to drop from resides
 * @param keysToDrop List of keys to drop
 * @returns A new, updated @object, or original @object if properties already missing in key path target.
 */
declare const withoutIn: <T>(object: T, keys: (string | number)[], keysToDrop: string[]) => T;
export { set, setIn, change, changeIn, unset, unsetIn, append, appendIn, prepend, prependIn, filter, filterIn, remove, removeIn, removeWhere, removeInWhere, merge, mergeIn, transmit, transmitIn, without, withoutIn };
