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

const filterInRes = filterIn(state, ['interests', 'games'], (game) => game !== 'monopoly')
// console.log(filterInRes, filterInRes === state);

const res2222 = setIn(state, ['interests', 'music'], 42)
// console.log(res2222, res2222 === state);

const res22222 = setIn(state, ['interests', 'games', -1], 'juggling')
// console.log(res22222, res22222 === state);

const unsetInRes = unsetIn(state, ['interests', 'games'], 0)
// console.log(unsetInRes, unsetInRes === state);

const unsetInRes2 = unsetIn(state, ['interests', 'eating'], 'eggs')
// console.log(unsetInRes2, unsetInRes2 === state);

const res1 = set(state, 'name', 'Name')
// console.log(state === res1);

const res2 = remove(state.skills, 'html')
// console.log(res2);

const res22 = remove(state.skills, 'js')
// console.log(res22);

const res222 = remove(state.skills, 'painting')
// console.log(res222, res222 === state.skills);

const res3 = filter(state.skills, skill => skill !== 'painting')
// console.log(res3, res3 === state.skills);

const res4 = filter(state.skills, skill => skill !== 'html')
// console.log(res4, res4 === state.skills);

const res5 = filter(state.skills, skill => skill === 'painting')
// console.log(res5, res5 === state.skills);

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
