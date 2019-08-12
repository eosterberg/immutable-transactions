# immutable-transactions

_immutable-transactions_ is a JavaScript library simplifying transactions in application state where you want to enforce strict immutability while still using native JavaScript objects and arrays.

It´s a simple and lightweight alternative to Immutable.js or Seamless-Immutable.

Some features:

- If the transaction didn't cause any changes, the previous object will be returned.
- Make operations deep in a nested object using a list of keys, return the top object.
- Supports negative array indexes.
