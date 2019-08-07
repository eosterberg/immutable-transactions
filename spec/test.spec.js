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

const unsetObjRes = unsetObj(state, 'name')
console.log(unsetObjRes, unsetObjRes === state);

const unsetObjRes2 = unsetObj(state, 'foo')
console.log(unsetObjRes2, unsetObjRes2 === state);


const filterInRes = filterIn(state, ['interests', 'games'], (game) => game !== 'monopoly')
console.log(filterInRes, filterInRes === state);

const mergeInRes = mergeIn(state, ['interests', 'eating'], { fish: 2 })
console.log(mergeInRes, mergeInRes === state);

const res2222 = setIn(state, ['interests', 'music'], 42)
console.log(res2222, res2222 === state);

const res22222 = setIn(state, ['interests', 'games', -1], 'juggling')
console.log(res22222, res22222 === state);

const unsetInRes = unsetIn(state, ['interests', 'games'], 0)
console.log(unsetInRes, unsetInRes === state);

const unsetInRes2 = unsetIn(state, ['interests', 'eating'], 'eggs')
console.log(unsetInRes2, unsetInRes2 === state);

const res1 = set(state, 'name', 'Name')
console.log(state === res1);

const res2 = remove(state.skills, 'html')
console.log(res2);

const res22 = remove(state.skills, 'js')
console.log(res22);

const res222 = remove(state.skills, 'painting')
console.log(res222, res222 === state.skills);

const res3 = filter(state.skills, skill => skill !== 'painting')
console.log(res3, res3 === state.skills);

const res4 = filter(state.skills, skill => skill !== 'html')
console.log(res4, res4 === state.skills);

const res5 = filter(state.skills, skill => skill === 'painting')
console.log(res5, res5 === state.skills);

const res6 = merge(state.interests, { swimming: 3 })
console.log(res6, res6 === state.interests);

const res7 = merge(state.interests, { running: 7 })
console.log(res7, res7 === state.interests);

const res8 = merge(state.interests, {})
console.log(res8, res8 === state.interests);
