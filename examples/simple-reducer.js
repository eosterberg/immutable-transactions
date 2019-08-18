"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const state = {
    numberList: [1, 2, 3, 4],
    property: 'Hello',
    object: {
        prop1: 1,
        prop2: 2
    }
};
const reducer = (state, action) => {
    switch (action.type) {
        case 'ADD_NUMBER': {
            return index_1.appendIn(state, ['numberList'], action.value);
        }
        case 'REMOVE_NUMBER': {
            return index_1.removeIn(state, ['numberList'], action.value);
        }
        case 'FILTER_OUT_ODD_NUMBERS': {
            const numbers = state.numberList;
            const odd = index_1.filter(numbers, (_number, index) => (index % 2) !== 0);
            return index_1.set(state, 'numberList', odd);
        }
        case 'CHANGE_IN_OBJECT': {
            return index_1.changeIn(state, ['numberList', 0], action.modifier);
        }
        default: return state;
    }
};
const pushedNumberState = reducer(state, { type: 'ADD_NUMBER', value: 5 });
console.log(pushedNumberState);
const oddNumberState = reducer(state, { type: 'FILTER_OUT_ODD_NUMBERS' });
console.log(oddNumberState);
const updatedNumberState = reducer(state, { type: 'CHANGE_IN_OBJECT', modifier: number => number + 1 });
console.log(updatedNumberState, updatedNumberState.numberList);
