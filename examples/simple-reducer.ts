import { appendIn, removeIn, filter, set, changeIn } from '../index'

interface State {
  numberList: number[]
  property: string
  object: {
    prop1: number
    prop2: number
  }
}

const state: State = {
  numberList: [1, 2, 3, 4],
  property: 'Hello',
  object: {
    prop1: 1,
    prop2: 2
  }
}

const reducer = (state: State, action) => {
  switch (action.type) {
    case 'ADD_NUMBER': {
      return appendIn(state, ['numberList'], action.value)
    }

    case 'REMOVE_NUMBER': {
      return removeIn(state, ['numberList'], action.value)
    }

    case 'FILTER_OUT_ODD_NUMBERS': {
      const numbers = state.numberList
      const odd = filter(numbers, (_number, index) => (index % 2) !== 0)
      return set(state, 'numberList', odd)
    }

    case 'CHANGE_IN_OBJECT': {
      return changeIn(state, ['numberList', 0], action.modifier)
    }

    default: return state
  }
}



const pushedNumberState = reducer(state, {type: 'ADD_NUMBER', value: 5})
console.log(pushedNumberState) 

const oddNumberState = reducer(state, {type: 'FILTER_OUT_ODD_NUMBERS'})
console.log(oddNumberState) 

const updatedNumberState = reducer(state, {type: 'CHANGE_IN_OBJECT', modifier: number => number + 1})
console.log(updatedNumberState, updatedNumberState.numberList) 
