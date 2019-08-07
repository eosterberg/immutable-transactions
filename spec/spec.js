const  {
  unsetObj,
  filterIn,
  mergeIn,
  merge,
  filter,
  remove,
  set,
  unsetIn,
  setIn,
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

  it('Should bypass when set:ing exsiting value', () => {
    const next = set(state, 'name', 'Name')
    expect(next === state)
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

})

describe('Array functions', () => {

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

})

describe("object functions", () => {

  it('Should unset a property', () => {
    const next = unsetObj(state, 'name')
    expect(next.name).toBeUndefined()
    expect(next === state).toBeFalsy()
    expect(next.interests).toBe(state.interests)
  })

  it('Should bypass when unsetting an undefined property', () => {
    const next = unsetObj(state, 'foo')
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

})