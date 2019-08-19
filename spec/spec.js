const  {
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
  without, withoutIn,
} = require('../index.js')

const state = {
  name: 'Name',
  age: 42,
  skills: [
    'js',
    'html',
    'css'
  ],
  interests: {
    running: 7,
    music: 9,
    games: [
      'monopoly',
      'warcraft 3'
    ],
    eating: {
      meat: 9,
      eggs: 6
    }
  }
}

describe('Generic functions', () => {

  it('Should bypass when set:ing existing value', () => {
    const next = set(state, 'name', 'Name')
    expect(next === state)
  })

  it('"set" function should accept negative array indexes', () => {
    const arr = [1, 2, 3]
    const next = set(arr, -1, 42)
    expect(next[2]).toBe(42)
    expect(arr === next).toBeFalsy()
  })

  it('"set" function should accept negative array indexes on empty array', () => {
    const arr = []
    const next = set(arr, -1, 42)
    expect(next[0]).toBe(42)
    expect(arr === next).toBeFalsy()
  })

  it('Should be able to set a nested object property', () => {
    const next = setIn(state, ['interests', 'music'], 42)
    expect(next.interests.music).toBe(42)
    expect(next === state).toBeFalsy()
  })

  it('Should return original object if nested object property was set to previous value', () => {
    const next = setIn(state, ['interests', 'music'], 9)
    expect(next.interests.music).toBe(9)
    expect(next === state).toBeTruthy()
  })

  it('setIn should support array indexes', () => {
    const next = setIn(state, ['interests', 'games', 0], 'juggling')
    expect(next.interests.games[0]).toBe('juggling')
    expect(next === state).toBeFalsy()
  })

  it('setIn should support negative array indexes', () => {
    const next = setIn(state, ['interests', 'games', -1], 'juggling')
    expect(next.interests.games[1]).toBe('juggling')
    expect(next === state).toBeFalsy()
  })

  it('Should should support dropping array indexes', () => {
    const next = unsetIn(state, ['interests', 'games'], 0)
    expect(next.interests.games.indexOf('monopoly')).toBe(-1)
    expect(next.interests.games.length).toBe(state.interests.games.length - 1)
    expect(next === state).toBeFalsy()
  })

  it('Should unset object props in nested state', () => {
    const next = unsetIn(state, ['interests', 'eating'], 'eggs')
    expect(next.interests.eating.eggs).toBeUndefined()
    expect(next === state).toBeFalsy()
  })

  it('Change function should take a modifier function with the previous value at the given key as argument, and set the returned value.', () => {
    const next = change(state, 'name', name => name + ' Lastname')
    expect(next.name).toBe('Name Lastname')
    expect(next === state).toBeFalsy()
  })

  it('changeIn function should take a modifier function with the previous value at the given key path as argument, and set the returned value.', () => {
    const next = changeIn(state, ['skills', 0], jsSkill => jsSkill + ' + ts')
    expect(next.skills[0]).toBe('js + ts')
    expect(next === state).toBeFalsy()
  })

  it('changeIn function should also work on objects.', () => {
    const next = changeIn(state, ['interests', 'eating', 'meat'], foodLiking => foodLiking + 1)
    expect(next.interests.eating.meat).toBe(10)
    expect(next === state).toBeFalsy()
  })

  it('if changeIn modifier didnt modify, return previous object:', () => {
    const next = changeIn(state, ['interests', 'eating', 'meat'], foodLiking => foodLiking + 0)
    expect(next.interests.eating.meat).toBe(9)
    expect(next === state).toBeTruthy()
    expect(next.interests.eating === state.interests.eating).toBeTruthy()
  })


})

describe('Array functions', () => {

  it('Should append item and mutate array', () => {
    const next = append(state.skills, 'jira')
    expect(next[3]).toBe('jira')
    expect(next === state.skills).toBeFalsy()
  })

  it('Should appendIn', () => {
    const next = appendIn(state, ['interests', 'games'], 'No Man\'s Sky')
    expect(next.interests.games[2]).toBe('No Man\'s Sky')
    expect(next.interests.games === state.interests.games).toBeFalsy()
  })

  it('Should prepend', () => {
    const next = prepend(state.skills, 'jira')
    expect(next[0]).toBe('jira')
    expect(next === state.skills).toBeFalsy()
  })

  it('Should prependIn', () => {
    const next = prependIn(state, ['interests', 'games'], 'No Man\'s Sky')
    expect(next.interests.games[0]).toBe('No Man\'s Sky')
    expect(next.interests.games === state.interests.games).toBeFalsy()
  })

  it('Should remove existing item', () => {
    const next = remove(state.skills, 'html')
    expect(next.indexOf('html')).toBe(-1)
    expect(next.length).toBe(state.skills.length - 1)
    expect(next === state.skills).toBeFalsy()
  })

  it('Should remove first item in list', () => {
    const next = remove(state.skills, 'js')
    expect(next.indexOf('js')).toBe(-1)
    expect(next.length).toBe(state.skills.length - 1)
    expect(next === state.skills).toBeFalsy()
  })

  it('Should bypass if trying to remove a non-existent value', () => {
    const next = remove(state.skills, 'painting')
    expect(next).toBe(state.skills)
  })

  it('Should remove existing items in nested object', () => {
    const next = removeIn(state, ['interests', 'games'], 'monopoly')
    expect(next.interests.games.indexOf('monopoly')).toBe(-1)
    expect(next.interests.games.length).toBe(state.interests.games.length - 1)
    expect(next === state).toBeFalsy()
  })

  it('Should removeWhere existing item matches', () => {
    const next = removeWhere(state.skills, skill => skill === 'html')
    expect(next.indexOf('html')).toBe(-1)
    expect(next.length).toBe(state.skills.length - 1)
    expect(next === state.skills).toBeFalsy()
  })

  it('Should bypass if trying to removeWhere a non-existent value', () => {
    const next = removeWhere(state.skills, skill => skill === 'painting')
    expect(next).toBe(state.skills)
  })

  it('Should removeInWhere existing item matches', () => {
    const next = removeInWhere(state, ['skills'], skill => skill === 'html')
    expect(next.skills.indexOf('html')).toBe(-1)
    expect(next.skills.length).toBe(state.skills.length - 1)
    expect(next === state).toBeFalsy()
  })

  it('Should filter items', () => {
    const next = filter(state.skills, skill => skill !== 'html')
    expect(next.indexOf('html')).toBe(-1)
    expect(next.length).toBe(state.skills.length - 1)
    expect(next === state.skills).toBeFalsy()
  })

  it('Should return original list if filter yields same items', () => {
    const next = filter(state.skills, skill => skill !== 'painting')
    expect(next === state.skills).toBeTruthy()
  })

  it('Filter might render empty array', () => {
    const next = filter(state.skills, skill => skill === 'painting')
    expect(next.length).toBe(0)
    expect(next === state.interests).toBeFalsy()
  })

  it('Should filter items in nested objects aswell', () => {
    const next = filterIn(state, ['skills'], skill => skill !== 'html')
    expect(next.skills.indexOf('html')).toBe(-1)
    expect(next.skills.length).toBe(state.skills.length - 1)
    expect(next === state).toBeFalsy()
  })

  it('Should include index as second argument in predicate', () => {
    const numbers = [1, 2, 3, 4]
    const odd = filter(numbers, (_number, index) => (index % 2) === 0)
    expect(odd[0]).toBe(1)
    expect(odd[1]).toBe(3)
    expect(odd === numbers).toBeFalsy()
  })

})

describe("object functions", () => {

  it('Should unset a property', () => {
    const next = unset(state, 'name')
    expect(next.name).toBeUndefined()
    expect(next === state).toBeFalsy()
    expect(next.interests).toBe(state.interests)
  })

  it('Should bypass when unsetting an undefined property', () => {
    const next = unset(state, 'foo')
    expect(next).toBe(state)
  })

  it('Should add prop via merge', () => {
    const next = merge(state.interests, { swimming: 3 })
    expect(next.swimming).toBe(3)
    expect(next === state).toBeFalsy()
  })

  it('Should bypass when merging existing values', () => {
    const next = merge(state.interests, { running: 7 })
    expect(next).toBe(state.interests)
  })

  it('Should bypass when merging an empty object', () => {
    const next = merge(state.interests, {})
    expect(next).toBe(state.interests)
  })

  it('Should do a merge in sub path', () => {
    const next = mergeIn(state, ['interests', 'eating'], { fish: 2 })
    expect(next.interests.eating.fish).toBe(2)
    expect(next === state.interests.eating).toBeFalsy()
  })

  it('Should add prop via transmit, returned object should be 2nd argument (the obj transmitted to)', () => {
    const next = { swimming: 3 }
    const transmitted = transmit(state.interests, next)
    expect(transmitted.swimming).toBe(3)
    expect(transmitted === next).toBeTruthy()
    expect(transmitted === state.interests).toBeFalsy()
  })

  it('Should add props via transmit, props from previous object should follow along', () => {
    const next = { swimming: 3, running: 7 }
    const transmitted = transmit(state.interests, next)
    expect(transmitted.swimming).toBe(3)
    expect(transmitted.running).toBe(7)
    expect(transmitted.music).toBe(9)
  })

  it('Transmit should bypass when trying to transmit existing values (just like merge)', () => {
    const next = transmit(state.interests, { running: 7 })
    expect(next).toBe(state.interests)
  })

  it('Should do deep transmit', () => {
    const next = { dairy: 3 }
    const transmitted = transmitIn(state, ['interests', 'eating'], next)
    expect(transmitted.interests.eating.dairy).toBe(3)
    expect(transmitted.interests.eating === next).toBeTruthy()
    expect(transmitted === state).toBeFalsy()
  })

  it('"without" should drop a list of keys from an object', () => {
    const next = without(state, ['name', 'age'])
    expect(next.name).toBeUndefined()
    expect(next.age).toBeUndefined()
    expect(next === state).toBeFalsy()
  })

  it('"without" should not mutate object if dropped keys was already missing', () => {
    const next = without(state, ['foo', 'bar'])
    expect(next === state).toBeTruthy()
  })

  it('"withoutIn" should drop a list of keys from a sub object', () => {
    const next = withoutIn(state, ['interests'], ['running', 'music'])
    expect(next.interests.running).toBeUndefined()
    expect(next.interests.music).toBeUndefined()
    expect(next === state).toBeFalsy()
    expect(next.interests === state.interests).toBeFalsy()
  })

})
